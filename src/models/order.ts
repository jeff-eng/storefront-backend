import client from '../database';

export type Order = {
    id?: number | undefined;
    userID: number;
    isComplete: boolean;
};

export type OrderProduct = {
    id?: number;
    quantity: number;
    orderID: number;
    productID: number;
};

export type AddProduct = {
    quantity: number;
    orderID: number;
    productID: number;
};

// Class definition for methods interacting with Order table
export class OrderStore {
    
    // Current order by user (arg: user id); a "current" order will have boolean value of false for isComplete property/column
    async currentOrder(userid: number): Promise<Order> {
        try {
            //ts@-ignore
            const connection = await client.connect();
            
            // Retrieve first row returned from query where order status is not complete
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND is_complete=false FETCH FIRST ROW';
            
            const result = await connection.query(sql, [userid]);
            
            connection.release();
            
            return result;
        } catch (err) {
            throw new Error(`Unable to retrieve a current order for user with user_id ${userid}: ${err}`);
        }
    }
    
    // Completed orders by user (arg: user id)
    async completedOrders(userid: number): Promise<Order[]> {
        try {
            //ts@-ignore
            const connection = await client.connect();
            
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND is_complete=true';
            
            const result = await connection.query(sql, [userid]);
            
            connection.release();
            
            return result;
        } catch (err) {
            throw new Error(`Unable to retrieve completed orders for user with user_id ${userid}: ${err}`);
        }
    }
    
    // Create new order
    async create(newOrder: Order): Promise<Order> {
        try {
            //ts@-ignore
            const connection = await client.connect();
            
            const sql = 'INSERT INTO orders (is_complete, user_id) VALUES ($1, $2)';
            
            const result = await connection.query(sql, [newOrder.isComplete, newOrder.userID]);
            
            connection.release();
            
            return result;
            
        } catch (err) {
            throw new Error(`Unable to create new order: ${err}`);
        }
    }
    
    // Adding products to an open order
    async addToOrder(addProduct: AddProduct): Promise<OrderProduct> {
        // Check if order is still open, otherwise throw an error
        try {
            //ts@-ignore
            const connection = await client.connect();
            
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            
            const result = await connection.query(sql, [addProduct.orderID]);
            
            const order = result.rows[0];
            
            connection.release();
            
            // Throw an error if order is showing "complete" status
            if (order.is_complete) {
                throw new Error(`Unable to add ${addProduct.productID} to order ${addProduct.orderID} due to order showing complete status.`);
            }
            
        } catch (err) {
            throw new Error(`${err}`);
        }
        
        // Attempt to add row to order_products table for the open order
        try {
            //ts@-ignore
            const connection = await client.connect();
            
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
            
            const result = await connection.query(sql, [addProduct.quantity, addProduct.orderID, addProduct.productID]);
            
            const order = result.rows[0];
            
            connection.release();
            
            return order;            
        } catch (err) {
            throw new Error(`Unable to add Product ID ${addProduct.productID} to Order ID ${addProduct.orderID}`);
        }
    }
    
};