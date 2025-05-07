import { Database } from "./database.js";

export class TasksModel {
    constructor() {}

    static async setLeasesStatus() {
        try {
            const db = new Database();
            const client = await db.pool.connect();

            try {
                const result = await client.query(
                    'CALL "Usuario"."prSetStartLeases"($1)', [null]
                );

                const intresult = result.rows[0].intresult;
                return intresult;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error updating leases: ${error.message}`)
        }
    }
}