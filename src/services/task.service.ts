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
  async getAll() {
    return prisma.task.findMany({
      include: {
        column: true,
        user: true,
      },
    });
  },

  async getById(id: string) {
    return prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        column: true,
        user: true,
      },
    });
  },

  async create(data: CreateTaskInput) {
    const lastTask = await prisma.task.findFirst({
      where: {
        columnId: data.columnId,
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
        column: {
          connect: {
            id: data.columnId,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        column: true,
        user: true,
      },
    });
  },

  async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        ...(data.columnId && {
          column: {
            connect: {
              id: data.columnId,
            },
          },
        }),
      },
      include: {
        column: true,
        user: true,
      },
    });
  },

  async remove(id: string) {
    return prisma.task.delete({
      where: {
        id,
      },
    });
  },
};
