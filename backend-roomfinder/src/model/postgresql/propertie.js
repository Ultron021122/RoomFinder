import { Database } from "./database.js";
import { LessorsModel } from './lessor.js'

export class PropertiesModel {

    constructor({ vchtitle, propertyid, propertytypeid, lessorid, bnavailability, intnumberrooms, intnumberbeds, intnumberbathrooms,
        intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate,
        intmincontractduration, intmaxcontractduration, decpropertyrating,
        bnstudyzone, vchbuildingsecurity, vchtransportationaccess,
        bnwaterincluded, bnelectricityincluded, bninternetincluded, bngasincluded,
        bnheatingincluded, bnairconditioningincluded, bnlaundryincluded, bnparkingincluded,
        bncleaningincluded, bncabletvincluded, bnwashingmachineincluded, bnkitchen, bnlivingroom,
        bndiningroom, bncoolerincluded, bngardenincluded, bnwashingarea, intaccountparking,
        objphotos, vchexteriornumber, vchinteriornumber, vchstreet,
        vchaddresscomplement, vchneighborhood, vchmunicipality,
        vchstateprovince, intzip, vchcountry, lat, lng,
        vchpropertyrules, vchdescription, created_at }) {
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
        this.bnwaterincluded = bnwaterincluded; // Objetos de servicios
        this.bnelectricityincluded = bnelectricityincluded;
        this.bninternetincluded = bninternetincluded;
        this.bngasincluded = bngasincluded;
        this.bnheatingincluded = bnheatingincluded;
        this.bnairconditioningincluded = bnairconditioningincluded;
        this.bnlaundryincluded = bnlaundryincluded;
        this.bnparkingincluded = bnparkingincluded;
        this.bncleaningincluded = bncleaningincluded;
        this.bncabletvincluded = bncabletvincluded;
        this.bnwashingmachineincluded = bnwashingmachineincluded;
        this.bnkitchen = bnkitchen;
        this.bnlivingroom = bnlivingroom;
        this.bndiningroom = bndiningroom;
        this.bncoolerincluded = bncoolerincluded;
        this.bngardenincluded = bngardenincluded;
        this.bnwashingarea = bnwashingarea;
        this.intaccountparking = intaccountparking;
        this.objphotos = objphotos;
        this.vchexteriornumber = vchexteriornumber; // Objetos de dirección
        this.vchinteriornumber = vchinteriornumber;
        this.vchstreet = vchstreet;
        this.vchaddresscomplement = vchaddresscomplement;
        this.vchneighborhood = vchneighborhood;
        this.vchmunicipality = vchmunicipality;
        this.vchstateprovince = vchstateprovince;
        this.intzip = intzip;
        this.vchcountry = vchcountry;
        this.lat = lat;
        this.lng = lng;
        this.created_at = created_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const properties = await client.query(
                `SELECT * FROM "Usuario"."vwPropertiesGet";`
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
                `SELECT vp.* FROM "Usuario"."vwPropertiesGet" as vp WHERE vp.lessorid = $1;`,
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
                `SELECT vp.* FROM "Usuario"."vwPropertiesGet" as vp WHERE vp.propertyid = $1;`,
                [id]
            );
            return property.rowCount > 0 ? new PropertiesModel(property.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const { lessorid } = input

            const validateLessor = await LessorsModel.getById({ id: lessorid })
            if (validateLessor === null) return false;

            const db = new Database();
            const client = await db.pool.connect();

            try {
                const result = await client.query(
                    'CALL "Usuario"."prSetProperty"($1, $2)', [input, null]
                );

                const propertyid = result.rows[0].property_id;
                const newProperty = await this.getById({ id: propertyid });

                return newProperty;
            } finally {
                client.release();
            }
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
            const property = await this.getById({ id })
            if (property === null) return false;

            const db = new Database();
            const client = await db.pool.connect();
            try {
                await client.query(
                    'CALL "Usuario"."prSetProperty"($1, $2)', [input, null]
                );
            } finally {
                client.release();
            }

            return await this.getById({ id })
        } catch (error) {
            throw new Error(`Error updating property: ${error.message}`)
        }
    }
}