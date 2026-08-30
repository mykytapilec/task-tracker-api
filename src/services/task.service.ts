import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';

import { prisma } from '../config/database.js';

interface CreateTaskInput {
  title: string;
  description?: string;
  columnId: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  parentTaskId?: string | null;
  userId: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  columnId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  parentTaskId?: string | null;
}

interface ReorderTaskInput {
  columnId: string;
  position: number;
}

export const taskService = {
  async getAll(userId: string, boardId: string) {
    return prisma.task.findMany({
      where: {
        userId,
        column: {
          boardId,
          board: {
            userId,
          },
        },
      },
      orderBy: [
        {
          columnId: 'asc',
        },
        {
          status: 'asc',
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
    const column = await prisma.column.findFirst({
      where: {
        id: data.columnId,
        board: {
          userId: data.userId,
        },
      },
    });

    if (!column) {
      throw new Error('Column not found');
    }

    if (data.parentTaskId) {
      const parentTask = await prisma.task.findFirst({
        where: {
          id: data.parentTaskId,
          userId: data.userId,
        },
        include: {
          column: true,
        },
      });

      if (!parentTask) {
        throw new Error('Parent task not found');
      }

      if (parentTask.column.boardId !== column.boardId) {
        throw new Error('Parent task belongs to another board');
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

    const createData: Prisma.TaskUncheckedCreateInput = {
      title: data.title,
      description: data.description,
      position: lastTask ? lastTask.position + 1 : 0,
      priority: data.priority ?? TaskPriority.medium,
      status: data.status ?? TaskStatus.pending,
      parentTaskId: data.parentTaskId ?? null,
      userId: data.userId,
      columnId: data.columnId,
    };

    return prisma.task.create({
      data: createData,
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
      include: {
        column: true,
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
        include: {
          column: true,
        },
      });

      if (!parentTask) {
        throw new Error('Parent task not found');
      }

      if (parentTask.column.boardId !== task.column.boardId) {
        throw new Error('Parent task belongs to another board');
      }
    }

    if (data.columnId) {
      const targetColumn = await prisma.column.findFirst({
        where: {
          id: data.columnId,
          board: {
            userId,
          },
        },
      });

      if (!targetColumn) {
        throw new Error('Column not found');
      }

      if (targetColumn.boardId !== task.column.boardId) {
        throw new Error('Column belongs to another board');
      }
    }

    const updateData: Prisma.TaskUncheckedUpdateInput = {
      ...(data.title !== undefined && {
        title: data.title,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.priority !== undefined && {
        priority: data.priority,
      }),
      ...(data.status !== undefined && {
        status: data.status,
      }),
      ...(data.columnId !== undefined && {
        columnId: data.columnId,
      }),
      ...(data.parentTaskId !== undefined && {
        parentTaskId: data.parentTaskId,
      }),
    };

    return prisma.task.update({
      where: {
        id,
      },
      data: updateData,
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
      include: {
        column: true,
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

    if (targetColumn.boardId !== task.column.boardId) {
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
