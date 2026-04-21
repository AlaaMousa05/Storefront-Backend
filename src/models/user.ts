import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, firstname AS "firstName", lastname AS "lastName" FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, firstname AS "firstName", lastname AS "lastName" FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const pepper = process.env.BCRYPT_PASSWORD as string;
      const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const conn = await Client.connect();
      const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING id, firstname AS "firstName", lastname AS "lastName"';
      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create user: ${err}`);
    }
  }

  async authenticate(firstName: string, lastName: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, firstname AS "firstName", lastname AS "lastName", password FROM users WHERE firstname=($1) AND lastname=($2)';
      const result = await conn.query(sql, [firstName, lastName]);
      conn.release();

      if (result.rows.length) {
        const user = result.rows[0];
        const pepper = process.env.BCRYPT_PASSWORD as string;
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Authentication failed: ${err}`);
    }
  }
}
