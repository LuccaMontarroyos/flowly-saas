import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { TaskStatus } from "@prisma/client";

interface CreateTaskDTO {
    title: string;
    description?: string;
    projectId: string;
    companyId: string;
    assigneeId?: string;
}

interface UpdateTaskDTO {
    taskId: string;
    companyId: string;
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
}

export class TaskService {

    async create({ title, description, projectId, companyId, assigneeId }: CreateTaskDTO) {

        const project = await prisma.project.findFirst({
            where: { id: projectId, companyId },
        });

        if (!project) {
            throw new AppError("Project not found within this company", 404);
        }

        if (assigneeId) {
            await this.validateAssignee(assigneeId, companyId);
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: TaskStatus.TODO,
                projectId,
                companyId,
                assigneeId,
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
            },
        });

        return task;
    }

    async listByProject(projectId: string, companyId: string) {

        const tasks = await prisma.task.findMany({
            where: { projectId, companyId },
            orderBy: { updatedAt: "desc" },
            include: {
                assignee: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

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

    async update({ taskId, companyId, title, description, status, assigneeId }: UpdateTaskDTO) {
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
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
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