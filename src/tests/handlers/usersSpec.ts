import supertest from 'supertest';
import app from '../../server';
import Client from '../../database';

const request = supertest(app);

describe('User Endpoints', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('DELETE FROM order_products; DELETE FROM orders; DELETE FROM products; DELETE FROM users;');
    conn.release();

    const res = await request
      .post('/users')
      .send({
        firstName: 'Auth',
        lastName: 'Tester',
        password: 'secret'
      });
    token = res.body.token;
    userId = res.body.user.id;
  });

  it('POST /users should create a user and return token', async () => {
    const response = await request
      .post('/users')
      .send({
        firstName: 'New',
        lastName: 'User',
        password: 'pass123'
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('POST /users/login should authenticate and return token', async () => {
    const response = await request
      .post('/users/login')
      .send({
        firstName: 'Auth',
        lastName: 'Tester',
        password: 'secret'
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('GET /users should require token', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });

  it('GET /users with valid token should return list', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /users/:id should require token', async () => {
    const response = await request.get(`/users/${userId}`);
    expect(response.status).toBe(401);
  });

  it('GET /users/:id with valid token should return user', async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.firstName).toEqual('Auth');
  });
});
