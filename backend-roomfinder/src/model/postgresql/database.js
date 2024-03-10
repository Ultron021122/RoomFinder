import 'dotenv/config';
import pkg from "pg";
import { config } from './config.js';

const { Pool } = pkg;

export class Database {
    static async query(sql, params) {
        const client = new Pool(config);
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.end();
        }
    }
}
