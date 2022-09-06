import supertest from 'supertest';
import app from '../../server';
import { Product } from '../../models/product';
import { User, UserStore } from '../../models/user';

const request = supertest(app);
const userStore = new UserStore();

describe('Endpoint Tests - Orders Routes', () => {   
    const testUser: User = {
        username: 'legendary77',
        firstName: 'Barney',
        lastName: 'Stinson',
        password: 'Weekend@Barneys2',
        isAdmin: false
    };
    
    let token: string;
    
    beforeAll( async () => {
        // Create a test user directly using UserStore
        try {
            await userStore.create(testUser);
        } catch (err) {
            throw new Error(`Unable to create test user for the Products handler test suite`);
        }
        
        // Get the test user's JWT
        const response = await request
                                    .post('/users/auth')
                                    .send({
                                        username: testUser.username,
                                        password: testUser.password
                                    });
        
        token = response.body;   
    });
    

    // POST /orders (user_id is transmitted in payload sent to server)
    it('POST /orders - creating a new order should return status code 201', async () => {
        const response = await request
                                    .post('/orders')
                                    .set('Authorization', `Bearer ${token}`)
                                    .send({
                                        user_id: 1,
                                    });
        
        expect(response.status).toBe(201);
    });
    
        // GET /orders/:userid
    it('GET /orders/:userid - current order not yet completed should return 200', async () => {
        const response = await request
                                    .get('/orders/1')
                                    .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
    });
    
    // GET /orders/completed/:userid
    it('GET /orders/completed/:userid - should return 400 status code when unable to retrieve completed order', async () => {
        const response = await request
                                    .get('/orders/completed/1')
                                    .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(400);
    });
    
    // POST /orders/:id/products (id is the order ID)
    it('POST /orders/:id/products - should return 200 status code when successfully adding product to order', async () => {
        const response = await request
                                    .post('/orders/1/products')
                                        .set('Authorization', `Bearer ${token}`)
                                        .send({
                                        quantity: 2,
                                        id: 1,
                                        productID: 1
                                    });
        
        expect(response.status).toBe(200)
    });
});