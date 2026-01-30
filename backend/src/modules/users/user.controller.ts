import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { z } from "zod";

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
}