import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { z } from "zod";
import { Role } from "@prisma/client";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const schema = z.object({
        name: z.string().min(2),
        email: z.email(),
      });

      const { name, email } = schema.parse(req.body);
      
      const adminCompanyId = req.user.companyId;

      const result = await this.userService.createMember({
        name,
        email,
        adminCompanyId,
      });

      return res.status(201).json(result);

    } catch (error) {
      next(error);
    }
  };

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const querySchema = z.object({
        page: z.string().optional().default("1").transform(Number),
        limit: z.string().optional().default("10").transform(Number),
        search: z.string().optional(),
      });

      const { page, limit, search } = querySchema.parse(req.query);
      const { companyId } = req.user;

      const result = await this.userService.listByCompany({
        companyId,
        page,
        limit,
        search,
      });

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paramsSchema = z.object({ id: z.uuid() });
        const bodySchema = z.object({ role: z.enum(Role) });

        const { id } = paramsSchema.parse(req.params);
        const { role } = bodySchema.parse(req.body);
        const requestorId = req.user.id;

        const user = await this.userService.updateRole(id, role, requestorId);
        return res.json(user);
    } catch (error) {
        next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paramsSchema = z.object({ id: z.string().uuid() });
        const { id } = paramsSchema.parse(req.params);
        const requestorId = req.user.id;

        await this.userService.remove(id, requestorId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
  };
}