import supertest from 'supertest';
import app from '../../server';
import Client from '../../database';

const request = supertest(app);

describe('Order Endpoints', () => {
  let token: string;
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('DELETE FROM order_products; DELETE FROM orders; DELETE FROM products; DELETE FROM users;');
    conn.release();

    // إنشاء مستخدم
    const userRes = await request
      .post('/users')
      .send({
        firstName: 'Order',
        lastName: 'User',
        password: 'ordertest'
      });
    token = userRes.body.token;
    userId = userRes.body.user.id;

    // إنشاء منتج
    const productRes = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Order Product',
        price: 100,
        category: 'test'
      });
    productId = productRes.body.id;
  });

  it('POST /orders should require token', async () => {
    const response = await request
      .post('/orders')
      .send({ user_id: userId, status: 'active' });
    expect(response.status).toBe(401);
  });

  it('POST /orders with valid token should create order', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userId, status: 'active' });
    orderId = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body.user_id).toEqual(userId);
    expect(response.body.status).toEqual('active');
  });

  it('POST /orders/products should add product to order', async () => {
   
    const response = await request
      .post('/orders/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: orderId,
        product_id: productId,
        quantity: 2
      });
    expect(response.status).toBe(200);
    expect(response.body.quantity).toEqual(2);
  });

  it('GET /orders/current/:user_id should require token', async () => {
    const response = await request.get(`/orders/current/${userId}`);
    expect(response.status).toBe(401);
  });

  it('GET /orders/current/:user_id with valid token should return order', async () => {
    const response = await request
      .get(`/orders/current/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.user_id).toEqual(userId);
  });
});
