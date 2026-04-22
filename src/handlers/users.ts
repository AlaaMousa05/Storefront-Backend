import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserStore } from '../models/user';
import { verifyAuthToken } from '../middlewares/auth';
import { getErrorMessage } from '../utils/errors';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};

const show = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try {
    const user = await store.show(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = await store.create(req.body);
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string);
    return res.json({ user, token });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;
  try {
    const user = await store.authenticate(firstName, lastName, password);
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string);
    return res.json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/login', authenticate);
};

export default userRoutes;
