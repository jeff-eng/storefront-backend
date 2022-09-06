import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyAuthToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {       
        const authHeader = req.headers.authorization;
        // Parse string for the token (the authorization header has this format: Bearer <token>)
        const token = authHeader.split(' ')[1];
        // The decoded JWT should return a user object
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        next();
    } catch {
        res.status(401);
        res.json('Access Denied - Invalid token');
    }
};

// Check that user is an admin
export const adminAuthorization = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        
        // Decode the JWT
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
        console.log(decoded);
        
        // throw error if user is not an admin
        if (!decoded.isAdmin) {
            throw new Error('User is not an admin.');
        }
        
        next();
    } catch (err) {
        res.status(401);
        res.json('Admin privileges required - Invalid Token')
    }
};

export default verifyAuthToken;
