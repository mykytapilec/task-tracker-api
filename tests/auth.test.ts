import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../src/app.js';

describe('Auth endpoints', () => {
  it('should register a new user', async () => {
    const email = `test-${Date.now()}@example.com`;

    const response = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      email,
    });
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body).not.toHaveProperty('password');
  });
});