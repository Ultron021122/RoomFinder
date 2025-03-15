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
            const requests = await client.connect.query(
                `SELECT * FROM "Usuario"."LeaseRequests" WHERE propertyid = $1;`,
                [propertyid]
            );

            return requests.rowCount > 0 ? new RequestModel(requests.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        const { propertyid, studentid, statusid, dtrequest, vchmessage, intnumguests, bnhaspets, dtstartdate, dtenddate } = input

        const db = new Database();
        const client = await db.pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO "Usuario"."LeaseRequests" (propertyid, studentid, decrating, vchcomment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
                [propertyid, studentid, statusid, dtrequest, vchmessage, intnumguests, bnhaspets, dtstartdate, dtenddate]
            );

            return new RequestModel(result.rows[0]);
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
        } catch(error) {
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