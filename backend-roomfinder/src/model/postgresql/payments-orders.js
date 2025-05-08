import { Database } from "./database.js";

export class PaymentOrderModel {
    constructor({
        orderid,
        leasesid,
        amount,
        status,
        vchconcept,
        created_at,
        updated_at,
        bitpayment,
        propertyid,
        studentid,
        dtstartdate,
        dtenddate,
        decmonthlycost,
        leasestatusid,
        lease_number,
        requestid,
        lessorid,
        vchlessorname,
        vchlessorpaternalsurname,
        vchlessormaternalsurname,
        vchlessoremail,
        bnstatus,
        roleid,
        vchleassorcoverimage,
        vchleassorbiography,
        vchstudentname,
        vchstudentpaternalsurname,
        vchstudentmaternalsurname,
        vchstudentemail,
        vchimage,
        studentroleid,
        vchstudentcoverimage,
        vchstudentbiography,
        objphotos
    }) {
        this.orderid = orderid;
        this.leasesid = leasesid;
        this.amount = amount;
        this.status = status;
        this.vchconcept = vchconcept;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.bitpayment = bitpayment;
        this.propertyid = propertyid;
        this.studentid = studentid;
        this.dtstartdate = dtstartdate;
        this.dtenddate = dtenddate;
        this.decmonthlycost = decmonthlycost;
        this.leasestatusid = leasestatusid;
        this.lease_number = lease_number;
        this.requestid = requestid;
        this.lessorid = lessorid;
        this.vchlessorname = vchlessorname;
        this.vchlessorpaternalsurname = vchlessorpaternalsurname;
        this.vchlessormaternalsurname = vchlessormaternalsurname;
        this.vchlessoremail = vchlessoremail;
        this.bnstatus = bnstatus;
        this.roleid = roleid;
        this.vchleassorcoverimage = vchleassorcoverimage;
        this.vchleassorbiography = vchleassorbiography;
        this.vchstudentname = vchstudentname;
        this.vchstudentpaternalsurname = vchstudentpaternalsurname;
        this.vchstudentmaternalsurname = vchstudentmaternalsurname;
        this.vchstudentemail = vchstudentemail;
        this.vchimage = vchimage;
        this.studentroleid = studentroleid;
        this.vchstudentcoverimage = vchstudentcoverimage;
        this.vchstudentbiography = vchstudentbiography;
        this.objphotos = objphotos;
    }


    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const orders = await client.query(
                `SELECT o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at as createPayments,
                    o.updated_at as updatePayments,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname as vchlessorname,
                    l.vchpaternalsurname as vchlessorpaternalsurname,
                    l.vchmaternalsurname as vchlessormaternalsurname,
                    l.vchemail as vchlessoremail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage as vchleassorcoverimage,
                    l.vchbiography as vchleassorbiography,
                    s.vchname as vchstudentname,
                    s.vchpaternalsurname as vchstudentpaternalsurname,
                    s.vchmaternalsurname as vchstudentmaternalsurname,
                    s.vchemail as vchstudentemail,
                    s.vchimage,
                    s.roleid as studentroleid,
                    s.vchcoverimage as vchstudentcoverimage,
                    s.vchbiography as vchstudentbiography,
                    jsonb_agg(jsonb_build_object('photoid', f.photoid, 'url', f.vchurl)) AS objphotos
                FROM "Usuario"."PaymentOrders" o
                INNER JOIN "Usuario"."Arrendamientos" a
                    ON o.leasesid = a.leasesid
                INNER JOIN "Usuario"."Propiedades" p
                    ON p.propertyid = a.propertyid
                INNER JOIN "Usuario"."Usuario" l
                    ON l.usuarioid = p.lessorid
                INNER JOIN "Usuario"."Usuario" s
                    ON s.usuarioid = a.studentid
               INNER JOIN "Usuario"."Photos" f ON p.propertyid = f.propertyid
               GROUP BY 
               o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at,
                    o.updated_at,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname,
                    l.vchpaternalsurname,
                    l.vchmaternalsurname,
                    l.vchemail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage,
                    l.vchbiography,
                    s.vchname,
                    s.vchpaternalsurname,
                    s.vchmaternalsurname,
                    s.vchemail,
                    s.vchimage,
                    s.roleid ,
                    s.vchcoverimage ,
                    s.vchbiography ;
               ` 
            );
            return orders.rows.map((order) => new PaymentOrderModel(order));
        } finally {
            client.release();
        }
    }

    static async getByLeases({ leasesid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const orders = await client.query(
                `SELECT o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at as createPayments,
                    o.updated_at as updatePayments,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname as vchlessorname,
                    l.vchpaternalsurname as vchlessorpaternalsurname,
                    l.vchmaternalsurname as vchlessormaternalsurname,
                    l.vchemail as vchlessoremail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage as vchleassorcoverimage,
                    l.vchbiography as vchleassorbiography,
                    s.vchname as vchstudentname,
                    s.vchpaternalsurname as vchstudentpaternalsurname,
                    s.vchmaternalsurname as vchstudentmaternalsurname,
                    s.vchemail as vchstudentemail,
                    s.vchimage,
                    s.roleid as studentroleid,
                    s.vchcoverimage as vchstudentcoverimage,
                    s.vchbiography as vchstudentbiography,
                    jsonb_agg(jsonb_build_object('photoid', f.photoid, 'url', f.vchurl)) AS objphotos
                FROM "Usuario"."PaymentOrders" o
                INNER JOIN "Usuario"."Arrendamientos" a
                    ON o.leasesid = a.leasesid
                INNER JOIN "Usuario"."Propiedades" p
                    ON p.propertyid = a.propertyid
                INNER JOIN "Usuario"."Usuario" l
                    ON l.usuarioid = p.lessorid
                INNER JOIN "Usuario"."Usuario" s
                    ON s.usuarioid = a.studentid
                INNER JOIN "Usuario"."Photos" f ON p.propertyid = f.propertyid
                WHERE o.leasesid = $1
               GROUP BY 
               o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at,
                    o.updated_at,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname,
                    l.vchpaternalsurname,
                    l.vchmaternalsurname,
                    l.vchemail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage,
                    l.vchbiography,
                    s.vchname,
                    s.vchpaternalsurname,
                    s.vchmaternalsurname,
                    s.vchemail,
                    s.vchimage,
                    s.roleid ,
                    s.vchcoverimage ,
                    s.vchbiography ;`,
                [leasesid]
            );
            return orders.rows.map((order) => new PaymentOrderModel(order));
        } finally {
            client.release();
        }
    }

    static async getByLeasorId({ leasorid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const orders = await client.query(
                `SELECT o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at as createPayments,
                    o.updated_at as updatePayments,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname as vchlessorname,
                    l.vchpaternalsurname as vchlessorpaternalsurname,
                    l.vchmaternalsurname as vchlessormaternalsurname,
                    l.vchemail as vchlessoremail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage as vchleassorcoverimage,
                    l.vchbiography as vchleassorbiography,
                    s.vchname as vchstudentname,
                    s.vchpaternalsurname as vchstudentpaternalsurname,
                    s.vchmaternalsurname as vchstudentmaternalsurname,
                    s.vchemail as vchstudentemail,
                    s.vchimage,
                    s.roleid as studentroleid,
                    s.vchcoverimage as vchstudentcoverimage,
                    s.vchbiography as vchstudentbiography,
                    jsonb_agg(jsonb_build_object('photoid', f.photoid, 'url', f.vchurl)) AS objphotos
                FROM "Usuario"."PaymentOrders" o
                INNER JOIN "Usuario"."Arrendamientos" a
                    ON o.leasesid = a.leasesid
                INNER JOIN "Usuario"."Propiedades" p
                    ON p.propertyid = a.propertyid
                INNER JOIN "Usuario"."Usuario" l
                    ON l.usuarioid = p.lessorid
                INNER JOIN "Usuario"."Usuario" s
                    ON s.usuarioid = a.studentid
                INNER JOIN "Usuario"."Photos" f ON p.propertyid = f.propertyid
                WHERE p.lessorid = $1
                GROUP BY 
               o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at,
                    o.updated_at,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname,
                    l.vchpaternalsurname,
                    l.vchmaternalsurname,
                    l.vchemail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage,
                    l.vchbiography,
                    s.vchname,
                    s.vchpaternalsurname,
                    s.vchmaternalsurname,
                    s.vchemail,
                    s.vchimage,
                    s.roleid ,
                    s.vchcoverimage ,
                    s.vchbiography ;
                `,
                [leasorid]
            );
            return orders.rows.map((order) => new PaymentOrderModel(order));
        } finally {
            client.release();
        }
    }

    static async getByStudentId({ studentid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const orders = await client.query(
                `SELECT o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at as createPayments,
                    o.updated_at as updatePayments,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname as vchlessorname,
                    l.vchpaternalsurname as vchlessorpaternalsurname,
                    l.vchmaternalsurname as vchlessormaternalsurname,
                    l.vchemail as vchlessoremail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage as vchleassorcoverimage,
                    l.vchbiography as vchleassorbiography,
                    s.vchname as vchstudentname,
                    s.vchpaternalsurname as vchstudentpaternalsurname,
                    s.vchmaternalsurname as vchstudentmaternalsurname,
                    s.vchemail as vchstudentemail,
                    s.vchimage,
                    s.roleid as studentroleid,
                    s.vchcoverimage as vchstudentcoverimage,
                    s.vchbiography as vchstudentbiography,
                    jsonb_agg(jsonb_build_object('photoid', f.photoid, 'url', f.vchurl)) AS objphotos
                FROM "Usuario"."PaymentOrders" o
                INNER JOIN "Usuario"."Arrendamientos" a
                    ON o.leasesid = a.leasesid
                INNER JOIN "Usuario"."Propiedades" p
                    ON p.propertyid = a.propertyid
                INNER JOIN "Usuario"."Usuario" l
                    ON l.usuarioid = p.lessorid
                INNER JOIN "Usuario"."Usuario" s
                    ON s.usuarioid = a.studentid
                INNER JOIN "Usuario"."Photos" f ON p.propertyid = f.propertyid
                WHERE a.studentid = $1
                               GROUP BY 
               o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at,
                    o.updated_at,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname,
                    l.vchpaternalsurname,
                    l.vchmaternalsurname,
                    l.vchemail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage,
                    l.vchbiography,
                    s.vchname,
                    s.vchpaternalsurname,
                    s.vchmaternalsurname,
                    s.vchemail,
                    s.vchimage,
                    s.roleid ,
                    s.vchcoverimage ,
                    s.vchbiography ;
                `,
                [studentid]
            );
            return orders.rows.map((order) => new PaymentOrderModel(order));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const order = await client.query(
            `SELECT o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at as createPayments,
                    o.updated_at as updatePayments,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname as vchlessorname,
                    l.vchpaternalsurname as vchlessorpaternalsurname,
                    l.vchmaternalsurname as vchlessormaternalsurname,
                    l.vchemail as vchlessoremail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage as vchleassorcoverimage,
                    l.vchbiography as vchleassorbiography,
                    s.vchname as vchstudentname,
                    s.vchpaternalsurname as vchstudentpaternalsurname,
                    s.vchmaternalsurname as vchstudentmaternalsurname,
                    s.vchemail as vchstudentemail,
                    s.vchimage,
                    s.roleid as studentroleid,
                    s.vchcoverimage as vchstudentcoverimage,
                    s.vchbiography as vchstudentbiography,
                    jsonb_agg(jsonb_build_object('photoid', f.photoid, 'url', f.vchurl)) AS objphotos
                FROM "Usuario"."PaymentOrders" o
                INNER JOIN "Usuario"."Arrendamientos" a
                    ON o.leasesid = a.leasesid
                INNER JOIN "Usuario"."Propiedades" p
                    ON p.propertyid = a.propertyid
                INNER JOIN "Usuario"."Usuario" l
                    ON l.usuarioid = p.lessorid
                INNER JOIN "Usuario"."Usuario" s
                    ON s.usuarioid = a.studentid
                INNER JOIN "Usuario"."Photos" f ON p.propertyid = f.propertyid
                WHERE o.orderid = $1
                               GROUP BY 
               o.orderid,
                    o.leasesid,
                    o.amount,
                    o.status,
                    o.created_at,
                    o.updated_at,
                    o.vchconcept,
                    o.bitpayment,
                    a.propertyid,
                    a.studentid,
                    a.dtstartdate,
                    a.dtenddate,
                    a.decmonthlycost,
                    a.created_at,
                    a.leasestatusid,
                    a.lease_number,
                    a.requestid,
                    p.lessorid,
                    l.vchname,
                    l.vchpaternalsurname,
                    l.vchmaternalsurname,
                    l.vchemail,
                    l.bnstatus,
                    l.roleid,
                    l.vchcoverimage,
                    l.vchbiography,
                    s.vchname,
                    s.vchpaternalsurname,
                    s.vchmaternalsurname,
                    s.vchemail,
                    s.vchimage,
                    s.roleid ,
                    s.vchcoverimage ,
                    s.vchbiography ;
                `,
                [id]
            );
            return order.rowCount > 0 ? new PaymentOrderModel(order.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { leasesid, amount, status } = input;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const order = await client.query(
                    `INSERT INTO "Usuario"."PaymentOrders" (leasesid, amount, status) VALUES ($1, $2, $3) RETURNING *;`,
                    [leasesid, amount, status]
                );
                return new PaymentOrderModel(order.rows[0]);
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error creating payment order:", error);
            throw error;
        }
    }

    static async update({ id, input }) {
        try {
            const { status } = input;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const order = await client.query(
                    `UPDATE "Usuario"."PaymentOrders" SET status = $1, updated_at=CURRENT_TIMESTAMP WHERE orderid = $2 RETURNING *;`,
                    [status, id]
                );
                return order.rowCount > 0 ? new PaymentOrderModel(order.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error updating payment order:", error);
            throw error;
        }
    }

    static async delete({ id }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `DELETE FROM "Usuario"."PaymentOrders" WHERE orderid = $1 RETURNING *;`,
                    [id]
                );
                return result.rowCount > 0 ? new PaymentOrderModel(result.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error deleting payment order:", error);
            throw error;
        }
    }

    static async deleteByLeasesId({ leasesid }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `DELETE FROM "Usuario"."PaymentOrders" WHERE leasesid = $1 RETURNING *;`,
                    [leasesid]
                );
                return result.rowCount > 0 ? new PaymentOrderModel(result.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error deleting payment order by leases ID:", error);
            throw error;
        }
    }

    static async deleteByOrderId({ orderid }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            try {
                const result = await client.query(
                    `DELETE FROM "Usuario"."PaymentOrders" WHERE orderid = $1 RETURNING *;`,
                    [orderid]
                );
                return result.rowCount > 0 ? new PaymentOrderModel(result.rows[0]) : null;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error deleting payment order by order ID:", error);
            throw error;
        }
    }
}