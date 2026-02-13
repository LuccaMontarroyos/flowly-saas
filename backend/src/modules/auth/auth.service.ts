import { Prisma, Role } from "@prisma/client";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { MailService } from "../../shared/providers/mail.service";
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from "./dtos/auth.dtos";

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

      const verificationToken = await (tx as Prisma.TransactionClient).verificationToken.create({
        data: {
          token: crypto.randomBytes(32).toString("hex"),
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
        },
      });

      return { company, user, verificationToken };
    });

    const frontendUrl =
      process.env.NEXT_APP_PUBLIC_URL || "http://localhost:3001";
    const verifyLink = `${frontendUrl}/auth/verify?token=${result.verificationToken.token}`;

    await this.mailService.sendVerificationEmail(
      result.user.email,
      verifyLink,
      result.user.name
    );

    return {
      message: "Account created. Please check your email to verify your account.",
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

    if (!user.emailVerifiedAt) {
      throw new AppError("Email not verified", 403);
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

  async verifyEmail(token: string) {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    if (new Date() > verificationToken.expiresAt) {
      throw new AppError("Verification token expired", 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerifiedAt: new Date() },
      });
      await tx.verificationToken.delete({
        where: { id: verificationToken.id },
      });
    });

    const user = verificationToken.user;
    const tokenJwt = this.generateToken(user.id, user.companyId, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      company: {
        id: user.companyId,
      },
      token: tokenJwt,
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