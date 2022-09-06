import express from 'express';
import { AddProduct, OrderStore, Order } from '../models/order';
import verifyAuthToken from '../utilities/tokenAuth';

// Create instance of OrderStore class
const orderStore = new OrderStore();

const currentOrder = async (req: express.Request, res: express.Response) => {
    const userid = parseInt(req.params.userid);
    
    try {
        const currentOrder = await orderStore.currentOrder(userid);
        res.status(200).json(currentOrder);
    } catch (err) {
        res.status(400).json(err);
    }
};

const completedOrders = async (req: express.Request, res: express.Response) => {
    const userid = parseInt(req.params.userid);
    
    try {
        const compOrders = await orderStore.completedOrders(userid);
        res.status(200).json(compOrders);
    } catch (err) {
        res.status(400).json(err);
    }    
};

// user_id is supplied in POST request payload
const create = async (req: express.Request, res: express.Response) => {
    const userid = parseInt(req.body.user_id);
    
    const newOrder: Order = {
        userID: userid,
        isComplete: false
    };
           
    try {
        const order = await orderStore.create(newOrder);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json(err);
    }
};

const addToOrder = async (req: express.Request, res: express.Response) => { 
    const productToAdd: AddProduct = {
        quantity: parseInt(req.body.quantity),
        orderID: parseInt(req.params.id),
        productID: parseInt(req.body.productID)
    };

    try {
        const addedProduct = await orderStore.addToOrder(productToAdd);
        res.json(addedProduct);
    } catch (err) {
        res.status(400).json(err);
    }
};


const orderRoutes = (app: express.Application) => {
    // GET /orders/:userid
    app.get('/orders/:userid', verifyAuthToken, currentOrder);
    // GET /orders/completed/:userid
    app.get('/orders/completed/:userid', verifyAuthToken, completedOrders);
    // POST /orders (user_id is transmitted in payload sent to server)
    app.post('/orders', verifyAuthToken, create)
    // POST /orders/:id/products (id is the order ID)
    app.post('/orders/:id/products', verifyAuthToken, addToOrder);
};

export default orderRoutes;