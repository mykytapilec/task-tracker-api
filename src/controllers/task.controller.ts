import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { taskService } from '../services/task.service.js';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator.js';

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getAll(req.user.id);

  res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: 'Invalid task id',
    });
  }

  const task = await taskService.getById(id, req.user.id);

  if (!task) {
    return res.status(404).json({
      message: 'Task not found',
    });
  }

  res.json(task);
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await taskService.create({
      ...data,
      userId: req.user.id,
    });

    res.status(201).json(task);
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

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: 'Invalid task id',
    });
  }

  try {
    const data = updateTaskSchema.parse(req.body);

    const task = await taskService.update(id, req.user.id, data);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    res.json(task);
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

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: 'Invalid task id',
    });
  }

  const removed = await taskService.remove(id, req.user.id);

  if (!removed) {
    return res.status(404).json({
      message: 'Task not found',
    });
  }

  res.status(204).send();
};
