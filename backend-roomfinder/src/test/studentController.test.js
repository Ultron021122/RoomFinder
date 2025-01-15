import request from 'supertest';
import app from '../app.js';

describe('Student Controller Integration Tests', () => {
    describe('GET /api/students', () => {
        if('should return all students', async () => {
            const response = await request(app)
            .get('/api/students')
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/students/:id', () => {
        it('should return a student by id', async () => {
            const id = 1;
            const response = await request(app)
            .get(`/api/students/${id}`)
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(200);
        });

        it('should return 404 for a non-existent student id', async () => {
            const response = await request(app)
            .get('/api/students/204')
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(404);
        });
    });
});