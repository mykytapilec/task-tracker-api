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
  async getByUserId(userId: string) {
    return prisma.board.findUnique({
      where: {
        userId,
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  },

  async create(data: CreateBoardInput) {
    return prisma.board.create({
      data: {
        title: data.title,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        columns: true,
      },
    });
  },

  async getColumns(userId: string) {
    const board = await prisma.board.findUnique({
      where: {
        userId,
      },
    });

    if (!board) {
      return null;
    }

    return prisma.column.findMany({
      where: {
        boardId: board.id,
      },
      orderBy: {
        position: 'asc',
      },
    });
  },

  async createColumn(data: CreateColumnInput, userId: string) {
    const board = await prisma.board.findFirst({
      where: {
        id: data.boardId,
        userId,
      },
    });

    if (!board) {
      return null;
    }

    const lastColumn = await prisma.column.findFirst({
      where: {
        boardId: data.boardId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    return prisma.column.create({
      data: {
        title: data.title,
        position: lastColumn ? lastColumn.position + 1 : 0,
        board: {
          connect: {
            id: data.boardId,
          },
        },
      },
    });
  },
};
