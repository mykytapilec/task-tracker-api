import express from 'express';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import taskRoutes from './routes/task.routes.js';

export const app = express();

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
