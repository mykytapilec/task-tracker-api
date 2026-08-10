import { prisma } from '../config/database.js';

interface CreateTaskInput {
  title: string;
  description?: string;
  columnId: string;
  userId: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  columnId?: string;
}

export const taskService = {
  async getAll(userId: string) {
    return prisma.task.findMany({
      where: {
        userId,
      },
      include: {
        column: true,
      },
    });
  },

  async getById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        column: true,
      },
    });
  },

  async create(data: CreateTaskInput) {
    const lastTask = await prisma.task.findFirst({
      where: {
        columnId: data.columnId,
        userId: data.userId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        position: lastTask ? lastTask.position + 1 : 0,
        user: {
          connect: {
            id: data.userId,
          },
        },
        column: {
          connect: {
            id: data.columnId,
          },
        },
      },
      include: {
        column: true,
      },
    });
  },

  async update(id: string, userId: string, data: UpdateTaskInput) {
    return prisma.task.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        title: data.title,
        description: data.description,
        ...(data.columnId && {
          columnId: data.columnId,
        }),
      },
    });
  },

  async remove(id: string, userId: string) {
    return prisma.task.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },
};
