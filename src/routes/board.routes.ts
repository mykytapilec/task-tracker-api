import { Router } from 'express';
import {
  createBoard,
  createColumn,
  getBoardById,
  getBoards,
  getColumns,
} from '../controllers/board.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getBoards);
router.post('/', createBoard);

router.get('/:id', getBoardById);

router.get('/:boardId/columns', getColumns);
router.post('/columns', createColumn);

export default router;
