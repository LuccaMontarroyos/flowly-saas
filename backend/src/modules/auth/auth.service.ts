import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Role, User } from "@prisma/client";

    
interface RegisterDTO {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  
  async register({ companyName, name, email, password }: RegisterDTO) {
   
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("Email already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const result = await prisma.$transaction(async (tx) => {

      const company = await tx.company.create({
        data: {
          name: companyName,
          
          slug: companyName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.ADMIN,
          companyId: company.id,
        },
      });

      return { company, user };
    });

    const token = this.generateToken(result.user.id, result.company.id, result.user.role);

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
      },
      token,
    };
  }

  async login({ email, password }: LoginDTO) {

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(user.id, user.companyId, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: {
        id: user.company.id,
        name: user.company.name,
        slug: user.company.slug,
      },
      token,
    };
  }

  private generateToken(userId: string, companyId: string, role: string) {
    return jwt.sign(
      { companyId, role },
      process.env.JWT_SECRET as string,
      { subject: userId, expiresIn: "1d" }
    );
  }
}