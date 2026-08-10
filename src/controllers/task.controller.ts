import type { Request, Response } from 'express';
import { taskService } from '../services/task.service.js';

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
  const task = await taskService.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: 'Invalid task id',
    });
  }

  const task = await taskService.update(id, req.user.id, req.body);

  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: 'Invalid task id',
    });
  }

  await taskService.remove(id, req.user.id);

  res.status(204).send();
};
