import { Database } from './database.js';
import { UsersModel } from './user.js'

export class StudentsModel extends UsersModel {

    constructor({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at, intcodestudent, vchuniversity }) {
        super({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at });
        this.intcodestudent = intcodestudent;
        this.vchuniversity = vchuniversity;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const students = await client.query(
                `SELECT * FROM "Usuario"."Usuario" us LEFT JOIN "Usuario"."Estudiantes" student ON us.usuarioid = student.usuarioid WHERE us.roleid = 1;`
            )
            return students.rows.map((student) => new StudentsModel(student));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const student = await client.query(
                `SELECT * FROM "Usuario"."Usuario" us LEFT JOIN "Usuario"."Estudiantes" student ON us.usuarioid = student.usuarioid WHERE us.roleid = 1 AND us.usuarioid = $1;`,
                [id]
            );
            return student.rowCount > 0 ? new StudentsModel(student.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, intcodestudent, vchuniversity } = input
            const result = await UsersModel.create({ input })
            if (result === false) return false;
            const usuarioid = result.usuarioid
            const created_at = result.created_at
            // Connection with database
            const db = new Database();
            const client = await db.pool.connect();
            try {
                await client.query(
                    `INSERT INTO "Usuario"."Estudiantes" (intcodestudent, usuarioid, vchuniversity) VALUES($1, $2, $3);`,
                    [intcodestudent, usuarioid, vchuniversity]
                )

                return new StudentsModel({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, created_at, intcodestudent, vchuniversity })
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error creating student: ${error.message}`);
        }
    }

    static async delete({ id }) {
        try {
            const student = await UsersModel.delete({ id });
            return student;
        } catch (error) {
            throw new Error(`Error deleting student: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, roleid, intcodestudent, vchuniversity } = input
            const user = await UsersModel.update({ id, input })
            if (user === false) return false;
            if (!user) return null;

            const updateColumns = Object.entries({
                intcodestudent,
                vchuniversity
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(input).indexOf(key) + 1}`; // Increment position by 1
                })
                .join(', ');

            const updateValues = Object.values({
                intcodestudent,
                vchuniversity
            })
                .filter(value => value != undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Estudiantes" SET ${updateColumns} WHERE usuarioid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error deleting student: ${error.message}`)
        }
    }
}