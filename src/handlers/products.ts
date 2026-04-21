import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
import { verifyAuthToken } from '../middlewares/auth';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  const product = await store.show(id);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    const product = await store.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default productRoutes;