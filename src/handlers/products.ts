// import express
import express from 'express';
// import the model type and the class for product
import {Product, ProductStore} from '../models/product';
import verifyAuthToken from '../utilities/tokenAuth';

// Create instance of ProductStore class
const productStore = new ProductStore();

const index = async (_req: express.Request, res: express.Response) => {
    try {
        const allProducts = await productStore.index();
        res.status(200).json(allProducts);
    } catch (err) {
        res.status(400).json(err);
    }
};

const show = async (req: express.Request, res: express.Response) => {
    const productID = parseInt(req.params.id);
    
    try {
        const singleProduct = await productStore.show(productID);
        res.status(200).json(singleProduct);
    } catch (err) {
        res.status(400).json(err);
    }

};

const create = async (req: express.Request, res: express.Response) => {
    try {
        const productName: string = req.body.name;
        const productPrice: number = parseInt(req.body.price);
        
        // Create a Product object
        const newProduct: Product = {
            name: productName,
            price: productPrice
        };
        
        // Call the ProductStore model create method
        const result = productStore.create(newProduct);
        
        // Server response should be sent back as JSON
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};


// Define the express RESTful route endpoints and the associated methods
const productRoutes = (app: express.Application) => {
    // GET /products --> index
    app.get('/products', index);
    // GET /products/:id --> show
    app.get('/products/:id', show);
    // POST /products --> create
    app.post('/products', verifyAuthToken, create);
};

// Export the route
export default productRoutes;