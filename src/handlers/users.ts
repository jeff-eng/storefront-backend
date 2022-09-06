import express from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyAuthToken from '../utilities/tokenAuth';

dotenv.config();

interface LoginUserCredentials {
    username: string;
    password: string;
};

// Create instance of UserStore class
const userStore = new UserStore();

//TODO: For the index and show routes, implement JWT validation
const index = async (_req: express.Request, res: express.Response) => {
    const allUsers = await userStore.index();
    
    res.json(allUsers);
};

const show = async (req: express.Request, res: express.Response) => {
    const singleUser = await userStore.show(parseInt(req.params.id));
    
    res.json(singleUser);
};

// The create route should not require a token because you should not have to have a token to create a new user account
// To be able to create another admin user, admin user providing their JWT needs to be added to auth header
const create = async (req: express.Request, res: express.Response) => {
   
    // Get the user input
    const newUsernameInput: string = req.body.username;
    const newFirstNameInput: string = req.body.first_name;
    const newLastNameInput: string = req.body.last_name;
    const newPasswordInput: string = req.body.password;
    const newIsAdminInput: boolean = req.body.is_admin;
    
    // User is requesting creation of admin if the value of is_admin in the request body is true
    // This filters out any user from being able to make themselves an admin user
    if (newIsAdminInput == true) {
        try {
            // Check that the user is an admin; get JWT from authorization header if user sent it in request
            const authorizationHeader = req.headers.authorization;
            const token = authorizationHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            
            if (decoded.is_admin == false) {
                throw new Error('Admin user privileges required to create an admin user');
            }
        } catch (err) {
            res.status(401);
            res.json(err);
            return;
        }
    }
    
    // Create the User object
    const newUser: User = {
        username: newUsernameInput,
        firstName: newFirstNameInput,
        lastName: newLastNameInput,
        password: newPasswordInput,
        isAdmin: newIsAdminInput
    };
      
    try {
        // Call the model method
        const createdUser = await userStore.create(newUser);
        // Sign a token for user creation
        const token = jwt.sign({ user: createdUser }, process.env.TOKEN_SECRET);
        // Return JWT in response
        res.status(201).json(token);
        
    } catch (err) {
        res.status(400).json(err);
    }
};

const authenticate = async (req: express.Request, res: express.Response) => {
    const userToAuthenticate: LoginUserCredentials = {
        username: req.body.username,
        password: req.body.password
    };
    
    try {
        const u = await userStore.authenticate(userToAuthenticate.username, userToAuthenticate.password);
        // Sign token
        const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET);
        
        res.json(token);
    } catch (err) {
        res.status(401).json(err);
    }
};

const userRoutes = (app: express.Application) => {
    // GET /users --> index
    app.get('/users', verifyAuthToken, index); 
    // GET /users/:id --> show
    app.get('/users/:id', verifyAuthToken, show);
    // POST /users --> create 
    app.post('/users', create);
    // POST /users/auth --> authenticate
    app.post('/users/auth', authenticate)
};

export default userRoutes;