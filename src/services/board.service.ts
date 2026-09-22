import { randomBytes } from 'node:crypto';
import { prisma } from '../config/database.js';

interface CreateBoardInput {
  title: string;
  userId: string;
}

interface CreateColumnInput {
  title: string;
  boardId: string;
}

export const boardService = {
  async getAllByUserId(userId: string) {
    return prisma.board.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { columns: { orderBy: { position: 'asc' } } },
    });
  },

  async getById(id: string, userId: string) {
    return prisma.board.findFirst({
      where: { id, userId },
      include: { columns: { orderBy: { position: 'asc' } } },
    });
  },

  async getPublicByToken(publicToken: string) {
    return prisma.board.findUnique({
      where: { publicToken },
      select: {
        id: true,
        title: true,
        columns: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            position: true,
            tasks: {
              where: { parentTaskId: null },
              orderBy: { position: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                position: true,
                priority: true,
                status: true,
                storyPoints: true,
                columnId: true,
                parentTaskId: true,
                subtasks: {
                  orderBy: { position: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    position: true,
                    priority: true,
                    status: true,
                    storyPoints: true,
                    columnId: true,
                    parentTaskId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async getPublicTaskByToken(publicToken: string, taskId: string) {
    const board = await prisma.board.findUnique({
      where: { publicToken },
      select: { id: true },
    });

    if (!board) {
      return null;
    }

    return prisma.task.findFirst({
      where: {
        id: taskId,
        column: {
          boardId: board.id,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        position: true,
        priority: true,
        status: true,
        storyPoints: true,
        columnId: true,
        parentTaskId: true,
        subtasks: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            position: true,
            priority: true,
            status: true,
            storyPoints: true,
            columnId: true,
            parentTaskId: true,
          },
        },
      },
    });
  },

  async createPublicLink(boardId: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId },
    });

    if (!board) {
      return null;
    }

    const publicToken = randomBytes(32).toString('hex');

    return prisma.board.update({
      where: { id: boardId },
      data: { publicToken },
      select: { publicToken: true },
    });
  },

  async create(data: CreateBoardInput) {
    return prisma.board.create({
      data: {
        title: data.title,
        user: { connect: { id: data.userId } },
        columns: {
          create: [
            { title: 'To Do', position: 0 },
            { title: 'In Progress', position: 1 },
            { title: 'Completed', position: 2 },
          ],
        },
      },
      include: { columns: { orderBy: { position: 'asc' } } },
    });
  },

  async getColumns(boardId: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId },
    });

    if (!board) {
      return null;
    }

    return prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
    });
  },

  async createColumn(data: CreateColumnInput, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id: data.boardId, userId },
    });

    if (!board) {
      return null;
    }

    const lastColumn = await prisma.column.findFirst({
      where: { boardId: data.boardId },
      orderBy: { position: 'desc' },
    });

    return prisma.column.create({
      data: {
        title: data.title,
        position: lastColumn ? lastColumn.position + 1 : 0,
        board: { connect: { id: data.boardId } },
      },
    });
  },
};