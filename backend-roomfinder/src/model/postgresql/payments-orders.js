import { Database } from "./database.js";

export class PaymentOrderModel {
    constructor({ orderid, leasesid, amount, status, vchconcept, created_at, updated_at }) {
        this.orderid = orderid;
        this.leasesid = leasesid;
        this.amount = amount;
        this.status = status;
        this.vchconcept = vchconcept;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const orders = await client.query(
                `SELECT * FROM "Usuario"."PaymentOrders";`
            );
            return orders.rows.map((order) => new PaymentOrderModel(order));
        } finally {
            client.release();
        }
    }

    static async getByLeases({ leasesid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const orders = await client.query(
                `SELECT * FROM "Usuario"."PaymentOrders" WHERE leasesid = $1;`,
                [leasesid]
            );
            return orders.rows.map((order) => new PaymentOrderModel(order));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const order = await client.query(
                `SELECT * FROM "Usuario"."PaymentOrders" WHERE orderid = $1;`,
                [id]
            );
            return order.rowCount > 0 ? new PaymentOrderModel(order.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { leasesid, amount, status } = input;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const order = await client.query(
                    `INSERT INTO "Usuario"."PaymentOrders" (leasesid, amount, status) VALUES ($1, $2, $3) RETURNING *;`,
                    [leasesid, amount, status]
                );
                return new PaymentOrderModel(order.rows[0]);
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error creating payment order:", error);
            throw error;
        }
    }

    static async update({ id, input }) {
        try {
            const { leasesid, amount, status } = input;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const order = await client.query(
                    `UPDATE "Usuario"."PaymentOrders" SET leasesid = $1, amount = $2, status = $3, updated_at=CURRENT_TIMESTAMP WHERE orderid = $4 RETURNING *;`,
                    [leasesid, amount, status, id]
                );
                return order.rowCount > 0 ? new PaymentOrderModel(order.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error updating payment order:", error);
            throw error;
        }
    }

    static async delete({ id }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `DELETE FROM "Usuario"."PaymentOrders" WHERE orderid = $1 RETURNING *;`,
                    [id]
                );
                return result.rowCount > 0 ? new PaymentOrderModel(result.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error deleting payment order:", error);
            throw error;
        }
    }

    static async deleteByLeasesId({ leasesid }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `DELETE FROM "Usuario"."PaymentOrders" WHERE leasesid = $1 RETURNING *;`,
                    [leasesid]
                );
                return result.rowCount > 0 ? new PaymentOrderModel(result.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error deleting payment order by leases ID:", error);
            throw error;
        }
    }

    static async deleteByOrderId({ orderid }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `DELETE FROM "Usuario"."PaymentOrders" WHERE orderid = $1 RETURNING *;`,
                    [orderid]
                );
                return result.rowCount > 0 ? new PaymentOrderModel(result.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error deleting payment order by order ID:", error);
            throw error;
        }
    }
}