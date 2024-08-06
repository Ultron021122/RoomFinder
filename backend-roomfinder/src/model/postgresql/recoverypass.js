import { Database } from "./database.js";

export class RecoveryPassModel {
    constructor({ recuperacionid, usuarioid, vchtoken, created_at, expires_at }) {
        this.recuperacionid = recuperacionid;
        this.usuarioid = usuarioid;
        this.vchtoken = vchtoken;
        this.created_at = created_at;
        this.expires_at = expires_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const recovery = await client.query(
                `SELECT * FROM "Usuario"."RecuperacionCuenta";`
            );
            return recovery.rows.map((recovery) => new RecoveryPassModel(recovery));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const recovery = await client.query(
                `SELECT * FROM "Usuario"."RecuperacionCuenta" WHERE recuperacionid = $1;`,
                [id]
            );
            return recovery.rowCount > 0 ? new RecoveryPassModel(recovery.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByToken({ token }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const recovery = await client.query(
                `SELECT * FROM "Usuario"."RecuperacionCuenta" WHERE vchtoken = $1;`,
                [token]
            );
            return recovery.rowCount > 0 ? new RecoveryPassModel(recovery.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByUser({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const recovery = await client.query(
                `SELECT * FROM "Usuario"."RecuperacionCuenta" WHERE usuarioid = $1;`,
                [id]
            );
            return recovery.rowCount > 0 ? new RecoveryPassModel(recovery.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { usuarioid, vchtoken } = input;
            const db = new Database();
            const client = await db.pool.connect();

            const validate = await this.getByUser({ id: usuarioid });
            if (validate) {
                await this.delete({ id: validate.recuperacionid });
            }

            try {
                const recovery = await client.query(
                    `INSERT INTO "Usuario"."RecuperacionCuenta" (usuarioid, vchtoken, expires_at) VALUES ($1, $2, NOW() + INTERVAL '24 HOURS') RETURNING *;`,
                    [usuarioid, vchtoken]
                );

                return recovery.rowCount > 0 ? new RecoveryPassModel(recovery.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { vchtoken, expires_at } = input;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const recovery = await client.query(
                    `UPDATE "Usuario"."RecuperacionCuenta" SET vchtoken = $1, expires_at = $2 WHERE recuperacionid = $3 RETURNING *;`,
                    [vchtoken, expires_at, id]
                );
                return recovery.rowCount > 0 ? new RecoveryPassModel(recovery.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async delete({ id }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const recovery = await client.query(
                    `DELETE FROM "Usuario"."RecuperacionCuenta" WHERE recuperacionid = $1 RETURNING *;`,
                    [id]
                );
                return recovery.rowCount > 0 ? new RecoveryPassModel(recovery.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}