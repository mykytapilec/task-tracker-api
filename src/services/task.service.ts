import { prisma } from '../config/database.js';

interface CreateTaskInput {
  title: string;
  description?: string;
  columnId: string;
  priority?: number;
  userId: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  columnId?: string;
  priority?: number;
}

interface ReorderTaskInput {
  columnId: string;
  position: number;
}

export const taskService = {
  async getAll(userId: string) {
    return prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          columnId: 'asc',
        },
        {
          priority: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
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
        priority: data.priority ?? 2,
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
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return null;
    }

    return prisma.task.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        ...(data.columnId && {
          columnId: data.columnId,
        }),
      },
      include: {
        column: true,
      },
    });
  },

  async reorder(id: string, userId: string, data: ReorderTaskInput) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return null;
    }

    const targetColumn = await prisma.column.findFirst({
      where: {
        id: data.columnId,
        board: {
          userId,
        },
      },
    });

    if (!targetColumn) {
      return null;
    }

    const tasks = await prisma.task.findMany({
      where: {
        columnId: data.columnId,
        userId,
        id: {
          not: id,
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    const position = Math.max(0, Math.min(data.position, tasks.length));

    tasks.splice(position, 0, task);

    await prisma.$transaction(
      tasks.map((currentTask, index) =>
        prisma.task.update({
          where: {
            id: currentTask.id,
          },
          data: {
            columnId: data.columnId,
            position: index,
            priority: index + 1,
          },
        }),
      ),
    );

    return prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        column: true,
      },
    });
  },

  async remove(id: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return false;
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return true;
  },
};
