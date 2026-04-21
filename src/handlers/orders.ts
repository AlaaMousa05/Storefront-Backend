import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
import { verifyAuthToken } from '../middlewares/auth';

const store = new OrderStore();

const currentOrder = async (req: Request, res: Response) => {
  const userId = Number(req.params.user_id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const order = await store.currentOrderByUser(userId);
  res.json(order);
};

const createOrder = async (req: Request, res: Response) => {
  const order = await store.create(req.body);
  res.json(order);
};

const addProduct = async (req: Request, res: Response) => {
  const orderProduct = await store.addProduct(req.body);
  res.json(orderProduct);
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders/current/:user_id', verifyAuthToken, currentOrder);
  app.post('/orders', verifyAuthToken, createOrder);
  app.post('/orders/products', verifyAuthToken, addProduct);
};

export default orderRoutes;