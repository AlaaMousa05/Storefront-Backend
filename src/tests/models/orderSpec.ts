import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import Client from '../../database';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    const conn = await Client.connect();
    await conn.query('DELETE FROM order_products; DELETE FROM orders; DELETE FROM products; DELETE FROM users;');
    conn.release();

    
    const user = await userStore.create({
      firstName: 'Order',
      lastName: 'Tester',
      password: 'testpass'
    });
    userId = user.id as number;


    const product = await productStore.create({
      name: 'Test Product for Order',
      price: 50.00,
      category: 'test'
    });
    productId = product.id as number;
  });

  it('should have a currentOrderByUser method', () => {
    expect(orderStore.currentOrderByUser).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('should have an addProduct method', () => {
    expect(orderStore.addProduct).toBeDefined();
  });

  it('create method should add an order', async () => {
    const order = await orderStore.create({
      user_id: userId,
      status: 'active'
    });
    expect(order.user_id).toEqual(userId);
    expect(order.status).toEqual('active');
  });

  it('currentOrderByUser should return active order', async () => {
    const order = await orderStore.currentOrderByUser(userId);
    expect(order).toBeTruthy();
    if (order) {
      expect(order.status).toEqual('active');
    }
  });

  it('addProduct should add a product to order', async () => {
    const order = await orderStore.currentOrderByUser(userId);
    const orderId = (order as any).id;
    const orderProduct = await orderStore.addProduct({
      order_id: orderId,
      product_id: productId,
      quantity: 3
    });
    expect(orderProduct.quantity).toEqual(3);
    expect(orderProduct.product_id).toEqual(productId);
  });
});