import { Database } from "./database";

export class VerifiedModel extends Database {
    
    constructor({ verificacionid, usuarioid, vchtoken, created_at, expires_at }) {
        super();
        this.verificacionid = verificacionid;
        this.usuarioid = usuarioid;
        this.vchtoken = vchtoken;
        this.created_at = created_at;
        this.expires_at = expires_at;
    }

    static async getAll() {
        const verified = await this.query(
            `SELECT * FROM "Usuario"."Verificacion";`
        );
        return verified.map((verify) => new VerifiedModel(verify));
    }

    static async getById({ id }) {
        const verify = await this.query(
            `SELECT * FROM "Usuario"."Verificacion" WHERE verificacionid = $1;`,
            [id]
        );
        return verify[0] ? new VerifiedModel(verify[0]) : null;
    }

    static async getByToken({ token }) {
        const verify = await this.query(
            `SELECT * FROM "Usuario"."Verificacion" WHERE vchtoken = $1;`,
            [token]
        );
        return verify[0] ? new VerifiedModel(verify[0]) : null;
    }

    static async getByUserId({ id }) {
        const verify = await this.query(
            `SELECT * FROM "Usuario"."Verificacion" WHERE usuarioid = $1;`,
            [id]
        );
        return verify[0] ? new VerifiedModel(verify[0]) : null;
    }

    static async save({ verify }) {
        const { usuarioid, vchtoken } = verify;
        const verifySaved = await this.query(
            `INSERT INTO "Usuario"."Verificacion" (usuarioid, vchtoken, expires_at) VALUES ($1, $2, NOW() + INTERVAL '24 HOURS') RETURNING *;`,
            [usuarioid, vchtoken]
        );
        return new VerifiedModel(verifySaved[0]);
    }

    static async update({ verify }) {
        const { verificacionid, vchtoken } = verify;
        const verifyUpdated = await this.query(
            `UPDATE "Usuario"."Verificacion" SET vchtoken = $1, expires_at = NOW() + INTERVAL '24 HOURS' WHERE verificacionid = $2 RETURNING *;`,
            [vchtoken, verificacionid]
        );
        return new VerifiedModel(verifyUpdated[0]);
    }

    static async delete({ id }) {
        const verify = await this.query(
            `DELETE FROM "Usuario"."Verificacion" WHERE usuarioid = $1 RETURNING *;`,
            [id]
        );
        return verify[0] ? new VerifiedModel(verify[0]) : null;
    }
}