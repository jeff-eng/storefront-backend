import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Environment variables
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

// Define the TypeScript type for Users
export type User = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    isAdmin: boolean;
};

export class UserStore {
    // Index
    async index(): Promise<User[]> {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM users';
            const result = await connection.query(sql);
            connection.release();
            
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to retrieve list of users: ${err}`);
        }
    } 
    
    
    // Show
    async show(id: number): Promise<User> {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to retrieve user with id ${id}: ${err}`);
        }
    }
    
    
    // Create
    async create(u: User): Promise<User> {
        try {
            const connection = await client.connect();
            const sql = 'INSERT INTO users (username, first_name, last_name, password_digest, is_admin) VALUES ($1, $2, $3, $4, $5)';
            // Hash the password with salt and pepper
            const hash = bcrypt.hashSync(
                u.password + pepper,
                saltRounds
            );
            const result = await connection.query(sql, [u.username, u.firstName, u.lastName, hash, u.isAdmin]);
            const user = result.rows[0];
            connection.release();
            
            return user;
        } catch (err) {
            throw new Error(`Unable to create new user ${u.username}: ${err}`);
        }
    }
    
    // Authenticate
    async authenticate(username: string, password: string): Promise<User | null> {
        const connection = await client.connect();
        
        // Look up the user in the users table
        const sql = 'SELECT password_digest FROM users WHERE username=($1)';
        const result = await connection.query(sql, [username]);
        
        connection.release();
        
        // If there's a match
        if (result.rows.length) {
            const user = result.rows[0];
            
            // Check user provided password against the hashed password in users table
            if (bcrypt.compareSync((password + pepper), user.password_digest)) {
                return user;
            }
        }
        
        // If no match
        return null;   
    }
}