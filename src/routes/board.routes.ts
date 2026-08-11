import { Router } from 'express';
import {
  getBoard,
  createBoard,
  getColumns,
  createColumn,
} from '../controllers/board.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getBoard);
router.post('/', createBoard);

router.get('/columns', getColumns);
router.post('/columns', createColumn);

export default router;
