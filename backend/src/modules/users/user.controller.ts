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
}