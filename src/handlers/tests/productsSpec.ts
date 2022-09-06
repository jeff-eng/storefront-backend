import supertest from 'supertest';
import app from '../../server';
import { User, UserStore } from '../../models/user';
const request = supertest(app);
const userStore = new UserStore();

describe('Endpoint Tests - Products Routes', () => {
    // Test user    
    const testUser: User = {
        username: 'swarlesbarkley',
        firstName: 'Swarley',
        lastName: 'Stinson',
        password: 'slapbetloser96',
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
    
    
    // POST /products
    it('POST /products with JWT auth should return 200 status code', async () => {
        const response = await request
                                    .post('/products')
                                    .set('Authorization', `Bearer ${token}`)
                                    .send({
                                            name:'T-shirt',
                                            price: 5
                                    });
                            
        expect(response.status).toBe(200);
    });
    
    // GET /products
    it('GET /products should respond with status code 200', async () => {
        const response = await request.get('/products');
        
        expect(response.status).toBe(200);
    });
    
    // GET /products/:id
    it('GET /products/:id should return status code 200', async () => {
        const response = await request.get('/products/1');
        
        expect(response.status).toBe(200);
    });
    
});