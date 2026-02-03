import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { Role } from "@prisma/client";
import crypto from "crypto";

export class InviteService {
  
  async createInvite(companyId: string, role: Role, email?: string) {
    const token = crypto.randomBytes(20).toString("hex");
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.invite.create({
      data: {
        token,
        companyId,
        role,
        email,
        expiresAt,
      },
    });

    return invite;
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