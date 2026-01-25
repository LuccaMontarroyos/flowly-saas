import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { Role } from "@prisma/client";

export function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const { role } = req.user;

  if (role !== Role.ADMIN) {
    throw new AppError("Access denied: Admins only", 403);
  }

  return next();
}