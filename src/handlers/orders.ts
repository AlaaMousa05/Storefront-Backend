import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
import { verifyAuthToken } from '../middlewares/auth';
import { getErrorMessage } from '../utils/errors';

const store = new OrderStore();

const currentOrder = async (req: Request, res: Response) => {
  const userId = Number(req.params.user_id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try {
    const order = await store.currentOrderByUser(userId);
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await store.create(req.body);
    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderProduct = await store.addProduct(req.body);
    return res.json(orderProduct);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders/current/:user_id', verifyAuthToken, currentOrder);
  app.post('/orders', verifyAuthToken, createOrder);
  app.post('/orders/products', verifyAuthToken, addProduct);
};

export default orderRoutes;
