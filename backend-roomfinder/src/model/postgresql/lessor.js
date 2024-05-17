import { UsersModel } from './user.js'

export class LessorsModel extends UsersModel {

    constructor({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid, created_at, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate }) {
        super({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid, created_at });
        this.vchphone = vchphone;
        this.vchstreet = vchstreet;
        this.intzip = intzip;
        this.vchsuburb = vchsuburb;
        this.vchmunicipality = vchmunicipality;
        this.vchstate = vchstate;
    }

    static async getAll() {
        const lessors = await this.query(
            `SELECT * FROM "Usuario"."Usuario" user LEFT JOIN "Usuario"."Arrendadores" lessor ON user.usuarioid = lessor.usuarioid WHERE user.roleid = 2;`
        )
        return lessors.map((lessor) => new LessorsModel(lessor));
    }

    static async getById({ id }) {
        const lessor = await this.query(
            `SELECT * FROM "Usuario"."Usuario" user LEFT JOIN "Usuario"."Arrendadores" lessor ON user.usuarioid = lessor.usuarioid WHERE user.roleid = 2 AND user.usuarioid = $1;`,
            [id]
        );
        return lessor[0] ? new LessorsModel(lessor[0]) : null;
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate } = input
            const result = await UsersModel.create({ input })
            if (result === false) return false;
            const usuarioid = result.usuarioid
            const created_at = result.created_at

            const lessor = await this.query(
                `INSERT INTO "Usuario"."Arrendadores" (usuarioid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                [usuarioid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate]
            )

            return new LessorsModel({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid, created_at, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate })
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
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate } = input
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
                await this.query(
                    `UPDATE "Usuario"."Arrendadores" SET ${updateColumns} WHERE usuarioid = $${updateValues.length + 1};`,
                    [...updateValues, id]
                );
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating lessor: ${error.message}`);
        }
    }
}