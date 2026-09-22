import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { boardService } from '../services/board.service.js';
import {
  createBoardSchema,
  createColumnSchema,
} from '../validators/board.validator.js';

export const getBoards = async (req: Request, res: Response) => {
  const boards = await boardService.getAllByUserId(req.user.id);
  res.json(boards);
};

export const getBoardById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid board id' });
  }

  const board = await boardService.getById(id, req.user.id);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  res.json(board);
};

export const getPublicBoard = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || Array.isArray(token)) {
    return res.status(400).json({ message: 'Invalid public board token' });
  }

  const board = await boardService.getPublicByToken(token);

  if (!board) {
    return res.status(404).json({ message: 'Public board not found' });
  }

  res.json(board);
};

export const getPublicTask = async (req: Request, res: Response) => {
  const { token, taskId } = req.params;

  if (!token || Array.isArray(token)) {
    return res.status(400).json({ message: 'Invalid public board token' });
  }

  if (!taskId || Array.isArray(taskId)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  const task = await boardService.getPublicTaskByToken(token, taskId);

  if (!task) {
    return res.status(404).json({ message: 'Public task not found' });
  }

  res.json(task);
};

export const createPublicLink = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid board id' });
  }

  const result = await boardService.createPublicLink(id, req.user.id);

  if (!result) {
    return res.status(404).json({ message: 'Board not found' });
  }

  res.json(result);
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const data = createBoardSchema.parse(req.body);

    const board = await boardService.create({
      title: data.title,
      userId: req.user.id,
    });

    res.status(201).json(board);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.flatten(),
      });
    }

    throw error;
  }
};

export const getColumns = async (req: Request, res: Response) => {
  const { boardId } = req.params;

  if (!boardId || Array.isArray(boardId)) {
    return res.status(400).json({ message: 'Invalid board id' });
  }

  const columns = await boardService.getColumns(boardId, req.user.id);

  if (!columns) {
    return res.status(404).json({ message: 'Board not found' });
  }

  res.json(columns);
};

export const createColumn = async (req: Request, res: Response) => {
  try {
    const data = createColumnSchema.parse(req.body);

    const column = await boardService.createColumn(
      {
        title: data.title,
        boardId: data.boardId,
      },
      req.user.id,
    );

    if (!column) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.status(201).json(column);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.flatten(),
      });
    }

    throw error;
  }
};