import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async currentOrderByUser(userId: number): Promise<Order | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [userId, 'active']);
      conn.release();
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Could not get current order: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order: ${err}`);
    }
  }

  async addProduct(op: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [op.order_id, op.product_id, op.quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add product to order: ${err}`);
    }
  }
}