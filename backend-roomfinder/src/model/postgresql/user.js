import { Database } from "./database.js"
import { VerifiedModel } from "./verified.js";
import { RecoveryPassModel } from "./recoverypass.js";
import bcrypt from 'bcrypt'

export class UsersModel {

    constructor({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, vchcoverimage, roleid, created_at, vchbiography }) {
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
        this.vchcoverimage = vchcoverimage;
        this.roleid = roleid;
        this.created_at = created_at;
        this.vchbiography = vchbiography;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const users = await client.query(
                `SELECT * FROM "Usuario"."Usuario";`
            );
            return users.rows.map((user) => new UsersModel(user));
        } finally {
            client.release();
        }
    }

    static async getByUser({ roleid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const users = await client.query(
                `SELECT * FROM "Usuario"."Usuario" WHERE roleid = $1;`,
                [roleid]
            );
            return users.rows.map((user) => new UsersModel(user));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const user = await client.query(
                `SELECT * FROM "Usuario"."Usuario" WHERE usuarioid = $1;`,
                [id]
            );
            return user.rowCount > 0 ? new UsersModel(user.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByEmail({ email }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const user = await client.query(
                `SELECT * FROM "Usuario"."Usuario" WHERE vchemail = $1;`,
                [email]
            );
            return user.rowCount > 0 ? new UsersModel(user.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getImages({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const user = await client.query(
                `SELECT vchImage, vchCoverImage FROM "Usuario"."Usuario" WHERE usuarioid = $1;`,
                [id]
            );
            return user.rowCount > 0 ? new UsersModel(user.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid } = input
            const validate = await this.getByEmail({ email: vchemail });
            if (validate) return false;
            
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `INSERT INTO "Usuario"."Usuario" (vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
                    [vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid]
                );

                return new UsersModel(result.rows[0]);
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            const db = new Database();
            const client = await db.pool.connect();
            try { // Eliminar usuario
                await client.query(
                    `DELETE FROM "Usuario"."Usuario" WHERE usuarioid = $1;`,
                    [id]
                );
                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            // const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, vchcoverimage, roleid, vchbiography } = input
            const user = await this.getById({ id })
            if (!user) return null;

            const userFields = [
                'vchname',
                'vchpaternalsurname',
                'vchmaternalsurname',
                'vchemail',
                'vchpassword',
                'dtbirthdate',
                'bnstatus',
                'bnverified',
                'vchimage',
                'vchcoverimage',
                'roleid',
                'vchbiography'
            ];

            const userData = this.createDataObject(input, userFields);

            const updateColumns = Object.entries({
                ...userData
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(userData).indexOf(key) + 1}`; // Increment position by 1
                })
                .join(', ');

            const updateValues = Object.values({
                ...userData
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Usuario" SET ${updateColumns} WHERE usuarioid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    static async login({ input }) {
        try {
            const { vchemail, vchpassword } = input

            // Error Messages
            // 0 - The user does not exist
            // 1 - User not verified
            // 2 - Invalid credentials

            const user = await this.getByEmail({ email: vchemail });
            if (!user) return 0;
            if (!user.bnverified) return 1; // Check if user is verified
            const validPassword = await bcrypt.compare(vchpassword, user.vchpassword)
            if (!validPassword) return 2;
            
            const session = await this.session({ id: user.usuarioid })

            return {...user, sessionid: session };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async session({ id }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const session = await client.query(
                    `INSERT INTO "Usuario"."Sessions" (usuarioid) VALUES ($1) RETURNING sessionid;`,
                    [id]
                )
                const sessionid = session.rows[0].sessionid;
                return sessionid;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async logout({ sessionid }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const session = await client.query(
                    `UPDATE "Usuario"."Sessions" SET tmlastactivity = NOW() WHERE sessionid = $1 AND tmlastactivity IS NULL RETURNING *;`,
                    [sessionid]
                )

                return session.rows[0] ? true : false;
            } finally {
                client.release();
            }
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
            const { usuarioid } = recover;
            const result = await RecoveryPassModel.create({ input: { usuarioid } });
            return result;
        } catch (error) {
            throw new Error(`Error recovering password: ${error.message}`)
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