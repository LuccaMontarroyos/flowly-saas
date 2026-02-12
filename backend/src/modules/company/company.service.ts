import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

export class CompanyService {
  async getCompany(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: { users: true, projects: true }
        }
      }
    });

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    return company;
  }
}