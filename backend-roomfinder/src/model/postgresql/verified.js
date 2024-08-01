import { Database } from "./database.js";

export class VerifiedModel {

    constructor({ verificacionid, usuarioid, vchtoken, created_at, expires_at }) {
        this.verificacionid = verificacionid;
        this.usuarioid = usuarioid;
        this.vchtoken = vchtoken;
        this.created_at = created_at;
        this.expires_at = expires_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verified = await client.query(
                `SELECT * FROM "Usuario"."Verificacion";`
            );
            return verified.rows.map((verify) => new VerifiedModel(verify));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verify = await client.query(
                `SELECT * FROM "Usuario"."Verificacion" WHERE verificacionid = $1;`,
                [id]
            );
            return verify.rowCount > 0 ? new VerifiedModel(verify.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByToken({ token }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verify = await client.query(
                `SELECT * FROM "Usuario"."Verificacion" WHERE vchtoken = $1;`,
                [token]
            );
            return verify.rowCount > 0 ? new VerifiedModel(verify.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByUserId({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verify = await client.query(
                `SELECT * FROM "Usuario"."Verificacion" WHERE usuarioid = $1;`,
                [id]
            );
            return verify.rowCount > 0 ? new VerifiedModel(verify.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async verify({ usuarioid, vchtoken }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verify = await client.query(
                `SELECT * FROM "Usuario"."Verificacion" WHERE usuarioid = $1 AND vchtoken = $2 AND expires_at > NOW();`,
                [usuarioid, vchtoken]
            );
            return verify.rowCount > 0 ? new VerifiedModel(verify.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async save({ verify }) {
        const { usuarioid, vchtoken } = verify;
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verifySaved = await client.query(
                `INSERT INTO "Usuario"."Verificacion" (usuarioid, vchtoken, expires_at) VALUES ($1, $2, NOW() + INTERVAL '24 HOURS') RETURNING *;`,
                [usuarioid, vchtoken]
            );
            return new VerifiedModel(verifySaved.rows[0]);
        } finally {
            client.release();
        }
    }

    static async update({ verify }) {
        const { verificacionid, vchtoken } = verify;
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verifyUpdated = await client.query(
                `UPDATE "Usuario"."Verificacion" SET vchtoken = $1, expires_at = NOW() + INTERVAL '24 HOURS' WHERE verificacionid = $2 RETURNING *;`,
                [vchtoken, verificacionid]
            );
            return new VerifiedModel(verifyUpdated.rows[0]);
        } finally {
            client.release();
        }
    }

    static async delete({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const verify = await client.query(
                `DELETE FROM "Usuario"."Verificacion" WHERE verificacionid = $1 RETURNING *;`,
                [id]
            );
            return verify.rowCount > 0 ? new VerifiedModel(verify.rows[0]) : null;
        } finally {
            client.release();
        }
    }
}