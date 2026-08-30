import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import { app } from '../src/app.js';

describe('Board endpoints', () => {
  let token: string;
  let boardId: string;

  beforeAll(async () => {
    const email = `board-test-${Date.now()}@example.com`;
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
  });

  it('should return user boards', async () => {
    const response = await request(app)
      .get('/api/boards')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should create a board with default columns', async () => {
    const response = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Board',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Board');
    expect(response.body.columns).toHaveLength(3);

    expect(response.body.columns.map((column: { title: string }) => column.title)).toEqual([
      'To Do',
      'In Progress',
      'Completed',
    ]);

    boardId = response.body.id;
  });

  it('should return a board by id', async () => {
    const response = await request(app)
      .get(`/api/boards/${boardId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(boardId);
    expect(response.body.title).toBe('Test Board');
  });

  it('should return 404 for an unknown board', async () => {
    const response = await request(app)
      .get('/api/boards/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Board not found');
  });

  it('should return board columns', async () => {
    const response = await request(app)
      .get(`/api/boards/${boardId}/columns`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);

    expect(response.body.map((column: { title: string }) => column.title)).toEqual([
      'To Do',
      'In Progress',
      'Completed',
    ]);
  });

  it('should create a column', async () => {
    const response = await request(app)
      .post('/api/boards/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Review',
        boardId,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Review');
    expect(response.body.boardId).toBe(boardId);
    expect(response.body.position).toBe(3);
  });

  it('should reject board creation with an empty title', async () => {
    const response = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should reject unauthenticated board access', async () => {
    const response = await request(app).get('/api/boards');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});