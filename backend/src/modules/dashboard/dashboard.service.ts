import { prisma } from "../../config/prisma";
import { TaskStatus } from "@prisma/client";

export class DashboardService {
    async getDashboardStats(companyId: string, userId: string) {

        const [
            totalProjects,
            totalMembers,
            tasksByStatusRaw,
            myRecentTasks
        ] = await prisma.$transaction([

            prisma.project.count({
                where: { companyId }
            }),

            prisma.user.count({
                where: { companyId }
            }),

            prisma.task.groupBy({
                by: ["status"],
                where: { companyId },
                _count: {
                    status: true,
                },
                orderBy: undefined
            }),

            prisma.task.findMany({
                where: {
                    companyId,
                    assigneeId: userId,
                    status: { not: TaskStatus.DONE }
                },
                take: 5,
                orderBy: { updatedAt: "desc" },
                include: {
                    project: {
                        select: { id: true, name: true }
                    },
                    assignee: {
                        select: { name: true, email: true }
                    }
                }
            })
        ]);

        const tasksDistribution = {
            [TaskStatus.TODO]: 0,
            [TaskStatus.IN_PROGRESS]: 0,
            [TaskStatus.DONE]: 0,
        };

        let totalTasks = 0;


        tasksByStatusRaw.forEach((item) => {
            const count = (item._count as any).status || 0;

            if (item.status in tasksDistribution) {
                tasksDistribution[item.status as TaskStatus] = count;
            }

            totalTasks += count;
        });

        return {
            overview: {
                totalProjects,
                totalTasks,
                totalMembers,
            },
            tasksDistribution,
            myRecentTasks,
        };
    }
}