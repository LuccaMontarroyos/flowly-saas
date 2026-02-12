import { Request, Response, NextFunction } from "express";
import { InviteService } from "./invite.service";
import { Role } from "@prisma/client";
import { z } from "zod";

export class InviteController {
  private inviteService = new InviteService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId, id: userId } = req.user;
      const schema = z.object({
        role: z.enum(Role).default(Role.MEMBER),
        email: z.email().optional().or(z.literal("")),
      });
      const { role, email } = schema.parse(req.body);

      const result = await this.inviteService.createInvite(
        companyId,
        userId,
        role,
        email || undefined
      );

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsSchema = z.object({
        token: z.string().min(1),
      });
      const { token } = paramsSchema.parse(req.params);
      const invite = await this.inviteService.validateInvite(token);
      return res.json(invite);
    } catch (error) {
      next(error);
    }
  }
}