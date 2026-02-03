import { Request, Response, NextFunction } from "express";
import { InviteService } from "./invite.service";
import { Role } from "@prisma/client";
import { z } from "zod";

export class InviteController {
  private inviteService = new InviteService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.user;
      const schema = z.object({
        role: z.enum(Role).default(Role.MEMBER),
      });
      const { role } = schema.parse(req.body);

      const invite = await this.inviteService.createInvite(companyId, role);
      
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/register?invite=${invite.token}`;

      return res.json({ ...invite, link: inviteLink });
    } catch (error) {
      next(error);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const { token } = req.params;
          const invite = await this.inviteService.validateInvite(token);
          return res.json(invite);
      } catch (error) {
          next(error);
      }
  }
}