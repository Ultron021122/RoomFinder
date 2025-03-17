import { Database } from "./database.js";

export class StatusModel {
    constructor({ statusid, vchstatusname, bnactive, created_at, update_at }) {
        this.statusid = statusid;
        this.vchstatusname = vchstatusname;
        this.bnactive = bnactive;
        this.created_at = created_at;
        this.update_at = update_at;
    }

    // Methods additional to the model
    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const status = await client.query(
                `SELECT * FROM "Usuario"."RequestStatus";`
            );
            return status.rows.map((status) => new StatusModel(status));
        } finally {
            client.release();
        }
    }
}