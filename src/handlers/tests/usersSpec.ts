import supertest from 'supertest';
import app from '../../server';
import { User, UserStore } from '../../models/user';

const request = supertest(app);
const userStore = new UserStore();

dotenv.config()

describe('Endpoint Tests - Users Routes', () => {
    const testUser: User = {
        username: 'redboots123',
        firstName: 'Jed',
        lastName: 'Mosely',
        password: 'Nocandosvi11ebabydoLL',
        isAdmin: false
    };
    
    const testUser2: User = {
        username: 'judgefudge',
        firstName: 'Marshall',
        lastName: 'Eriksen',
        password: 'iWouldWalk500miles',
        isAdmin: false
    }
    
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
    
    // GET /users - requires JWT authorization
    it('GET /users should respond with JSON and status code 200', async () => {
        const response = await request
                                    .get('/users')
                                    .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
    });
    
    // GET /users/:id - requires JWT authorization
    it('GET /users/:id should respond with JSON and status code 200', async () => {
        const response = await request
                                    .get('/users/1')
                                    .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
    });
    
    // POST /users - no JWT auth needed 
    it('POST /users should return a JWT and status code 201', async () => {    
        const response = await request
                                    .post('/users')
                                    .send({
                                        username: testUser2.username,
                                        first_name: testUser2.firstName,
                                        last_name: testUser2.lastName,
                                        password: testUser2.password,
                                        is_admin: false
                                    });
        
        expect(response.status).toBe(201);
    });
    
    // POST /users/auth
    it('POST /users/auth should return a JWT', async () => {
        const response = await request
                                    .post('/users/auth')
                                    .send({
                                        username: testUser.username,
                                        password: testUser.password
                                    });
        
        expect(response.status).toBe(200);
    });
});