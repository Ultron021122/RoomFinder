import { Database } from "./database.js";
import { LessorsModel } from './lessor.js'

export class PropertiesModel extends Database {

    constructor({ vchtitle, propertyid, lessorid, intnumberrooms, intnumberbathrooms,
        intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate,
        intmincontractduration, intmaxcontractduration, decpropertyrating,
        bnstudyzone, vchbuildingsecurity, vchtransportationaccess,
        vchpropertyrules, vchdescription, created_at }) {
        super();
        this.vchtitle = vchtitle;
        this.propertyid = propertyid;
        this.lessorid = lessorid;
        this.intnumberrooms = intnumberrooms;
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
        this.created_at = created_at;
    }

    static async getAll() {
        const properties = await this.query(
            `SELECT * FROM "Usuario"."Propiedades";`
        );
        return properties.map((property) => new PropertiesModel(property));
    }

    static async getByLessor({ lessorid }) {
        const properties = await this.query(
            `SELECT * FROM "Usuario"."Propiedades" WHERE lessorid = $1;`,
            [lessorid]
        );
        return properties.map((property) => new PropertiesModel(property))
    }

    static async getById({ id }) {
        const property = await this.query(
            `SELECT * FROM "Usuario"."Propiedades" WHERE propertyid = $1;`,
            [id]
        );
        return property[0] ? new PropertiesModel(property[0]) : null;
    }

    static async create({ input }) {
        try {
            const { vchtitle, lessorid, intnumberrooms, intnumberbathrooms, intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration,
                intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription } = input
            
            const validateLessor = await LessorsModel.getById({ id: lessorid })
            if (validateLessor === null) return false;

            const result = await this.query(
                `INSERT INTO "Usuario"."Propiedades" (vchtitle, lessorid, intnumberrooms, intnumberbathrooms, intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration,
                    intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17 ) RETURNING propertyid;`,
                [vchtitle, lessorid, intnumberrooms, intnumberbathrooms, intmaxoccupacy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration,
                    intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription]
            );

            const id = result[0].propertyid;
            const newProperty = await this.getById({ id })

            return newProperty;
        } catch (error) {
            throw new Error(`Error creating property: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            // Eliminar propiedad
            await this.query(
                'DELETE FROM "Usuario"."Propiedades" WHERE propertyid = $1;',
                [id]
            )
            return true;
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
                await this.query(
                    `UPDATE "Usuario"."Propiedades" SET ${updateColumns} WHERE propertyid = $${updateValues.length + 1};`,
                    [...updateValues, id]
                );
            }

            return await this.getById({ id })
        } catch (error) {
            throw new Error(`Error updating property: ${error.message}`)
        }
    }
}