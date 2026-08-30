import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import { app } from '../src/app.js';

describe('Task endpoints', () => {
  let token: string;
  let boardId: string;
  let columnId: string;
  let firstTaskId: string;
  let secondTaskId: string;

  beforeAll(async () => {
    const email = `task-test-${Date.now()}@example.com`;
    const password = 'password123';

    await request(app).post('/api/auth/register').send({
      email,
      password,
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email,
      password,
    });

    token = loginResponse.body.token;

    const boardResponse = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task Test Board',
      });

    boardId = boardResponse.body.id;
    columnId = boardResponse.body.columns[0].id;
  });

  it('should return tasks for a board', async () => {
    const response = await request(app)
      .get(`/api/tasks?boardId=${boardId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should create a task with low priority', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Low priority task',
        columnId,
        priority: 'low',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Low priority task');
    expect(response.body.priority).toBe('low');
    expect(response.body.columnId).toBe(columnId);
    expect(response.body.position).toBe(0);

    firstTaskId = response.body.id;
  });

  it('should create a task with high priority', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'High priority task',
        columnId,
        priority: 'high',
      });

    expect(response.status).toBe(201);
    expect(response.body.priority).toBe('high');
    expect(response.body.position).toBe(1);

    secondTaskId = response.body.id;
  });

  it('should create a task with medium priority by default', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Default priority task',
        columnId,
      });

    expect(response.status).toBe(201);
    expect(response.body.priority).toBe('medium');
    expect(response.body.position).toBe(2);
  });

  it('should reject an invalid priority', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Invalid priority task',
        columnId,
        priority: 'urgent',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should return a task by id', async () => {
    const response = await request(app)
      .get(`/api/tasks/${firstTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(firstTaskId);
    expect(response.body.title).toBe('Low priority task');
    expect(response.body.priority).toBe('low');
  });

  it('should update task priority', async () => {
    const response = await request(app)
      .patch(`/api/tasks/${firstTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        priority: 'high',
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(firstTaskId);
    expect(response.body.priority).toBe('high');
  });

  it('should update task title and description', async () => {
    const response = await request(app)
      .patch(`/api/tasks/${firstTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated task',
        description: 'Updated description',
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated task');
    expect(response.body.description).toBe('Updated description');
  });

  it('should reject an invalid priority during update', async () => {
    const response = await request(app)
      .patch(`/api/tasks/${firstTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        priority: 'urgent',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should return 404 for an unknown task', async () => {
    const response = await request(app)
      .get('/api/tasks/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Task not found');
  });

  it('should reorder a task', async () => {
    const response = await request(app)
      .patch(`/api/tasks/${secondTaskId}/reorder`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        columnId,
        position: 0,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(secondTaskId);
    expect(response.body.columnId).toBe(columnId);
    expect(response.body.position).toBe(0);
  });

  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${secondTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('should reject unauthenticated task access', async () => {
    const response = await request(app).get(
      `/api/tasks/${firstTaskId}`,
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});