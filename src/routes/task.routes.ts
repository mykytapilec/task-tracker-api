import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  reorderTask,
  updateTask,
} from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id/reorder', reorderTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
