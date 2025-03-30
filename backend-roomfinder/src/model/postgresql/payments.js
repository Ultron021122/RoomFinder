import { Database } from "./database.js";

export class PaymentModel {
    constructor({ paymentid, leasesid, paymentmethodid, dtpayment, decamount, created_at, vchpaymentstatus, stripesessionid, stripe_payment_intent_id, client_reference_id }) {
        this.paymentid = paymentid;
        this.leasesid = leasesid;
        this.paymentmethodid = paymentmethodid;
        this.dtpayment = dtpayment;
        this.decamount = decamount;
        this.created_at = created_at;
        this.vchpaymentstatus = vchpaymentstatus;
        this.stripesessionid = stripesessionid;
        this.stripe_payment_intent_id = stripe_payment_intent_id;
        this.client_reference_id = client_reference_id;
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
        const client = await db.pool.connect();
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
        try {
            const { leasesid, paymentmethodid, dtpayment, decamount, vchpaymentstatus, stripesessionid, stripe_payment_intent_id, client_reference_id } = input
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `INSERT INTO "Usuario"."Payments"(leasesid, paymentmethodid, dtpayment, decamount, vchpaymentstatus, stripesessionid, stripe_payment_intent_id, client_reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
                    [leasesid, paymentmethodid, dtpayment, decamount, vchpaymentstatus, stripesessionid, stripe_payment_intent_id, client_reference_id]
                );

                return new PaymentModel(result.rows[0]);
            } finally {
                client.release();
            }

        } catch (error) {
            throw new Error(`Error creating payment: ${error.message}`);
        }
    }
 
    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                await client.query(
                    `DELETE FROM "Usuario"."Payments" WHERE paymentid = $1;`,
                    [id]
                );

                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting payment: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const payment = await this.getById({ id })
            if (!payment) return null;

            const paymentFields = [
                'leasesid',
                'paymentmethodid',
                'dtpayment',
                'decamount',
                'vchpaymentstatus',
                'stripesessionid',
                'stripe_payment_intent_id',
                'client_reference_id'
            ];

            const paymentData = this.createDataObject(input, paymentFields);

            const updateColumns = Object.entries({
                ...paymentData
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(paymentData).indexOf(key) + 1}`;
                })
                .join(', ');

            const updateValues = Object.values({
                ...paymentData
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Payments" SET ${updateColumns} WHERE paymentid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating review: ${error.message}`);
        }
    }

    static createDataObject(input, fields) {
        if (!Array.isArray(fields)) {
            throw new Error("fields should be an array");
        }

        return fields.reduce((obj, field) => {
            if (input[field] !== undefined) {
                obj[field] = input[field];
            }

            return obj;
        }, {});
    }
}