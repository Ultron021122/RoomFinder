import { Database } from "./database.js"
import { VerifiedModel } from "./verified.js";
import { RecoveryPassModel } from "./recoverypass.js";
import bcrypt from 'bcrypt'

export class UsersModel extends Database {

    constructor({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at }) {
        super();
        this.usuarioid = usuarioid;
        this.vchname = vchname;
        this.vchpaternalsurname = vchpaternalsurname;
        this.vchmaternalsurname = vchmaternalsurname;
        this.vchemail = vchemail;
        this.vchpassword = vchpassword;
        this.dtbirthdate = dtbirthdate;
        this.bnstatus = bnstatus;
        this.bnverified = bnverified;
        this.vchimage = vchimage;
        this.roleid = roleid;
        this.created_at = created_at;
    }

    static async getAll() {
        const users = await this.query(
            `SELECT * FROM "Usuario"."Usuario";`
        );
        return users.map((user) => new UsersModel(user));
    }

    static async getByUser({ roleid }) {
        console.log(roleid)
        const users = await this.query(
            `SELECT * FROM "Usuario"."Usuario" WHERE roleid = $1;`,
            [roleid]
        );
        return users.map((user) => new UsersModel(user));
    }

    static async getById({ id }) {
        const user = await this.query(
            `SELECT * FROM "Usuario"."Usuario" WHERE usuarioid = $1;`,
            [id]
        );
        return user[0] ? new UsersModel(user[0]) : null;
    }

    static async getByEmail({ email }) {
        const user = await this.query(
            `SELECT * FROM "Usuario"."Usuario" WHERE vchemail = $1;`,
            [email]
        );
        return user[0] ? new UsersModel(user[0]) : null;
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid } = input
            const validate = await this.getByEmail({ email: vchemail });
            if (validate) return false;

            const result = await this.query(
                `INSERT INTO "Usuario"."Usuario" (vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
                [vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid]
            );

            return new UsersModel(result[0]);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            // Eliminar usuario
            await this.query(
                `DELETE FROM "Usuario"."Usuario" WHERE usuarioid = $1;`,
                [id]
            );
            return true;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid } = input
            const validate = vchemail ? await this.getByEmail({ email: vchemail }) : null;
            if (validate) return false;
            const user = await this.getById({ id })
            if (!user) return null;

            const updateColumns = Object.entries({
                vchname,
                vchpaternalsurname,
                vchmaternalsurname,
                vchemail,
                vchpassword,
                dtbirthdate,
                bnstatus,
                bnverified,
                vchimage,
                roleid
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(input).indexOf(key) + 1}`; // Increment position by 1
                })
                .join(', ');

            const updateValues = Object.values({
                vchname,
                vchpaternalsurname,
                vchmaternalsurname,
                vchemail,
                vchpassword,
                dtbirthdate,
                bnstatus,
                bnverified,
                vchimage,
                roleid
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                await this.query(
                    `UPDATE "Usuario"."Usuario" SET ${updateColumns} WHERE usuarioid = $${updateValues.length + 1};`,
                    [...updateValues, id]
                );
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    static async login({ input }) {
        try {
            const { vchemail, vchpassword } = input

            const user = await this.getByEmail({ email: vchemail });
            if (!user) return false;
            if (!user.bnverified) return false; // Check if user is verified
            const validPassword = await bcrypt.compare(vchpassword, user.vchpassword)
            if (!validPassword) return false;

            const session = await this.session({ id: user.usuarioid })

            return { ...user, sessionid: session };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async session({ id }) {
        try {
            const session = await this.query(
                `INSERT INTO "Usuario"."Sessions" (usuarioid) VALUES ($1) RETURNING sessionid;`,
                [id]
            )
            const sessionid = session[0].sessionid;
            return sessionid;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async logout({ sessionid }) {
        try {
            const session = await this.query(
                `UPDATE "Usuario"."Sessions" SET tmlastactivity = NOW() WHERE sessionid = $1 AND tmlastactivity IS NULL RETURNING *;`,
                [sessionid]
            )

            return session[0] ? true : false;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async saveToken({ verify }) {
        try {
            const { usuarioid, vchtoken } = verify;
            const verifySaved = await VerifiedModel.save({ verify: { usuarioid, vchtoken } });
            return verifySaved;
        } catch (error) {
            throw new Error(`Error checking email: ${error.message}`)
        }
    }

    static async resaveToken({ verify }) {
        try {
            const { usuarioid, vchtoken } = verify;
            const verifyUpdated = await VerifiedModel.update({ verify: { usuarioid, vchtoken } });
            return verifyUpdated;
        } catch (error) {
            throw new Error(`Error resaving token: ${error.message}`)
        }
    }

    static async verifyToken({ verify }) {
        try {
            const { usuarioid, vchtoken } = verify;
            const user = await this.getById({ id: usuarioid }); // Validate user
            if (!user) return false;

            const verificar = await VerifiedModel.verify({ usuarioid, vchtoken }); // Validate token
            if (!verificar) return null;

            await VerifiedModel.delete({ id: verificar.verificacionid }); // Delete token from database
            return verificar;
        } catch (error) {
            throw new Error(`Error verifying token: ${error.message}`)
        }
    }

    static async recoveryPassword({ recover }) {
        try {
            const { usuarioid, vchtoken } = recover;
            const result = await RecoveryPassModel.create({ input: { usuarioid, vchtoken } });
            return result;
        } catch (error) {
            throw new Error(`Error recovering password: ${error.message}`)
        }
    }
}