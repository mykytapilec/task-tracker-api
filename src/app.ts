import express from 'express';
import healthRoutes from './routes/health.routes.js';
import taskRoutes from './routes/task.routes.js';

export const app = express();

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);
