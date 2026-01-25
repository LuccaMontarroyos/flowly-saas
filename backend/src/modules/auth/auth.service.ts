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
  /**
   * Registra uma nova empresa e o primeiro usuário (ADMIN)
   * atomicamente usando Transaction.
   */
  async register({ companyName, name, email, password }: RegisterDTO) {
    // 1. Verificar se usuário já existe (email deve ser único globalmente ou por tenant?)
    // Em SaaS simples, email costuma ser único globalmente para evitar confusão.
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("Email already exists");
    }

    // 2. Hash da senha (Argon2 é superior ao Bcrypt contra ataques GPU)
    const hashedPassword = await argon2.hash(password);

    // 3. Transaction: Cria Company + User Admin
    // Se falhar no meio, o banco desfaz tudo (Rollback)
    const result = await prisma.$transaction(async (tx) => {
      // Cria a empresa
      const company = await tx.company.create({
        data: {
          name: companyName,
          // Slug automático simples (ideal seria uma função de slugify mais robusta)
          slug: companyName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        },
      });

      // Cria o usuário vinculado à empresa
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.ADMIN, // Primeiro usuário é sempre ADMIN
          companyId: company.id,
        },
      });

      return { company, user };
    });

    // 4. Gera o token para já retornar logado
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
    // 1. Busca usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }, // Já trazemos dados da empresa
    });

    // 2. Validação cega (Mesma resposta para usuário não encontrado ou senha errada)
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // 3. Verifica senha
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // 4. Gera Token
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

  // Método auxiliar privado para gerar JWT
  private generateToken(userId: string, companyId: string, role: string) {
    return jwt.sign(
      { companyId, role }, // Payload: Aqui mora a mágica do Multi-tenant
      process.env.JWT_SECRET as string,
      { subject: userId, expiresIn: "1d" }
    );
  }
}