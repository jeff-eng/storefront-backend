import { Product, ProductStore } from '../product';

const productStore = new ProductStore();

describe('Product model CRUD methods test suite', () => {
    // Test that methods are defined in the model
    it('should have an index method defined', () => {
        expect(productStore.index).toBeDefined();
    });
    
    it('should have a show method defined', () => {
        expect(productStore.show).toBeDefined();
    });
    
    it('should have a create method defined', () => {
        expect(productStore.create).toBeDefined();
    });
    
    // Create model method
    it('Create method should add product to test DB', async () => {
        const result = await productStore.create({
            name: 'surge protector',
            price: 20
        });
        
        expect(result).toEqual(jasmine.objectContaining({
            name: 'surge protector',
            price: 20
        }));
    });
    
    it('Create method should add another product to test DB', async () => {
        const result = await productStore.create({
            name: 'blender',
            price: 50
        });
        
        expect(result).toEqual(jasmine.objectContaining({
            name: 'blender',
            price: 50
        }));
    });
    
    // Index model method
    it('Index method should return list of products', async () => {
        const result = await productStore.index();
        
        expect(result).toEqual([
            jasmine.objectContaining({
                name: 'surge protector', 
                price: 20
            }),
            jasmine.objectContaining( {
                name: 'blender', 
                price: 50
            })
        ]);
    });
    
    // Show model method
    it('Show method should return single product', async () => {
        const id = 1;
        const result = await productStore.show(1);

        expect(result).toEqual(jasmine.objectContaining({
            name: 'surge protector', 
            price: 20
        }));
    });
    
});