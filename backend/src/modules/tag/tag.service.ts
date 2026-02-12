import { prisma } from "../../config/prisma";

export class TagService {
  async list(companyId: string) {
    return await prisma.tag.findMany({
      where: { companyId },
      orderBy: { name: "asc" }
    });
  }

  async create(companyId: string, name: string, color: string) {
    return await prisma.tag.create({
      data: {
        name,
        color,
        companyId
      }
    });
  }

  async delete(tagId: string) {
    return await prisma.tag.delete({ where: { id: tagId } });
  }
}