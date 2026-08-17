import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  description: z.string().trim().optional(),

  columnId: z.string().uuid('Invalid column id'),

  priority: z.number().int().min(1, 'Priority must be at least 1').optional(),

  parentTaskId: z.string().uuid('Invalid parent task id').nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),

  description: z.string().trim().optional(),

  columnId: z.string().uuid('Invalid column id').optional(),

  priority: z.number().int().min(1, 'Priority must be at least 1').optional(),

  parentTaskId: z.string().uuid('Invalid parent task id').nullable().optional(),
});

export const reorderTaskSchema = z.object({
  columnId: z.string().uuid('Invalid column id'),

  position: z.number().int().min(0, 'Position must be at least 0'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;
