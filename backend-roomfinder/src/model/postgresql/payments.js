import { Database } from "./database.js";

export class PaymentModel {
    constructor({ paymentid, leasesid, paymentmethodid, dtpayment, decamount, created_at }) {
        this.paymentid = paymentid;
        this.leasesid = leasesid;
        this.paymentmethodid = paymentmethodid;
        this.dtpayment = dtpayment;
        this.decamount = decamount;
        this.created_at = created_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const payments = await client.query(
                `SELECT * FROM "Usuario"."Payments";`
            );
            return payments.rows.map((payment) => new PaymentModel(payment));
        } finally {
            client.release();
        }
    }

    static async getByLeases({ leasesid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const payments = await client.query(
                `SELECT * FROM "Usuario"."Payments" WHERE leasesid = $1;`,
                [leasesid]
            );
            return payments.rows.map((payment) => new PaymentModel(payment));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = db.pool.connect();
        try {
            const payment = await client.query(
                `SELECT * FROM "Usuario"."Payments" WHERE paymentid = $1;`,
                [id]
            );
            return payment.rowCount > 0 ? new PaymentModel(payment.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {

    }
}