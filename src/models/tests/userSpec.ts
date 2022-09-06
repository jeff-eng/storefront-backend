import { User, UserStore } from '../user';

const userStore = new UserStore();

describe('User model CRUD methods test suite', () => {
    // Test that methods are defined in the model
    it('should have an index method defined', () => {
        expect(userStore.index).toBeDefined();
    });
    
    it('should have a show method defined', () => {
        expect(userStore.show).toBeDefined();
    });
    
    it('should have a create method defined', () => {
        expect(userStore.create).toBeDefined();
    });
    
    it('should have an authenticate method defined', () => {
        expect(userStore.authenticate).toBeDefined();
    });
    
    // Create
    it('Create method should create user', async () => {
        const result = await userStore.create({
            username: 'test_user',
            firstName: 'Testy',
            lastName: 'McTestFace',
            password: 'testpassword123',
            isAdmin: false
        });
        
        expect(result).toEqual(jasmine.objectContaining({
            username: 'test_user',
            firstName: 'Testy',
            lastName: 'McTestFace',
            isAdmin: false
        }));
    });
    
    // Index
    it('Index method should return array of users - array contains test user object', async () => {
        const result = await userStore.index();
        
        expect(result).toContain(jasmine.objectContaining({
            username: 'test_user',
            firstName: 'Testy',
            lastName: 'McTestFace',
            isAdmin: false
        }));
    });
    
    // Show
    it('Show method should return user with id of 1', async () => {
        const id = 1;
        const result = await userStore.show(id);
        
        expect(result).toContain(jasmine.objectContaining({
            username: 'test_user',
            firstName: 'Testy',
            lastName: 'McTestFace',
            isAdmin: false
        }));
    });
    
    
    // Authenticate
    it('Should return corresponding user if authenticated with username+password combo', async () => {
        const username = 'test_user';
        const password = 'testpassword123';
        const result = await userStore.authenticate(username, password);
        
        expect(result).toContain(jasmine.objectContaining({
            username: 'test_user',
            firstName: 'Testy',
            lastName: 'McTestFace',
            isAdmin: false
        }));
    });
    
});