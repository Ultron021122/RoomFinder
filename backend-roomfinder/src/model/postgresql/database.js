import 'dotenv/config';
import pkg from "pg";
import { config } from './config.js';
import { errorsMap } from './errors.js';

const { Pool } = pkg;

export class Database {
    static async query(sql, params) {
        const client = new Pool(config);
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } catch (error) {
            const { message, status } = errorsMap[error.code] || {
                message: 'Internal server error',
                status: 500,
            };

            let customError = new Error(message);
            customError.status = status;
            throw customError;
        } finally {
            await client.end();
        }
    }
}
