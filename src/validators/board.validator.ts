import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

export const createColumnSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  boardId: z.string().uuid('Invalid board id'),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type CreateColumnInput = z.infer<typeof createColumnSchema>;
