import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { Role } from "@prisma/client";
import crypto from "crypto";
import { MailService } from "../../shared/providers/mail.service";

export class InviteService {
  
  private mailService: MailService;

  constructor() {
    this.mailService = new MailService();
  }
  
  async createInvite(companyId: string, userId: string, role: Role, email?: string) {
    const [company, inviter] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.user.findUnique({ where: { id: userId} })
    ]);

    if (!company || !inviter) {
      throw new AppError("Company or Inviter not found", 404);
    }

    const token = crypto.randomBytes(20).toString("hex");
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.invite.create({
      data: {
        token,
        companyId,
        role,
        email: email || null,
        expiresAt,
      },
    });

    const frontendUrl = process.env.NEXT_APP_PUBLIC_URL || 'http://localhost:3001';
    const inviteLink = `${frontendUrl}/auth/register?invite=${invite.token}`;

    if (email) {
      await this.mailService.sendInviteEmail(
        email,
        inviteLink,
        company.name,
        inviter.name
      );
    }

    return { ...invite, link: inviteLink };
  }

  async validateInvite(token: string) {
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invite) {
      throw new AppError("Invalid invite token", 404);
    }

    if (new Date() > invite.expiresAt) {
      throw new AppError("Invite expired", 400);
    }

    return invite;
  }
}