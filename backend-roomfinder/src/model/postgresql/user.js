import { Database } from "./database.js"
import bcrypt from 'bcrypt'

export class UsersModel extends Database {

    constructor({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid, created_at }) {
        super();
        this.usuarioid = usuarioid;
        this.vchname = vchname;
        this.vchpaternalsurname = vchpaternalsurname;
        this.vchmaternalsurname = vchmaternalsurname;
        this.vchemail = vchemail;
        this.vchpassword = vchpassword;
        this.dtbirthdate = dtbirthdate;
        this.bnstatus = bnstatus;
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

    static async login({ input }) {
        try {
            const { email, password } = input
            const user = await this.getByEmail({ email });
            if (!user) return false;

            const validPassword = await bcrypt.compare(password, user.vchpassword)
            if (!validPassword) return false;

            return user;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid } = input
            const validate = await this.getByEmail({ vchemail });
            if (validate) return false;

            const result = await this.query(
                'INSERT INTO users (vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;',
                [vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid,]
            )

            const id = result[0].id;
            const newUser = await this.getById({ id })

            return newUser;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`)
        }
    }

    static async verifyEmail({ token }) {
        try {
            const validate = { token };
        } catch (error) {
            throw new Error(`Error checking email: ${error.message}`)
        }
    }

    static async updateVerified({ id }) {
        try {
            const validate = { id };
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`)
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
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, vchimage, roleid } = input
            const validate = vchemail ? await this.getByEmail({ vchemail }) : null;
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
}