import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { Role } from "@prisma/client"; // Importamos o Enum do Prisma para evitar "strings mágicas"

export function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const { role } = req.user;

  if (role !== Role.ADMIN) {
    throw new AppError("Access denied: Admins only", 403); // 403 = Forbidden
  }

  return next();
}