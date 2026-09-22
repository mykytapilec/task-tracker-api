import { Router } from 'express';
import {
  createBoard,
  createColumn,
  createPublicLink,
  getBoardById,
  getBoards,
  getColumns,
  getPublicBoard,
  getPublicTask,
} from '../controllers/board.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/public/:token', getPublicBoard);
router.get('/public/:token/tasks/:taskId', getPublicTask);

router.use(authMiddleware);

router.get('/', getBoards);
router.post('/', createBoard);

router.get('/:id', getBoardById);
router.post('/:id/public-link', createPublicLink);

router.get('/:boardId/columns', getColumns);
router.post('/columns', createColumn);

export default router;