// app.test.js
import request from 'supertest';
import app from '../app.js';

describe('API Integration Tests', () => {
  it('GET /api/users - success', async () => {
    const { statusCode, body } = await request(app).get('/api/users');
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]));
  });
});