import supertest from "supertest";
import app from '../../server';

const request = supertest(app);

// There should only be read-only (GET) requests

describe('/orders endpoint test(s)', () => {
    it('GET /orders/:userid - valid user should return 201 and the current order object', async () => {
        const response = await request.get('/orders/teddywestside');
        expect(response.headers['Content-Type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                first_name: jasmine.any(String),
                last_name: jasmine.any(Number),
                is_admin:jasmine.any(Boolean)
            })  
        );
    });
});
