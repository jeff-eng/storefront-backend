import supertest from "supertest";
import app from '../../server';

const request = supertest(app);

describe('/products endpoint test(s)', () => {
    it('GET /products - returns 200 status with json array of products', async () => {
        const response = await request.get('/products');
        expect(response.headers['Content-Type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(jasmine.arrayContaining([
            jasmine.objectContaining({
                name: jasmine.any(String),
                price: jasmine.any(Number),
                category: jasmine.any(String)
            })  
        ]));
    });

    it('GET /products/:id - returns specific product by ID', async () => {
        const response = await request.get('/products/1');
        expect(response.headers['Content-Type']).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(
            jasmine.objectContaining({
                name: jasmine.any(String),
                price: jasmine.any(Number),
                category: jasmine.any(String)
            })  
        );
    });

    it('GET /products/:id - returns 404 if not found', async () => {
        const response = await request.get('/products/999999');
        expect(response.status).toEqual(404);
    });
    
    it('POST /products - created product returns 201 and the created object', async () => {
        
        // How to add JWT to test?
        
        const response = await request.post('/products').send({
                name: 'headphones',
                description: 'Wireless and noise canceling',
                price: 99.99,
                category: 'electronics'    
        });

        expect(response.headers['Content-Type']).toMatch(/json/);
        expect(response.status).toEqual(201);
        expect(response.body).toEqual(jasmine.objectContaining({
            name: 'headphones',
            description: 'Wireless and noise canceling',
            price: 99.99,
            category: 'electronics'   
        }));
    });

    // OPTIONAL TODO(S):

    // it('GET /products/topfive', async () => {
        
    // });

    // it('GET /products/:category', async () => {
        
    // });
    
});