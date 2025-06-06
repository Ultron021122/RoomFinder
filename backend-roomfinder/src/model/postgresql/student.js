import { Database } from './database.js';
import { UsersModel } from './user.js'

export class StudentsModel extends UsersModel {

    constructor({
        usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus,
        bnverified, vchimage, vchcoverimage, roleid, created_at, vchbiography, intcodestudent, vchuniversity, vchmajor, usuario2id = null, messageid = null, chatid = null, vchcontenido = null, dtmessage = null,
        usuarioid2 = null, vchname2 = null, vchpaternalsurname2 = null, vchmaternalsurname2 = null, vchemail2 = null, vchpassword2 = null, dtbirthdate2 = null,
        bnstatus2 = null, bnverified2 = null, vchimage2 = null, vchcoverimage2 = null, roleid2 = null, created_at2 = null, vchphone2 = null, vchstreet2 = null, intzip2 = null, vchsuburb2 = null, vchmunicipality2 = null, vchstate2 = null
    }) {
        super({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, vchcoverimage, roleid, created_at, vchbiography });
        this.intcodestudent = intcodestudent;
        this.vchuniversity = vchuniversity;
        this.vchmajor = vchmajor;
        this.usuario2id = usuario2id;
        this.messageid = messageid;
        this.chatid = chatid;
        this.vchcontenido = vchcontenido;
        this.dtmessage = dtmessage;
        this.usuarioid2 = usuarioid2;
        this.vchname2 = vchname2;
        this.vchpaternalsurname2 = vchpaternalsurname2;
        this.vchmaternalsurname2 = vchmaternalsurname2;
        this.vchemail2 = vchemail2;
        this.vchpassword2 = vchpassword2;
        this.dtbirthdate2 = dtbirthdate2;
        this.bnstatus2 = bnstatus2;
        this.bnverified2 = bnverified2;
        this.vchimage2 = vchimage2;
        this.vchcoverimage2 = vchcoverimage2;
        this.roleid2 = roleid2;
        this.created_at2 = created_at2;
        this.vchphone2 = vchphone2;
        this.vchstreet2 = vchstreet2;
        this.intzip2 = intzip2;
        this.vchsuburb2 = vchsuburb2;
        this.vchmunicipality2 = vchmunicipality2;
        this.vchstate2 = vchstate2;
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

    static async getByChat({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const students = await client.query(
                `   WITH chat_estudiantes AS (
                        -- Subconsulta para obtener los estudiantes con los que ya tienes un chat
                        SELECT DISTINCT
                            CASE 
                                WHEN ct.usuario1id = $1 THEN ct.usuario2id 
                                ELSE ct.usuario1id 
                            END AS usuarioid2
                        FROM "Usuario"."Chats" ct
                        WHERE ct.usuario1id = $1 OR ct.usuario2id = $1
                    )
                    SELECT 
                        us.usuarioid, 
                        us.vchname, 
                        us.vchpaternalsurname, 
                        us.vchmaternalsurname, 
                        us.vchemail, 
                        us.vchpassword, 
                        us.dtbirthdate, 
                        us.bnstatus, 
                        us.bnverified, 
                        us.vchimage, 
                        us.roleid, 
                        us.created_at, 
                        us.vchcoverimage,
                        a.intcodestudent,
                        a.vchuniversity,
                        CASE 
                            WHEN us.usuarioid = ct.usuario1id THEN ct.usuario2id 
                            ELSE ct.usuario1id 
                        END AS usuario2id,
                        m.messageid, 
                        m.chatid, 
                        m.vchcontenido, 
                        m.created_at AS dtmessage,
                        u.usuarioid AS usuarioid2,
                        u.vchname AS vchname2, 
                        u.vchpaternalsurname AS vchpaternalsurname2, 
                        u.vchmaternalsurname AS vchmaternalsurname2, 
                        u.vchemail AS vchemail2, 
                        u.vchpassword AS vchpassword2, 
                        u.dtbirthdate AS dtbirthdate2, 
                        u.bnstatus AS bnstatus2, 
                        u.bnverified AS bnverified2, 
                        u.vchimage AS vchimage2, 
                        u.roleid AS roleid2, 
                        u.created_at AS created_at2, 
                        u.vchcoverimage AS vchcoverimage2,
                        es.vchphone AS vchphone2, 
                        es.vchstreet AS vchstreet2, 
                        es.intzip AS intzip2, 
                        es.vchsuburb AS vchsuburb2, 
                        es.vchmunicipality AS vchmunicipality2, 
                        es.vchstate AS vchstate2
                    FROM "Usuario"."Usuario" us
                    INNER JOIN "Usuario"."Estudiantes" a
                        ON us.usuarioid = a.usuarioid
                    LEFT JOIN (
                        SELECT DISTINCT ON (usuario1id, usuario2id) chatid, usuario1id, usuario2id
                        FROM "Usuario"."Chats"
                        WHERE usuario1id = $1 OR usuario2id = $1
                        ORDER BY usuario1id, usuario2id, created_at DESC
                    ) ct
                        ON (ct.usuario1id = us.usuarioid OR ct.usuario2id = us.usuarioid)
                    LEFT JOIN (
                        SELECT chatid, MAX(created_at) AS ultima_fecha
                        FROM "Usuario"."Mensajes"
                        GROUP BY chatid
                    ) ult_msj 
                        ON ct.chatid = ult_msj.chatid
                    LEFT JOIN "Usuario"."Mensajes" m
                        ON m.chatid = ult_msj.chatid AND m.created_at = ult_msj.ultima_fecha
                    LEFT JOIN "Usuario"."Usuario" u
                        ON u.usuarioid = CASE 
                                            WHEN us.usuarioid = ct.usuario1id THEN ct.usuario2id 
                                            ELSE ct.usuario1id 
                                        END
                    LEFT JOIN "Usuario"."Arrendadores" es
                        ON es.usuarioid = CASE 
                                            WHEN us.usuarioid = ct.usuario1id THEN ct.usuario2id 
                                            ELSE ct.usuario1id 
                                        END
                    WHERE (ct.usuario1id = $1 OR ct.usuario2id = $1 OR ct.chatid IS NULL) AND us.usuarioid = $1 AND usuario2id IS NOT NULL

                    UNION ALL

                    -- Subconsulta para obtener los estudiantes con los que no tienes un chat
                    SELECT 
                        us.usuarioid, 
                        us.vchname, 
                        us.vchpaternalsurname, 
                        us.vchmaternalsurname, 
                        us.vchemail, 
                        us.vchpassword, 
                        us.dtbirthdate, 
                        us.bnstatus, 
                        us.bnverified, 
                        us.vchimage, 
                        us.roleid, 
                        us.created_at, 
                        us.vchcoverimage, 
                        a.intcodestudent,
                        a.vchuniversity,
                        u.usuarioid AS usuario2id, 
                        NULL AS messageid, 
                        NULL AS chatid, 
                        NULL AS vchcontenido, 
                        NULL AS dtmessage,
                        u.usuarioid AS usuarioid2,
                        u.vchname AS vchname2, 
                        u.vchpaternalsurname AS vchpaternalsurname2, 
                        u.vchmaternalsurname AS vchmaternalsurname2, 
                        u.vchemail AS vchemail2, 
                        u.vchpassword AS vchpassword2, 
                        u.dtbirthdate AS dtbirthdate2, 
                        u.bnstatus AS bnstatus2, 
                        u.bnverified AS bnverified2, 
                        u.vchimage AS vchimage2, 
                        u.roleid AS roleid2, 
                        u.created_at AS created_at2, 
                        u.vchcoverimage AS vchcoverimage2,
                        es.vchphone AS vchphone2, 
                        es.vchstreet AS vchstreet2, 
                        es.intzip AS intzip2, 
                        es.vchsuburb AS vchsuburb2, 
                        es.vchmunicipality AS vchmunicipality2, 
                        es.vchstate AS vchstate2
                    FROM "Usuario"."Arrendadores" es
                    INNER JOIN "Usuario"."Usuario" u
                        ON es.usuarioid = u.usuarioid
                    INNER JOIN "Usuario"."Usuario" us
                        ON us.roleid = 1
                    INNER JOIN "Usuario"."Estudiantes" a
                        ON us.usuarioid = a.usuarioid
                    WHERE u.roleid = 2 AND us.usuarioid = $1
                    AND es.usuarioid NOT IN (
                        SELECT CASE 
                            WHEN ct.usuario1id = $1 THEN ct.usuario2id 
                            ELSE ct.usuario1id 
                        END
                        FROM "Usuario"."Chats" ct
                        WHERE ct.usuario1id = $1 OR ct.usuario2id = $1
                    );
                `,
                [id]
            );
            return students.rows.map((student) => new StudentsModel(student));
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, vchcoverimage, roleid, intcodestudent, vchuniversity } = input
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

                return new StudentsModel({ usuarioid, vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, dtbirthdate, bnstatus, bnverified, vchimage, vchcoverimage, roleid, created_at, intcodestudent, vchuniversity })
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
            const studentFields = [
                'intcodestudent',
                'vchuniversity',
                'vchmajor'
            ];

            const studentData = this.createDataObject(input, studentFields);

            const user = await UsersModel.update({ id, input })
            if (user === false) return false;
            if (!user) return null;

            const updateColumns = Object.entries({
                ...studentData
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(studentData).indexOf(key) + 1}`; // Increment position by 1
                })
                .join(', ');

            const updateValues = Object.values({
                ...studentData
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
            throw new Error(`Error update student: ${error.message}`)
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