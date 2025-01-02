import { Database } from "./database.js";
import { LessorsModel } from './lessor.js'

export class PropertiesModel extends Database {

    constructor({ vchtitle, propertyid, propertytypeid, lessorid, bnavailability, intnumberrooms, intnumberbeds, intnumberbathrooms,
        intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate,
        intmincontractduration, intmaxcontractduration, decpropertyrating,
        bnstudyzone, vchbuildingsecurity, vchtransportationaccess, objservices, objphotos, objlocation,
        vchpropertyrules, vchdescription, created_at }) {
        super();
        this.lessorid = lessorid;
        this.vchtitle = vchtitle;
        this.propertyid = propertyid;
        this.propertytypeid = propertytypeid;
        this.bnavailability = bnavailability;
        this.intnumberrooms = intnumberrooms;
        this.intnumberbeds = intnumberbeds;
        this.intnumberbathrooms = intnumberbathrooms;
        this.intmaxoccupacy = intmaxoccupacy;
        this.bnfurnished = bnfurnished;
        this.vchfurnituretype = vchfurnituretype;
        this.decrentalcost = decrentalcost;
        this.dtavailabilitydate = dtavailabilitydate;
        this.intmincontractduration = intmincontractduration;
        this.intmaxcontractduration = intmaxcontractduration;
        this.decpropertyrating = decpropertyrating;
        this.bnstudyzone = bnstudyzone;
        this.vchbuildingsecurity = vchbuildingsecurity;
        this.vchtransportationaccess = vchtransportationaccess;
        this.vchpropertyrules = vchpropertyrules;
        this.vchdescription = vchdescription;
        this.objservices = objservices;
        this.objphotos = objphotos;
        this.objlocation = objlocation;
        this.created_at = created_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const properties = await client.query(
                `SELECT * FROM "Usuario"."Propiedades";`
            );
            return properties.rows.map((property) => new PropertiesModel(property));
        } finally {
            client.release();
        }
    }

    static async getByLessor({ lessorid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const properties = await client.query(
                `SELECT * FROM "Usuario"."Propiedades" WHERE lessorid = $1;`,
                [lessorid]
            );
            return properties.rows.map((property) => new PropertiesModel(property));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const property = await client.query(
                `SELECT * FROM "Usuario"."Propiedades" WHERE propertyid = $1;`,
                [id]
            );
            return property.rowCount > 0 ? new PropertiesModel(property.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { vchtitle, propertytypeid, lessorid, bnavailability, intnumberrooms, intnumberbeds, intnumberbathrooms,
                intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate,
                intmincontractduration, intmaxcontractduration, decpropertyrating,
                bnstudyzone, vchbuildingsecurity, vchtransportationaccess, objservices, objphotos, objlocation,
                vchpropertyrules, vchdescription } = input
            
            const validateLessor = await LessorsModel.getById({ id: lessorid })
            if (validateLessor === null) return false;

            const db = new Database();
            const client = await db.pool.connect();

            try {
                const result = await client.query(
                    'CALL "Usuario"."get_user_name_by_id"($1, $2)', [lessorid, null]
                );
                console.log(result.rows[0]);
                return result.rows[0];
                // return new PropertiesModel(result.rows[0]);
            } finally {
                client.release();
            }

            // const result = await this.query(
            //     `INSERT INTO "Usuario"."Propiedades" (vchtitle, lessorid, intnumberrooms, intnumberbathrooms, intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration,
            //         intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17 ) RETURNING propertyid;`,
            //     [vchtitle, lessorid, intnumberrooms, intnumberbathrooms, intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration,
            //         intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription]
            // );

            // const id = result[0].propertyid;
            // const newProperty = await this.getById({ id })

            // return newProperty;
        } catch (error) {
            throw new Error(`Error creating property: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            const db = new Database();
            const client = await db.pool.connect();
            try { // Eliminar propiedad
                await client.query(
                    'DELETE FROM "Usuario"."Propiedades" WHERE propertyid = $1;',
                    [id]
                );
                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting property: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { vchtitle, intnumberrooms, intnumberbathrooms, intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration,
                intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription } = input
            
                const property = await this.getById({ id })
            if (property === null) return false;

            const updateColumns = Object.entries({
                vchtitle,
                intnumberrooms,
                intnumberbathrooms,
                intmaxoccupacy,
                bnfurnished,
                vchfurnituretype,
                decrentalcost,
                dtavailabilitydate,
                intmincontractduration,
                intmaxcontractduration,
                decpropertyrating,
                bnstudyzone,
                vchbuildingsecurity,
                vchtransportationaccess,
                vchpropertyrules,
                vchdescription
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} ? $${Object.keys(input).indexOf(key) + 1}`;
                })
                .join(', ');

            const updateValues = Object.value({
                vchtitle,
                intnumberrooms,
                intnumberbathrooms,
                intmaxoccupacy,
                bnfurnished,
                vchfurnituretype,
                decrentalcost,
                dtavailabilitydate,
                intmincontractduration,
                intmaxcontractduration,
                decpropertyrating,
                bnstudyzone,
                vchbuildingsecurity,
                vchtransportationaccess,
                vchpropertyrules,
                vchdescription
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Propiedades" SET ${updateColumns} WHERE propertyid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id })
        } catch (error) {
            throw new Error(`Error updating property: ${error.message}`)
        }
    }
}