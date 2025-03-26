import { Database } from "./database.js";

export class RentalHistoryModel {
    constructor({ rentalhistoryid, studentid, propertyid, propertytypeid, vchtitle, intnumberrooms, intnumberbathrooms, intmaxoccupancy, bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration, intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, vchtransportationaccess, vchpropertyrules, vchdescription, vchexteriornumber, vchinteriornumber, vchstreet, vchaddresscomplement, vchneighborhood, vchmunicipality, vchstateprovince, intzip, vchcountry, lat, lng, bnwaterincluded, bnelectricityincluded, bninternetincluded, bngasincluded, bnheatingincluded, bnairconditioningincluded, bnlaundryincluded, bnparkingincluded, bncleaningincluded, bncabletvincluded, bnwashingmachineincluded, bnkitchen, bnlivingroom, bndiningroom, bncoolerincluded, bngardenincluded, intaccountparking, decarea, fldistanceuniversity, vchadditionalfeatures, dtstartdate, dtenddate, objphotos, created_at, updated_at }) {
        this.rentalhistoryid = rentalhistoryid;
        this.studentid = studentid;
        this.propertyid = propertyid;
        this.propertytypeid = propertytypeid;
        this.vchtitle = vchtitle;
        this.intnumberrooms = intnumberrooms;
        this.intnumberbathrooms = intnumberbathrooms;
        this.intmaxoccupancy = intmaxoccupancy;
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
        this.vchexteriornumber = vchexteriornumber;
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
        this.bnwaterincluded = bnwaterincluded;
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
        this.intaccountparking = intaccountparking;
        this.decarea = decarea;
        this.fldistanceuniversity = fldistanceuniversity;
        this.vchadditionalfeatures = vchadditionalfeatures;
        this.dtstartdate = dtstartdate;
        this.dtenddate = dtenddate;
        this.objphotos = objphotos;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const rentalHistory = await client.query(
                `SELECT u.rentalhistoryid, u.studentid, u.propertyid, u.propertytypeid, u.vchtitle, u.intnumberrooms, u.intnumberbathrooms, u.intmaxoccupancy, u.bnfurnished, u.vchfurnituretype, 
                    u.decrentalcost, u.dtavailabilitydate, u.intmincontractduration, u.intmaxcontractduration, u.decpropertyrating, u.bnstudyzone, u.vchbuildingsecurity, u.vchtransportationaccess, 
                    u.vchpropertyrules, u.vchdescription, u.vchexteriornumber, u.vchinteriornumber, u.vchstreet, u.vchaddresscomplement, u.vchneighborhood, u.vchmunicipality, u.vchstateprovince, 
                    u.intzip, u.vchcountry, u.lat, u.lng, u.bnwaterincluded, u.bnelectricityincluded, u.bninternetincluded, u.bngasincluded, u.bnheatingincluded, u.bnairconditioningincluded, 
                    u.bnlaundryincluded, u.bnparkingincluded, u.bncleaningincluded, u.bncabletvincluded, u.bnwashingmachineincluded, u.bnkitchen, u.bnlivingroom, u.bndiningroom, u.bncoolerincluded, 
                    u.bngardenincluded, u.intaccountparking, u.decarea, u.fldistanceuniversity, u.vchadditionalfeatures, u.dtstartdate, u.dtenddate, u.created_at, u.updated_at,
                    p.objphotos
                FROM "Usuario"."RentalHistory" u
                INNER JOIN "Usuario"."vwPropertiesGet" p
                    ON p.propertyid = u.propertyid;`
            );
            return rentalHistory.rows.map((rental) => new RentalHistoryModel(rental));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const rentalHistory = await client.query(
                `SELECT u.rentalhistoryid, u.studentid, u.propertyid, u.propertytypeid, u.vchtitle, u.intnumberrooms, u.intnumberbathrooms, u.intmaxoccupancy, u.bnfurnished, u.vchfurnituretype, 
                    u.decrentalcost, u.dtavailabilitydate, u.intmincontractduration, u.intmaxcontractduration, u.decpropertyrating, u.bnstudyzone, u.vchbuildingsecurity, u.vchtransportationaccess, 
                    u.vchpropertyrules, u.vchdescription, u.vchexteriornumber, u.vchinteriornumber, u.vchstreet, u.vchaddresscomplement, u.vchneighborhood, u.vchmunicipality, u.vchstateprovince, 
                    u.intzip, u.vchcountry, u.lat, u.lng, u.bnwaterincluded, u.bnelectricityincluded, u.bninternetincluded, u.bngasincluded, u.bnheatingincluded, u.bnairconditioningincluded, 
                    u.bnlaundryincluded, u.bnparkingincluded, u.bncleaningincluded, u.bncabletvincluded, u.bnwashingmachineincluded, u.bnkitchen, u.bnlivingroom, u.bndiningroom, u.bncoolerincluded, 
                    u.bngardenincluded, u.intaccountparking, u.decarea, u.fldistanceuniversity, u.vchadditionalfeatures, u.dtstartdate, u.dtenddate, u.created_at, u.updated_at,
                    p.objphotos
                FROM "Usuario"."RentalHistory" u
                INNER JOIN "Usuario"."vwPropertiesGet" p
                    ON p.propertyid = u.propertyid
                WHERE u.rentalhistoryid = $1;`,
                [id]
            );

            return rentalHistory.rowCount > 0 ? new RentalHistoryModel(rentalHistory.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByStudentId({ studentid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const rentalHistory = await client.query(
                `SELECT u.rentalhistoryid, u.studentid, u.propertyid, u.propertytypeid, u.vchtitle, u.intnumberrooms, u.intnumberbathrooms, u.intmaxoccupancy, u.bnfurnished, u.vchfurnituretype, 
                    u.decrentalcost, u.dtavailabilitydate, u.intmincontractduration, u.intmaxcontractduration, u.decpropertyrating, u.bnstudyzone, u.vchbuildingsecurity, u.vchtransportationaccess, 
                    u.vchpropertyrules, u.vchdescription, u.vchexteriornumber, u.vchinteriornumber, u.vchstreet, u.vchaddresscomplement, u.vchneighborhood, u.vchmunicipality, u.vchstateprovince, 
                    u.intzip, u.vchcountry, u.lat, u.lng, u.bnwaterincluded, u.bnelectricityincluded, u.bninternetincluded, u.bngasincluded, u.bnheatingincluded, u.bnairconditioningincluded, 
                    u.bnlaundryincluded, u.bnparkingincluded, u.bncleaningincluded, u.bncabletvincluded, u.bnwashingmachineincluded, u.bnkitchen, u.bnlivingroom, u.bndiningroom, u.bncoolerincluded, 
                    u.bngardenincluded, u.intaccountparking, u.decarea, u.fldistanceuniversity, u.vchadditionalfeatures, u.dtstartdate, u.dtenddate, u.created_at, u.updated_at,
                    p.objphotos
                FROM "Usuario"."RentalHistory" u
                INNER JOIN "Usuario"."vwPropertiesGet" p
                    ON p.propertyid = u.propertyid
                WHERE u.studentid = $1;`,
                [studentid]
            );
            return rentalHistory.rows.map((rental) => new RentalHistoryModel(rental));
        } finally {
            client.release();
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if(!validate) return false;

            const db = new Database();
            const client = await db.pool.connect();
            try {
                await client.query(
                    `DELETE FROM "Usuario"."RentalHistory" WHERE u.rentalhistoryid = $1;`,
                    [id]
                );

                return true;
            } finally {
                client.release();
            }
        } catch(error) {
            throw new Error(`Error deleting rental-history: ${error.message}`)
        }
    }
}