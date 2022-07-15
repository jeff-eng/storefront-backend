import express from 'express';

// Index method - returns an array of products

// Show method

// Create method

// Delete method

// Update method

// Top Five method

// Category Index method



const productRoutes = (app: express.Application) => {
    app.get('/products', (_req: express.Request, res: express.Response) => {
        res.status(200).send('Hello from /products');
    });
};

export default productRoutes;