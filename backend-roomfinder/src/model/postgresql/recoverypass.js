import { Database } from "./database.js";

export class RecoveryPassModel extends Database {
    constructor({ recuperacionid, usuarioid, vchtoken, created_at, expires_at }) {
        super();
        this.recuperacionid = recuperacionid;
        this.usuarioid = usuarioid;
        this.vchtoken = vchtoken;
        this.created_at = created_at;
        this.expires_at = expires_at;
    }

    static async getAll() {
        const recovery = await this.query(
            `SELECT * FROM "Usuario"."RecuperacionCuenta";`
        );
        return recovery.map((recovery) => new RecoveryPassModel(recovery));
    }

    static async getById({ id }) {
        const recovery = await this.query(
            `SELECT * FROM "Usuario"."RecuperacionCuenta" WHERE recuperacionid = $1;`,
            [id]
        );
        return recovery[0] ? new RecoveryPassModel(recovery[0]) : null;
    }

    static async getByToken({ token }) {
        const recovery = await this.query(
            `SELECT * FROM "Usuario"."RecuperacionCuenta" WHERE vchtoken = $1;`,
            [token]
        );
        return recovery[0] ? new RecoveryPassModel(recovery[0]) : null;
    }

    static async getByUser({ id }) {
        const recovery = await this.query(
            `SELECT * FROM "Usuario"."RecuperacionCuenta" WHERE usuarioid = $1;`,
            [id]
        );
        return recovery.map((recovery) => new RecoveryPassModel(recovery));
    }

    static async create({ usuarioid, vchtoken, created_at }) {
        try {
            const recovery = await this.query(
                `INSERT INTO "Usuario"."RecuperacionCuenta" (usuarioid, vchtoken, created_at, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '24 HOURS') RETURNING *;`,
                [usuarioid, vchtoken, created_at]
            );
            return recovery[0] ? new RecoveryPassModel(recovery[0]) : null;
        } catch(error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async update({ id, vchtoken, expires_at }) {
        try {
            const recovery = await this.query(
                `UPDATE "Usuario"."RecuperacionCuenta" SET vchtoken = $1, expires_at = $2 WHERE recuperacionid = $3 RETURNING *;`,
                [vchtoken, expires_at, id]
            );
            return recovery[0] ? new RecoveryPassModel(recovery[0]) : null;
        } catch(error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async delete({ id }) {
        try {
            const recovery = await this.query(
                `DELETE FROM "Usuario"."RecuperacionCuenta" WHERE recuperacionid = $1 RETURNING *;`,
                [id]
            );
            return recovery[0] ? new RecoveryPassModel(recovery[0]) : null;
        } catch(error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}