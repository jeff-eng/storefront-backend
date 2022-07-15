import express from 'express';

const userRoutes = (app: express.Application) => {
    app.get('/users', (_req: express.Request, res: express.Response) => {
        res.status(200).send('Hello from /users');
    });
};

export default userRoutes;