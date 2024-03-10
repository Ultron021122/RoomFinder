import { Client } from 'pg';
import { config } from './config.js';
export class Database {
  static async query(sql, params) {
    const client = new Client();
    try {
      const res = await client.connect();
      const result = await res.query(sql, params);
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      await pool.end();
    }
  }
}