import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

interface CreateAttachmentDTO {
  taskId: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export class AttachmentService {
  async create({ taskId, name, url, type, size }: CreateAttachmentDTO) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    const attachment = await prisma.attachment.create({
      data: {
        taskId,
        name,
        url,
        type,
        size
      }
    });

    return attachment;
  }

  async delete(attachmentId: string) {
    const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } });
    if (!attachment) throw new AppError("Attachment not found", 404);

    await prisma.attachment.delete({ where: { id: attachmentId } });
  }

  async listByTask(taskId: string) {
    return await prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" }
    });
  }
}