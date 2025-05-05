import { Database } from "./database.js";
import { v4 as uuidv4 } from 'uuid'

export class LeasesModel {
    constructor({ leasesid, propertyid, studentid, dtstartdate, dtenddate, decmonthlycost, created_at, leasestatusid, lease_number, requestid, vchdescription, vchtitle, propertytypeid, vchtypename, vchstatusname, vchstudentname, vchstudentpaternalsurname, vchstudentmaternalsurname, lessorid, vchlessorname, vchlessorpaternalsurname, vchlessormaternalsurname }) {
        this.leasesid = leasesid;
        this.propertyid = propertyid;
        this.studentid = studentid;
        this.dtstartdate = dtstartdate;
        this.dtenddate = dtenddate;
        this.decmonthlycost = decmonthlycost;
        this.created_at = created_at;
        this.leasestatusid = leasestatusid;
        this.lease_number = lease_number;
        this.requestid = requestid;
        this.vchtitle = vchtitle;
        this.vchdescription = vchdescription;
        this.propertytypeid = propertytypeid;
        this.vchtypename = vchtypename;
        this.vchstatusname = vchstatusname;
        this.vchstudentname = vchstudentname;
        this.vchstudentpaternalsurname = vchstudentpaternalsurname;
        this.vchstudentmaternalsurname = vchstudentmaternalsurname;
        this.lessorid = lessorid;
        this.vchlessorname = vchlessorname;
        this.vchlessorpaternalsurname = vchlessorpaternalsurname;
        this.vchlessormaternalsurname = vchlessormaternalsurname;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const leases = await client.query(
                `SELECT * FROM "Usuario"."vwLeasesGET";`
            );
            return leases.rows.map((lease) => new LeasesModel(lease));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const lease = await client.query(
                `SELECT * FROM "Usuario"."vwLeasesGET" WHERE leasesid = $1;`,
                [id]
            );
            return lease.rowCount > 0 ? new LeasesModel(lease.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByPropertyId({ propertyid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const leases = await client.query(
                `SELECT * FROM "Usuario"."vwLeasesGET" WHERE propertyid = $1;`,
                [propertyid]
            );
            return leases.rowCount > 0 ? leases.rows.map((lease) => new LeasesModel(lease)) : null;
        } finally {
            client.release();
        }
    }

    static async getByStudentId({ studentid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const leases = await client.query(
                `SELECT * FROM "Usuario"."vwLeasesGET" WHERE studentid = $1;`,
                [studentid]
            );
            return leases.rowCount > 0 ? leases.rows.map((lease) => new LeasesModel(lease)) : null;
        } finally {
            client.release();
        }
    }

    static async getByLessorId({ lessorid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const leases = await client.query(
                `SELECT * FROM "Usuario"."vwLeasesGET" WHERE lessorid = $1;`,
                [lessorid]
            );
            return leases.rowCount > 0 ? leases.rows.map((lease) => new LeasesModel(lease)) : null;
        } finally {
            client.release();
        }
    }

    static async getByLeaseNumber({ lease_number }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const leases = await client.query(
                `SELECT * FROM "Usuario"."vwLeasesGET" WHERE lease_number = $1;`,
                [lease_number]
            );
            return leases.rowCount > 0 ? leases.rows.map((lease) => new LeasesModel(lease)) : null;
        } finally {
            client.release();
        }
    }

    static async create(input) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            const { propertyid, studentid, dtstartdate, dtenddate, decmonthlycost, leasestatusid, requestid } = input
            try {
                const newLeases = await client.query(
                    `INSERT INTO "Usuario"."Arrendamientos" (propertyid, studentid, dtstartdate, dtenddate, decmonthlycost, leasestatusid, requestid ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
                    [propertyid, studentid, dtstartdate, dtenddate, decmonthlycost, leasestatusid, requestid]
                );

                return new LeasesModel(newLeases.rows[0]);
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error creating leases: ${error.message}`)
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
                    `DELETE FROM "Usuario"."Arrendamientos" WHERE leasesid = $1;`,
                    [id]
                );

                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting leases: ${error.message}`)
        }
    }

    static async update({ id, input }) {
        try {
            const lease = await this.getById({ id })
            if (!lease) return null;

            const leasesFields = [
                'dtenddate',
                'decmonthlycost',
                'leasestatusid'
            ];

            const leasesData = this.createDataObject(input, leasesFields);
            const updateColumns = Object.entries({
                ...leasesData
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(leasesData).indexOf(key) + 1}`;
                })
                .join(', ');

            const updateValues = Object.values({
                ...leasesData
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Arrendamientos" SET ${updateColumns} WHERE leasesid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating leases: ${error.message}`);
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