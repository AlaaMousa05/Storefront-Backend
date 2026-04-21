import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.get('/', (_req: Request, res: Response) => {
  res.send('Storefront Backend API is running');
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;