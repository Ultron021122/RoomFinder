import mysql from 'mysql2/promise';
import { config } from './config.js';
export class Database {
  static async query(sql, params) {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const result = await connection.query(sql, params);
      return result;
    } finally {
      this.close(connection);
    }
  }
  static async close(connection) {
    if (connection) {
      await connection.end();
    }
  }
}