import { Database } from "./database.js";

export class LeaseStatusModel {
    constructor({ leasestatusid, vchstatusname, bnactive, created_at, update_at }) {
        this.leasestatusid = leasestatusid;
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
                `SELECT * FROM "Usuario"."LeaseStatus";`
            );
            return status.rows.map((status) => new LeaseStatusModel(status));
        } finally {
            client.release();
        }
    }
}