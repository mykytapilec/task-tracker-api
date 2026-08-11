import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { boardService } from '../services/board.service.js';
import {
  createBoardSchema,
  createColumnSchema,
} from '../validators/board.validator.js';

export const getBoard = async (req: Request, res: Response) => {
  const board = await boardService.getByUserId(req.user.id);

  if (!board) {
    return res.status(404).json({
      message: 'Board not found',
    });
  }

  res.json(board);
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const data = createBoardSchema.parse(req.body);

    const existingBoard = await boardService.getByUserId(req.user.id);

    if (existingBoard) {
      return res.status(409).json({
        message: 'Board already exists',
      });
    }

    const board = await boardService.create({
      ...data,
      userId: req.user.id,
    });

    res.status(201).json(board);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues,
      });
    }

    throw error;
  }
};

export const getColumns = async (req: Request, res: Response) => {
  const columns = await boardService.getColumns(req.user.id);

  if (!columns) {
    return res.status(404).json({
      message: 'Board not found',
    });
  }

  res.json(columns);
};

export const createColumn = async (req: Request, res: Response) => {
  try {
    const data = createColumnSchema.parse(req.body);

    const column = await boardService.createColumn(data, req.user.id);

    if (!column) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    res.status(201).json(column);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues,
      });
    }

    throw error;
  }
};
