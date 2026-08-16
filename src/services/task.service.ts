import { prisma } from '../config/database.js';

interface CreateTaskInput {
  title: string;
  description?: string;
  columnId: string;
  priority?: number;
  parentTaskId?: string | null;
  userId: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  columnId?: string;
  priority?: number;
  parentTaskId?: string | null;
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
        subtasks: {
          orderBy: {
            position: 'asc',
          },
        },
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
        subtasks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  },

  async create(data: CreateTaskInput) {
    if (data.parentTaskId) {
      const parentTask = await prisma.task.findFirst({
        where: {
          id: data.parentTaskId,
          userId: data.userId,
        },
      });

      if (!parentTask) {
        throw new Error('Parent task not found');
      }
    }

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
        parentTaskId: data.parentTaskId ?? null,
        userId: data.userId,
        columnId: data.columnId,
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

    if (data.parentTaskId) {
      if (data.parentTaskId === id) {
        throw new Error('Task cannot be its own parent');
      }

      const parentTask = await prisma.task.findFirst({
        where: {
          id: data.parentTaskId,
          userId,
        },
      });

      if (!parentTask) {
        throw new Error('Parent task not found');
      }
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
        ...(data.parentTaskId !== undefined && {
          parentTaskId: data.parentTaskId,
        }),
      },
      include: {
        column: true,
        subtasks: true,
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
        subtasks: true,
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
