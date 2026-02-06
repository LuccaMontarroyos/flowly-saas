import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

interface CreateCommentDTO {
  content: string;
  taskId: string;
  userId: string;
}

export class CommentService {
  
  async create({ content, taskId, userId }: CreateCommentDTO) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return comment;
  }

  async listByTask(taskId: string) {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    return comments;
  }

  async delete(commentId: string, userId: string, isAdmin: boolean) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new AppError("Comment not found", 404);

    if (comment.userId !== userId && !isAdmin) {
        throw new AppError("You cannot delete this comment", 403);
    }

    await prisma.comment.delete({ where: { id: commentId } });
  }
}