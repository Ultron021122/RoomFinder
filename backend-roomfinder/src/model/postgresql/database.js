import 'dotenv/config';
import pkg from "pg";
import { config } from './config.js';
import { errorsMap } from './errors.js';

const { Pool } = pkg;

export class Database {
    constructor(){
        this.pool = new Pool(config);
    }

    async query(sql, params, client = null) {
        const connection = client || await this.pool.connect();
        try {
            const result = await connection.query(sql, params);
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
            if(!client){
                connection.release();
            }
        }
    }

    async getConnection(){
        return await this.pool.connect();
    }

    async beginTransaction(client){
        await client.query('BEGIN');
    }

    async commitTransaction(client){
        await client.query('COMMIT');
    }

    async rollbackTransaction(client) {
        await client.query('ROLLBACK');
    }
}
