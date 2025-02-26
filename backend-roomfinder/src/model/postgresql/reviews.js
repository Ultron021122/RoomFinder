import { Database } from "./database.js"

export class ReviewsModel {
    constructor({ reviewid, propertyid, studentid, decrating, vchcomment, created_at, updated_at }) {
        this.reviewid = reviewid;
        this.propertyid = propertyid;
        this.studentid = studentid;
        this.decrating = decrating;
        this.vchcomment = vchcomment;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect()

        try {
            const reviews = await client.query(
                `SELECT * FROM "Usuario"."Opiniones";`
            );

            return reviews.rows.map((review) => new ReviewsModel(review));
        } finally {
            client.release();
        }
    }

    static async getByOwner({ studentid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const reviews = await client.query(
                `SELECT * FROM "Usuario"."Opiniones" WHERE studentid = $1;`,
                [studentid]
            );

            return reviews.rows.map((review) => new ReviewsModel(review));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const review = await client.query(
                `SELECT * FROM "Usuario"."Opiniones" WHERE reviewid = $1;`,
                [id]
            );

            return review.rowCount > 0 ? new ReviewsModel(review.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByProperty({ propertyid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const reviews = await client.connect.query(
                `SELECT * FROM "Usuario"."Opiniones" WHERE propertyid = $1;`,
                [propertyid]
            );

            return reviews.rowCount > 0 ? new ReviewsModel(reviews.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        const { propertyid, studentid, decrating, vchcomment } = input

        const db = new Database();
        const client = await db.pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO "Usuario"."Opiniones" (propertyid, studentid, decrating, vchcomment) VALUES ($1, $2, $3, $4) RETURNING *;`,
                [propertyid, studentid, decrating, vchcomment]
            );

            return new ReviewsModel(result.rows[0]);
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
                    `DELETE FROM "Usuario"."Opiniones" WHERE reviewid = $1;`,
                    [id]
                );

                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting review: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const review = await this.getById({ id })
            if (!review) return null;

            const reviewFields = [
                'propertyid',
                'studentid',
                'decrating',
                'vchcomment'
            ];

            const reviewData = this.createDataObject(input, reviewFields);

            const updateColumns = Object.entries({
                ...reviewData
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(reviewData).indexOf(key) + 1}`;
                })
                .join(', ');

            const updateValues = Object.values({
                ...reviewData
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Opiniones" SET ${updateColumns}, updated_at = CURRENT_TIMESTAMP  WHERE reviewid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }
        } catch(error) {
            throw new Error(`Error updating review: ${error.message}`);
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