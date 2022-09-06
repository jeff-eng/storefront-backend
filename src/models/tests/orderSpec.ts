import { Order, OrderStore, AddProduct, OrderProduct } from '../order';
import { User, UserStore } from '../user';
import { Product, ProductStore } from '../product';

const testOrderStore = new OrderStore();
const testUserStore = new UserStore();
const testProductStore = new ProductStore();

describe('Order model CRUD methods test suite', () => {
    let testUser: User;
    let testProduct: Product;
    let testCompleteOrder: Order;
    let testOrderInProgress: Order;
    
    beforeAll( async () => {
        const newTestUser: User = {
            username: 'jedipadawan',
            firstName: 'Ahsoka',
            lastName: 'Tano',
            password: 'MayTheForceBeWithU',
            isAdmin: false
        };
        
        const newTestProduct = {
            name: 'Lightsaber',
            price: 200
        };
        
        const newCompleteTestOrder = {
            userID: 3,
            isComplete: true
        };
        
        const newInProgressTestOrder = {
            userID: 4,
            isComplete: false
        };
        
        // Create a test user
        testUser = await testUserStore.create(newTestUser);      
        // Create test product
        testProduct = await testProductStore.create(newTestProduct);
        // Create new complete test order
        testCompleteOrder = await testOrderStore.create(newCompleteTestOrder);
        // Create new test order with is_complete status set to false
        testOrderInProgress = await testOrderStore.create(newInProgressTestOrder);
    });
    
    // Test that methods are defined in the model
    it('should have method to retrieve current order defined', () => {
        expect(testOrderStore.currentOrder).toBeDefined();
    });
    
    it('should have method to retrieve completed orders defined', () => {
        expect(testOrderStore.completedOrders).toBeDefined();
    });
    
    it('should have method to create new order defined', () => {
        expect(testOrderStore.create).toBeDefined();
    });
    
    it('should have method to add product to order defined', () => {
        expect(testOrderStore.addToOrder).toBeDefined();
    });
    
    
    // Create Order
    it('should create a new order', async () => {
        const newOrder: Order = {
            userID: testUser.id,
            isComplete: false
        };
        
        const result = await testOrderStore.create(newOrder);
        
        expect(result).toContain(jasmine.objectContaining({
            userID: testUser.id,
            is_complete: false
        }));
    });
    
    // addToOrder
    it('should add product to an order', async () => {
        
        const testProduct1: AddProduct = {
            quantity: 3,
            orderID: 1,
            productID: 1
        };
        
        const result = testOrderStore.addToOrder(testProduct1);
        
        expect(result).toContain(jasmine.objectContaining({
            quantity: 3,
            orderID: 1,
            productID: 1
        }));
    });
    
    // completedOrders
    it('should return array containing completed test order', async () => {
        const testUserID = 3;
        const orders = await testOrderStore.completedOrders(testUserID);
        
        // Checking if the array returned contains an object with testOrder key/values
        expect(orders).toContain({
            id: testCompleteOrder.id,
            userID: testCompleteOrder.userID,
            isComplete: testCompleteOrder.isComplete
        });
    });
    
    // currentOrder
    it('should return current order for test user assigned to testOrderInProgress', async () => {
        const testUserID = testOrderInProgress.userID; // should be 4
        const currentOrder = await testOrderStore.currentOrder(testUserID);
        
        expect(currentOrder).toEqual({
            id: testOrderInProgress.id,
            userID: testOrderInProgress.userID,
            isComplete: false
        });
    });
});