import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import argon2 from "argon2";
import { Role } from "@prisma/client";
import crypto from "crypto";

interface CreateMemberDTO {
  name: string;
  email: string;
  adminCompanyId: string;
}

export class UserService {
  
  async createMember({ name, email, adminCompanyId }: CreateMemberDTO) {

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

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
        role: Role.MEMBER,
        companyId: adminCompanyId,
      },
    });


    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      tempPassword,
    };
  }

  async listByCompany(companyId: string) {
    return await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}