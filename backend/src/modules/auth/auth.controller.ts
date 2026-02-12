import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { z } from "zod";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerSchema = z.object({
        companyName: z.string().min(2, "Company name is required"),
        name: z.string().min(2, "Name is required"),
        email: z.email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      });
      const data = registerSchema.parse(req.body);

      const result = await this.authService.register(data);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginSchema = z.object({
        email: z.email(),
        password: z.string(),
      });

      const data = loginSchema.parse(req.body);

      const result = await this.authService.login(data);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  profile = async (req: Request, res: Response) => {
    return res.json({
      message: "Authenticated successfully",
      user: req.user
    })
  }  

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        email: z.email(),
      });
      const { email } = schema.parse(req.body);

      await this.authService.forgotPassword({ email });

      return res.status(200).json({ message: "If your email exists, you will receive a reset link." });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        token: z.string(),
        password: z.string().min(6),
      });
      const data = schema.parse(req.body);

      await this.authService.resetPassword(data);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  };
}