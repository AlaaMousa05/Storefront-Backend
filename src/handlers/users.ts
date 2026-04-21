import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserStore } from '../models/user';
import { verifyAuthToken } from '../middlewares/auth';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = await store.show(id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const user = await store.create(req.body);
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;
  const user = await store.authenticate(firstName, lastName, password);
  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  const token = jwt.sign({ user }, process.env.JWT_SECRET as string);
  res.json({ user, token });
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/login', authenticate);
};

export default userRoutes;