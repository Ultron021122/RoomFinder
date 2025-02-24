import { Database } from "./database.js";

export class MessagesModel {

    constructor({ messageid, chatid, vchcontenido, created_at, usuarioid }) {
        this.messageid = messageid;
        this.chatid = chatid;
        this.vchcontenido = vchcontenido;
        this.created_at = created_at;
        this.usuarioid = usuarioid;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const messages = await client.query(
                `SELECT * FROM "Usuario"."Mensajes";`
            );
            return messages.rows.map((message) => new MessagesModel(message));
        } finally {
            client.release();
        }
    }

    static async getByChat({ chatid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const messages = await client.query(
                `SELECT * FROM "Usuario"."Mensajes" WHERE chatid = $1;`,
                [chatid]
            );
            return messages.rows.map((message) => new MessagesModel(message));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const message = await client.query(
                `SELECT * FROM "Usuario"."Mensajes" WHERE messageid = $1;`,
                [id]
            );
            return message[0] ? new MessagesModel(message[0]) : null;
        } finally {
            client.release();
        }
    }

    static async create({ input }) {
        try {
            const db = new Database();
            const client = await db.pool.connect();
            const { chatid, vchcontenido, created_at, usuarioid } = input
            try {
                const newMessage = await client.query(
                    `INSERT INTO "Usuario"."Mensajes" (chatid, vchcontenido, created_at, usuarioid) VALUES ($1, $2, $3, $4) RETURNING *;`,
                    [chatid, vchcontenido, created_at, usuarioid]
                );
                
                return new MessagesModel(newMessage.rows[0]);
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            const db = new Database();
            const client = await db.pool.connect();
            try { // Eliminar mensaje
                await client.query(
                    `DELETE FROM "Usuario"."Mensajes" WHERE messageid = $1;`,
                    [id]
                );
                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting message: ${error.message}`)
        }
    }

    static async update({ id, input }) {
        try {
            const { vchcontenido, created_at } = input
            const validate = await this.getById({ id });
            if (!validate) return null;

            const updateColumns = Object.entries({
                vchcontenido,
                created_at
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(input).indexOf(key) + 1}`; // Increment position by 1
                })
                .join(', ');

            const updateValues = Object.values({
                vchcontenido,
                created_at
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                const db = new Database();
                const client = await db.pool.connect();
                try {
                    await client.query(
                        `UPDATE "Usuario"."Mensajes" SET ${updateColumns} WHERE messageid = $${updateValues.length + 1};`,
                        [...updateValues, id]
                    );
                } finally {
                    client.release();
                }
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating message: ${error.message}`)
        }
    }

    static async deleteByChat({ chatid }) {
        try {
            const validate = await this.getByChat({ chatid });
            if (!validate) return false;
            const db = new Database();
            const client = await db.pool.connect();
            try {
                // Eliminar mensajes
                await client.query(
                    `DELETE FROM "Usuario"."Mensajes" WHERE chatid = $1;`,
                    [chatid]
                );
                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting messages: ${error.message}`)
        }
    }
}