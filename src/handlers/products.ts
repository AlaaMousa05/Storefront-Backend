import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
import { verifyAuthToken } from '../middlewares/auth';
import { getErrorMessage } from '../utils/errors';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};

const show = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    const product = await store.show(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product = await store.create(req.body);
    return res.json(product);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default productRoutes;
