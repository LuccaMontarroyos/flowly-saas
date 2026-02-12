import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Role, User } from "@prisma/client";
import slugify from "slugify";
import crypto from "crypto";
import { MailService } from "../../shared/providers/mail.service";

interface RegisterDTO {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface ForgotPasswordDTO {
  email: string;
}

interface ResetPasswordDTO {
  token: string;
  password: string;
}

export class AuthService {

  private mailService: MailService;

  constructor() {
    this.mailService = new MailService();
  }

  async register({ companyName, name, email, password }: RegisterDTO) {

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("Email already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const slug = await this.generateUniqueSlug(companyName);

    const result = await prisma.$transaction(async (tx) => {

      const company = await tx.company.create({
        data: {
          name: companyName,
          slug: slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.ADMIN,
          companyId: company.id,
        },
      });

      return { company, user };
    });

    const token = this.generateToken(result.user.id, result.company.id, result.user.role);

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
        slug: result.company.slug,
      },
      token,
    };
  }

  async login({ email, password }: LoginDTO) {

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(user.id, user.companyId, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      company: {
        id: user.company.id,
        name: user.company.name,
        slug: user.company.slug,
      },
      token,
    };
  }


  private async generateUniqueSlug(companyName: string): Promise<string> {

    const baseSlug = slugify(companyName, {
      lower: true,
      strict: true,
      trim: true,
      locale: 'pt'
    });

    const existingCompany = await prisma.company.findUnique({
      where: { slug: baseSlug },
    });

    if (!existingCompany) {
      return baseSlug;
    }


    const randomSuffix = crypto.randomBytes(2).toString('hex');
    return `${baseSlug}-${randomSuffix}`;
  }


  private generateToken(userId: string, companyId: string, role: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    return jwt.sign(
      { companyId, role },
      secret,
      { subject: userId, expiresIn: "1d" }
    );
  }

  async forgotPassword({ email }: ForgotPasswordDTO) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return; 
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });


    const frontendUrl = process.env.NEXT_APP_PUBLIC_URL || "http://localhost:3001";
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.mailService.sendForgotPasswordEmail(user.email, resetLink, user.name);
  }

  async resetPassword({ token, password }: ResetPasswordDTO) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken) {
      throw new AppError("Invalid or expired token", 400);
    }

    if (new Date() > resetToken.expiresAt) {
      throw new AppError("Token expired", 400);
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
    ]);
  }
}