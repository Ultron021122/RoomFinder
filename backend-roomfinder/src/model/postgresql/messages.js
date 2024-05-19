import { Database } from "./database.js";

export class MessagesModel extends Database {

    constructor({ messageid, chatid, vchcontenido, created_at, usuarioid }) {
        super();
        this.messageid = messageid;
        this.chatid = chatid;
        this.vchcontenido = vchcontenido;
        this.created_at = created_at;
        this.usuarioid = usuarioid;
    }

    static async getAll() {
        const messages = await this.query(
            `SELECT * FROM "Usuario"."Mensajes";`
        );
        return messages.map((message) => new MessagesModel(message));
    }

    static async getByChat({ chatid }) {
        const messages = await this.query(
            `SELECT * FROM "Usuario"."Mensajes" WHERE chatid = $1;`,
            [chatid]
        );
        return messages.map((message) => new MessagesModel(message));
    }

    static async getById({ id }) {
        const message = await this.query(
            `SELECT * FROM "Usuario"."Mensajes" WHERE messageid = $1;`,
            [id]
        );
        return message[0] ? new MessagesModel(message[0]) : null;
    }

    static async create({ input }) {
        try {
            const { chatid, vchcontenido, created_at, usuarioid } = input
            const newMessage = await this.query(
                `INSERT INTO "Usuario"."Mensajes" (chatid, vchcontenido, created_at, usuarioid) VALUES ($1, $2, $3, $4) RETURNING *;`,
                [chatid, vchcontenido, created_at, usuarioid]
            );
            return new MessagesModel(newMessage[0]);
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            // Eliminar mensaje
            await this.query(
                `DELETE FROM "Usuario"."Mensajes" WHERE messageid = $1;`,
                [id]
            );
            return true;
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
                await this.query(
                    `UPDATE "Usuario"."Mensajes" SET ${updateColumns} WHERE messageid = $${updateValues.length + 1};`,
                    [...updateValues, id]
                );    
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

            // Eliminar mensajes
            await this.query(
                `DELETE FROM "Usuario"."Mensajes" WHERE chatid = $1;`,
                [chatid]
            );
            return true;
        } catch (error) {
            throw new Error(`Error deleting messages: ${error.message}`)
        }
    }
}