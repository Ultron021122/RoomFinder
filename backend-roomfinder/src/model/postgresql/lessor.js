import { Database } from './database.js';
import { UsersModel } from './user.js'

export class LessorsModel extends UsersModel {

    constructor({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate }) {
        super({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at });
        this.vchphone = vchphone;
        this.vchstreet = vchstreet;
        this.intzip = intzip;
        this.vchsuburb = vchsuburb;
        this.vchmunicipality = vchmunicipality;
        this.vchstate = vchstate;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const lessors = await client.query(
                `SELECT * FROM "Usuario"."Usuario" us LEFT JOIN "Usuario"."Arrendadores" lessor ON us.usuarioid = lessor.usuarioid WHERE us.roleid = 2;`
            )
            return lessors.rows.map((lessor) => new LessorsModel(lessor));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const lessor = await client.query(
                `SELECT * FROM "Usuario"."Usuario" us LEFT JOIN "Usuario"."Arrendadores" lessor ON us.usuarioid = lessor.usuarioid WHERE us.roleid = 2 AND us.usuarioid = $1;`,
                [id]
            );
            return lessor.rowCount > 0 ? new LessorsModel(lessor.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate } = input
            const result = await UsersModel.create({ input })
            if (result === false) return false;
            const usuarioid = result.usuarioid
            const created_at = result.created_at

            // Connection with database
            const db = new Database();
            const client = await db.pool.connect();
            try {
                await client.query(
                    `INSERT INTO "Usuario"."Arrendadores" (usuarioid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                    [usuarioid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate]
                )

                return new LessorsModel({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate })
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error creating lessor: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const lessor = await UsersModel.delete({ id });
            return lessor;
        } catch (error) {
            throw new Error(`Error deleting lessor: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate } = input
            const user = await UsersModel.update({ id, input })
            if (user === false) return false;
            if (!user) return null;

            const updateColumns = Object.entries({
                vchphone,
                vchstreet,
                intzip,
                vchsuburb,
                vchmunicipality,
                vchstate
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(input).indexOf(key) + 1}`;
                })
                .join(', ');

            const updateValues = Object.values({
                vchphone,
                vchstreet,
                intzip,
                vchsuburb,
                vchmunicipality,
                vchstate
            })
                .filter(value => value != undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Arrendadores" SET ${updateColumns} WHERE usuarioid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating lessor: ${error.message}`);
        }
    }
}