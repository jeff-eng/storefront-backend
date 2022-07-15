import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Basic test(s) for server file', () => {
    it('responds with 200 status code', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
    });
});