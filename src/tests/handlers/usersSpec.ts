import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('/users endpoint test(s)', () => {
    it('GET /api/users - should have 200 status with json array of users for admin users only', async () => {
        
        const response = await request.get('/users');
        expect(response.headers['Content-Type']).toMatch(/json/);
        expect(response.body).toEqual(jasmine.arrayContaining([
            jasmine.objectContaining({
                id: jasmine.any(Number),
                first_name: jasmine.any(String),
                last_name: jasmine.any(Number),
                is_admin: jasmine.any(Boolean)
            })  
        ]));
    });

    it('GET /users/:id', async () => {
        // Needs JWT admin authorization
        const response = await request.get('/users/1');
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
    
    it('GET /users/:id - returns 404 if not found', async () => {
        // Needs JWT admin authorization
        const response = await request.get('/users/9999999');
        expect(response.status).toEqual(404);
    });

    // Successful POST request
    it('POST /users', async () => {
        // No JWT auth needed here
        const response = await request.post('/users').send(
            {
                first_name: 'Jed',
                last_name: 'Mosely',
                password: 'nocandosvillebabydoll',
                is_admin: false
            }
        );

        expect(response.status).toEqual(201);
        expect(response.body).toEqual(jasmine.objectContaining({
            first_name: jasmine.any(String),
            last_name: jasmine.any(String),
            is_admin: false   
        }));
    });

});