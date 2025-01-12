import { Database } from "./database.js";

export class PropertyTypeModel {
    constructor({ propertytypeid, vchtypename, created_at }) {
        this.propertytypeid = propertytypeid;
        this.vchtypename = vchtypename;
        this.created_at = created_at;
    }

    // Methods additional to the model
    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const typeProperties = await client.query(
                `SELECT * FROM "Usuario"."vwTypePropertiesGet";`
            );
            return typeProperties.rows.map((type) => new PropertyTypeModel(type));
        } finally {
            client.release();
        }
    }
}
