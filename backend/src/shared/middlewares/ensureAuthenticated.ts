import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

interface IPayload {
  sub: string;
  companyId: string;
  role: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token missing", 401);
  }

  try {
    
    const decoded = verify(token, process.env.JWT_SECRET as string);

    const { sub, companyId, role } = decoded as unknown as IPayload;

    req.user = {
      id: sub,
      companyId,
      role
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid token", 401);
  }
}