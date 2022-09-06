// @ts-ignore
import client from '../database';

// Define the TypeScript type for Products
export type Product = {
    id?: number;
    name: string;
    price: number;
};

// Define the class and its model methods - representation of the database
export class ProductStore {
    // Index - returns an array of all products in the database
    async index(): Promise<Product[]> {
        try {
            //ts@-ignore
            const connection = await client.connect();
            const sql = 'SELECT * FROM products';            
            const result = await connection.query(sql);            
            connection.release();
            
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to retrieve list of products: ${err}`);
        }
    }
    
    // Show - show single product
    async show(id: number): Promise<Product> {
        try {
            //ts@-ignore
            const connection = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            
            // Return only a single result
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to retrieve product with id ${id}: ${err}`);
        }
    }
    
    // Create - Create new product
    async create(prod: Product): Promise<Product> {
        try {
            //ts@-ignore
            const connection = await client.connect();       
            const sql = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';
            const result = await connection.query(sql, [prod.name, prod.price]);
            const product = result.rows[0];
            connection.release();
            
            return product;
        } catch (err) {
            throw new Error(`Unable to create new product ${prod.name}: ${err}`);
        }
    }
    
};