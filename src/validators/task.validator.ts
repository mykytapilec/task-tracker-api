import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  description: z.string().trim().optional(),

  columnId: z.string().uuid('Invalid column id'),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),

  description: z.string().trim().optional(),

  columnId: z.string().uuid('Invalid column id').optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
