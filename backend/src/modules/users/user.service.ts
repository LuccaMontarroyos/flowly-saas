import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import argon2 from "argon2";
import { Role } from "@prisma/client";
import crypto from "crypto";
import { InviteService } from "../invite/invite.service";


interface CreateMemberDTO {
  name: string;
  email: string;
  adminCompanyId: string;
}

interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  inviteToken?: string;
}

interface ListUsersParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
}

export class UserService {
  private inviteService = new InviteService();

  async register({ name, email, password, companyName, inviteToken }: RegisterUserDTO) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new AppError("User already exists");
    }

    const hashedPassword = await argon2.hash(password);

    let userCompanyId = "";
    let userRole: Role = "ADMIN";

    if (inviteToken) {
        const invite = await this.inviteService.validateInvite(inviteToken);
        
        if (invite.email && invite.email !== email) {
            throw new AppError("This invite is for a different email address", 403);
        }

        userCompanyId = invite.companyId;
        userRole = invite.role;
    } else {
        if (!companyName) throw new AppError("Company name is required", 400);

        const company = await prisma.company.create({
            data: { name: companyName },
        });
        userCompanyId = company.id;
        userRole = "ADMIN";
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        companyId: userCompanyId,
      },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
    };
  }

    async createMember({ name, email, adminCompanyId }: CreateMemberDTO) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new AppError("User already exists");
    }

    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await argon2.hash(tempPassword);

    const member = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
        companyId: adminCompanyId,
      },
    });

    console.log(`[EMAIL MOCK] Sending password ${tempPassword} to ${email}`);

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      tempPassword,
    };
  }

  async listByCompany({ companyId, page, limit, search }: ListUsersParams) {
    const skip = (page - 1) * limit;

    const whereCondition = {
      companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: { page, limit, total, totalPages },
    };
  }

  async updateRole(userId: string, newRole: Role, requestorId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    if (userId === requestorId) {
      throw new AppError("You cannot change your own role", 400);
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { id: true, name: true, avatarUrl: true }
    });
  }
  
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
      },
    });

    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async remove(userId: string, requestorId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    if (userId === requestorId) {
      throw new AppError("You cannot remove yourself", 400);
    }

    await prisma.user.delete({ where: { id: userId } });
  }
}