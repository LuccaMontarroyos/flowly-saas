import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schema";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);

      const result = await this.authService.register(data);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      const { email } = forgotPasswordSchema.parse(req.body);

      await this.authService.forgotPassword({ email });

      return res.status(200).json({ message: "If your email exists, you will receive a reset link." });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = resetPasswordSchema.parse(req.body);

      await this.authService.resetPassword(data);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  };
}