import supertest from 'supertest';
import app from '../../server';
import Client from '../../database';

const request = supertest(app);

describe('Product Endpoints', () => {
  let token: string;
  let productId: number;

  beforeAll(async () => {
    
    const conn = await Client.connect();
    await conn.query('DELETE FROM order_products; DELETE FROM orders; DELETE FROM products; DELETE FROM users;');
    conn.release();

  
    const res = await request
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'User',
        password: 'password123'
      });
    token = res.body.token;
  });

  it('GET /products should return 200', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('POST /products should require token', async () => {
    const response = await request
      .post('/products')
      .send({ name: 'Unauth Product', price: 10 });
    expect(response.status).toBe(401);
  });

  it('POST /products with valid token should create product', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        price: 29.99,
        category: 'electronics'
      });
    productId = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Test Product');
  });

  it('GET /products/:id should return product', async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Test Product');
  });
});
