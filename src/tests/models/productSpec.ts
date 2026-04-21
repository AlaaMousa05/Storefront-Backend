import { ProductStore } from '../../models/product';
import Client from '../../database';

const store = new ProductStore();

describe('Product Model', () => {
  let createdProductId: number;

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

  it('create method should add a product', async () => {
    const product = await store.create({
      name: 'Test Product',
      price: 99.99,
      category: 'test'
    });
    createdProductId = product.id as number;
    expect(product.name).toEqual('Test Product');
    expect(Number(product.price)).toEqual(99.99);
  });

  it('index method should return a list of products', async () => {
    const products = await store.index();
    expect(products.length).toBeGreaterThan(0);
  });

  it('show method should return the correct product', async () => {
    const product = await store.show(createdProductId);
    expect(product.name).toEqual('Test Product');
  });
});
