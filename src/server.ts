import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

const app: express.Application = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('Hello world!');
});

// Route handlers
productRoutes(app);
userRoutes(app);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

export default app;