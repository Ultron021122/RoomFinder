import request from 'supertest';
import app from '../app.js';

describe('User Controller Integration Tests', () => {
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            // Agrega más aserciones según sea necesario
        });
    });

    describe('GET /users/type/:type_user', () => {
        it('should return users by type', async () => {
            const type_user = 1; // Asegúrate de tener este tipo de usuario en tu base de datos de prueba
            const response = await request(app)
            .get(`/api/users/type/${type_user}`)
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(200);
            // Agrega más aserciones basadas en tu lógica de negocio
        });

        it('should return 400 for a non-existent user type', async () => {
            const response = await request(app)
            .get('/api/users/nonExistentType')
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user by id', async () => {
            const id = 1; // Asegúrate de tener este ID en tu base de datos de prueba
            const response = await request(app)
            .get(`/api/users/${id}`)
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(200);
            // Agrega más aserciones basadas en tu lógica de negocio
        });

        it('should return 404 for a non-existent user id', async () => {
            const response = await request(app)
            .get('/api/users/204')
            .set('Authorization', `Bearer ${process.env.REST_SECRET}`);
            expect(response.statusCode).toBe(404);
        });
    });
});