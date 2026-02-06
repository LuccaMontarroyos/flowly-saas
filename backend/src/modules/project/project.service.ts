import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

interface CreateProjectDTO {
    name: string;
    description?: string;
    companyId: string;
    ownerId: string;
}

interface ListProjectsDTO {
    companyId: string;
    page?: number;
    limit?: number;
    search?: string;
}

export class ProjectService {

    async create({ name, description, companyId, ownerId }: CreateProjectDTO) {

        const projectExists = await prisma.project.findFirst({
            where: { name, companyId },
        });

        if (projectExists) {
            throw new AppError("A project with this name already exists in your company");
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                companyId,
                ownerId
            },
        });

        return project;
    }

    async list({ companyId, page = 1, limit = 10, search }: ListProjectsDTO) {
        const skip = Math.max(0, (page - 1) * limit) || 0;

        const whereCondition = {
            companyId,
            ...(search && {
                name: { contains: search, mode: "insensitive" as const },
            }),
        };

        const [projects, total] = await prisma.$transaction([
            prisma.project.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { updatedAt: "desc" },
                include: {
                    _count: {
                        select: { tasks: true },
                    },
                    owner: {
                        select: { name: true, email: true, role: true, avatarUrl: true, assignedTasks: true },
                        
                    }
                },
            }),
            prisma.project.count({ where: whereCondition }),
        ]);

        return {
            data: projects.map(p => ({
                ...p,
                taskCount: p._count.tasks,
                _count: undefined,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }

    async update(projectId: string, companyId: string, data: { name?: string, description?: string }) {

        const project = await prisma.project.findFirst({
            where: { id: projectId, companyId },
        });

        if (!project) {
            throw new AppError("Project not found or access denied", 404);
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                name: data.name,
                description: data.description
            }
        })

        return updatedProject;
    }

    async findById(projectId: string, companyId: string) {
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                companyId
            }
        });

        if (!project) {
            throw new AppError("Project not found or access denied", 404);
        }

        return project;
    }

    async delete(projectId: string, companyId: string) {

        const project = await prisma.project.findFirst({
            where: { id: projectId, companyId },
        });

        if (!project) {
            throw new AppError("Project not found or access denied", 404);
        }

        await prisma.project.delete({
            where: { id: projectId },
        });
    }
}