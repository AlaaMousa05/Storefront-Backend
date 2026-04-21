import { UserStore } from '../../models/user';
import Client from '../../database';

const store = new UserStore();

describe('User Model', () => {
  let createdUserId: number;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('DELETE FROM order_products; DELETE FROM orders; DELETE FROM products; DELETE FROM users;');
    conn.release();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a user', async () => {
    const user = await store.create({
      firstName: 'Test',
      lastName: 'User',
      password: 'password123'
    });
    createdUserId = user.id as number;
    expect(user.firstName).toEqual('Test');
    expect(user.lastName).toEqual('User');
  });

  it('index method should return a list of users', async () => {
    const users = await store.index();
    expect(users.length).toBeGreaterThan(0);
  });

  it('show method should return the correct user', async () => {
    const user = await store.show(createdUserId);
    expect(user.firstName).toEqual('Test');
  });

  it('authenticate method should return user if credentials correct', async () => {
    const user = await store.authenticate('Test', 'User', 'password123');
    expect(user).toBeTruthy();
    if (user) {
      expect(user.firstName).toEqual('Test');
    }
  });

  it('authenticate method should return null if credentials incorrect', async () => {
    const user = await store.authenticate('Test', 'User', 'wrongpass');
    expect(user).toBeNull();
  });
});
