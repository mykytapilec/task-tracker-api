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
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
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

  async getById(id: string, userId: string) {
    return prisma.board.findFirst({
      where: {
        id,
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
        columns: {
          create: [
            {
              title: 'To Do',
              position: 0,
            },
            {
              title: 'In Progress',
              position: 1,
            },
            {
              title: 'Completed',
              position: 2,
            },
          ],
        },
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

  async getColumns(boardId: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId,
      },
    });

    if (!board) {
      return null;
    }

    return prisma.column.findMany({
      where: {
        boardId,
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
