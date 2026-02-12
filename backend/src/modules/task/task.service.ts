import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { TaskStatus, Priority } from "@prisma/client";

interface CreateTaskDTO {
    title: string;
    description?: string;
    projectId: string;
    companyId: string;
    assigneeId?: string;
    status: TaskStatus
    priority?: Priority;
    tags?: string[];
}

interface UpdateTaskDTO {
    taskId: string;
    companyId: string;
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
    priority?: Priority;
    tags?: string[];
}

interface ListTaskParams {
    projectId: string;
    search?: string;
    assigneeId?: string;
    priority?: string;
    companyId: string;
}

export class TaskService {

    async create({ title, description, projectId, companyId, assigneeId, status, priority, tags }: CreateTaskDTO) {


        const project = await prisma.project.findFirst({
            where: { id: projectId, companyId },
        });

        if (!project) {
            throw new AppError("Project not found within this company", 404);
        }

        if (assigneeId) {
            await this.validateAssignee(assigneeId, companyId);
        }

        const lastTask = await prisma.task.findFirst({
            where: { projectId, status },
            orderBy: { order: "desc" },
        });

        const newOrder = lastTask ? lastTask.order + 1 : 0;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority: priority || "LOW",
                projectId,
                companyId,
                assigneeId,
                order: newOrder, tags: tags ? {
                    connect: tags.map(tagId => ({ id: tagId }))
                } : undefined
            },
            include: {
                assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
                tags: true,
            },
        });

        return task;
    }

    async listByProject({ projectId, companyId, search, assigneeId, priority }: ListTaskParams) {

        const where: any = { projectId, companyId };

        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        if (assigneeId) {
            where.assigneeId = assigneeId;
        }

        if (priority && priority !== "ALL") {
            where.priority = priority;
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { order: "asc" },
            include: {
                assignee: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
                tags: true
            },
        },
        );

        const kanbanStructure = tasks.reduce((acc, task) => {

            if (!acc[task.status]) {
                acc[task.status] = [];
            }

            acc[task.status].push(task);
            return acc;
        }, {} as Record<TaskStatus, typeof tasks>);

        return {
            TODO: kanbanStructure.TODO || [],
            IN_PROGRESS: kanbanStructure.IN_PROGRESS || [],
            DONE: kanbanStructure.DONE || [],
        };
    }

    async updatePosition(taskId: string, newStatus: TaskStatus, newIndex: number) {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new AppError("Task not found", 404);

        const oldStatus = task.status;
        const projectId = task.projectId;

        return await prisma.$transaction(async (tx) => {
            if (oldStatus !== newStatus) {
                await tx.task.updateMany({
                    where: {
                        projectId,
                        status: oldStatus,
                        order: { gt: task.order },
                    },
                    data: { order: { decrement: 1 } },
                });

                await tx.task.updateMany({
                    where: {
                        projectId,
                        status: newStatus,
                        order: { gte: newIndex },
                    },
                    data: { order: { increment: 1 } },
                });
            } else {
                if (task.order < newIndex) {
                    await tx.task.updateMany({
                        where: {
                            projectId,
                            status: oldStatus,
                            order: { gt: task.order, lte: newIndex }
                        },
                        data: { order: { decrement: 1 } }
                    });
                }
                else if (task.order > newIndex) {
                    await tx.task.updateMany({
                        where: {
                            projectId,
                            status: oldStatus,
                            order: { gte: newIndex, lt: task.order }
                        },
                        data: { order: { increment: 1 } }
                    });
                }
            }
            const updated = await tx.task.update({
                where: { id: taskId },
                data: { status: newStatus, order: newIndex },
            });

            return updated;
        });
    }

    async update({ taskId, companyId, title, description, status, assigneeId, priority, tags }: UpdateTaskDTO) {
        const task = await prisma.task.findFirst({
            where: { id: taskId, companyId },
        });

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        if (assigneeId) {
            await this.validateAssignee(assigneeId, companyId);
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                status,
                assigneeId,
                priority,
                tags: tags ? {
                    set: tags.map(tagId => ({ id: tagId }))
                } : undefined
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                tags: true,
            },
        });

        return updatedTask;
    }

    async delete(taskId: string, companyId: string) {
        const task = await prisma.task.findFirst({
            where: { id: taskId, companyId },
        });

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        await prisma.task.delete({
            where: { id: taskId },
        });
    }

    private async validateAssignee(assigneeId: string, companyId: string) {
        const assignee = await prisma.user.findUnique({
            where: { id: assigneeId },
        });

        if (!assignee) {
            throw new AppError("Assignee not found", 404);
        }

        if (assignee.companyId !== companyId) {
            throw new AppError("Assignee does not belong to this company", 403);
        }
    }
}