import { z } from 'zod';

const storyPointsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(5),
  z.literal(8),
  z.literal(13),
  z.literal(21),
]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  description: z.string().trim().optional(),

  columnId: z.string().uuid('Invalid column id'),

  priority: z.enum(['low', 'medium', 'high']).optional(),

  status: z.enum(['pending', 'completed']).optional(),

  storyPoints: storyPointsSchema.optional(),

  parentTaskId: z.string().uuid('Invalid parent task id').nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),

  description: z.string().trim().optional(),

  columnId: z.string().uuid('Invalid column id').optional(),

  priority: z.enum(['low', 'medium', 'high']).optional(),

  status: z.enum(['pending', 'completed']).optional(),

  storyPoints: storyPointsSchema.optional(),

  parentTaskId: z.string().uuid('Invalid parent task id').nullable().optional(),
});

export const reorderTaskSchema = z.object({
  columnId: z.string().uuid('Invalid column id'),

  position: z.number().int().min(0, 'Position must be at least 0'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;