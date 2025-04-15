import { Database } from "./database.js"

export class RequestModel {
    constructor({ requestid, propertyid, studentid, statusid, dtrequest, vchmessage, intnumguests, bnhaspets, dtstartdate, dtenddate, created_at, updated_at }) {
        this.requestid = requestid;
        this.propertyid = propertyid;
        this.studentid = studentid;
        this.statusid = statusid;
        this.dtrequest = dtrequest;
        this.vchmessage = vchmessage;
        this.intnumguests = intnumguests;
        this.bnhaspets = bnhaspets;
        this.dtstartdate = dtstartdate;
        this.dtenddate = dtenddate;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect()

        try {
            const requests = await client.query(
                `SELECT * FROM "Usuario"."LeaseRequests";`
            );

            return requests.rows.map((request) => new RequestModel(request));
        } finally {
            client.release();
        }
    }

    static async getByOwner({ studentid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const requests = await client.query(
                `SELECT * FROM "Usuario"."LeaseRequests" WHERE studentid = $1;`,
                [studentid]
            );

            return requests.rows.map((request) => new RequestModel(request));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const request = await client.query(
                `SELECT * FROM "Usuario"."LeaseRequests" WHERE requestid = $1;`,
                [id]
            );

            return request.rowCount > 0 ? new RequestModel(request.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByProperty({ propertyid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const requests = await client.query(
                `SELECT * FROM "Usuario"."LeaseRequests" WHERE propertyid = $1;`,
                [propertyid]
            );

            return requests.rowCount > 0 ? new RequestModel(requests.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByLeasor({ leasorid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const requests = await client.query(
                `SELECT ls.* FROM "Usuario"."LeaseRequests" ls
                    inner join "Usuario"."Propiedades" p
                        on ls.propertyid = p.propertyid
                    inner join "Usuario"."Arrendadores" a
                        on a.usuarioid = p.lessorid
                    where a.usuarioid = $1;`,
                [leasorid]
            );
            return requests.rowCount > 0 ? requests.rows.map(request => new RequestModel(request)) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        const { propertyid, studentid, statusid, vchmessage, intnumguests, bnhaspets, dtstartdate, dtenddate } = input

        const db = new Database();
        const client = await db.pool.connect();
        try {
            await client.query(
                `INSERT INTO "Usuario"."LeaseRequests" (propertyid, studentid, statusid, vchmessage, intnumguests, bnhaspets, dtstartdate, dtenddate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
                [propertyid, studentid, statusid, vchmessage, intnumguests, bnhaspets, dtstartdate, dtenddate]
            );

            const infoemail = await client.query(
                `
                SELECT l.*,
                    p.*
                FROM "Usuario"."vwLessorGET" l
                INNER JOIN "Usuario"."Propiedades" p
                    on p.lessorid = l.usuarioid
                WHERE P.propertyid = $1;
                `, [propertyid]
            );

            return infoemail.rows[0];
        } finally {
            client.release();
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            const db = new Database();
            const client = await db.pool.connect();
            try {
                await client.query(
                    `DELETE FROM "Usuario"."LeaseRequests" WHERE requestid = $1;`,
                    [id]
                );

                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting request: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const review = await this.getById({ id })
            if (!review) return null;

            const requestFields = [
                'propertyid',
                'studentid',
                'statusid',
                'dtrequest',
                'vchmessage',
                'intnumguests',
                'bnhaspets',
                'dtstartdate',
                'dtenddate'
            ];

            const requestData = this.createDataObject(input, requestFields);

            const updateColumns = Object.entries({
                ...requestData
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(requestData).indexOf(key) + 1}`;
                })
                .join(', ');

            const updateValues = Object.values({
                ...requestData
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."LeaseRequests" SET ${updateColumns}, updated_at = CURRENT_TIMESTAMP  WHERE requestid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating request: ${error.message}`);
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