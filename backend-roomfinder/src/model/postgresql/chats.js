import { Database } from './database.js';

export class ChatsModel {

    constructor({ chatid, usuario1id, usuario2id, created_at }) {
        this.chatid = chatid;
        this.usuario1id = usuario1id;
        this.usuario2id = usuario2id;
        this.created_at = created_at;
    }

    static async getAll() {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const chats = await client.query(
                `SELECT * FROM "Usuario"."Chats";`
            );
            return chats.rows.map((chat) => new ChatsModel(chat));
        } finally {
            client.release();
        }
    }

    static async getById({ id }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const chat = await client.query(
                `SELECT * FROM "Usuario"."Chats" WHERE chatid = $1;`,
                [id]
            );
            return chat.rowCount > 0 ? new ChatsModel(chat.rows[0]) : null;
        } finally {
            client.release();
        }
    }

    static async getByUser({ userid }) {
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const chats = await client.query(
                `SELECT * FROM "Usuario"."Chats" WHERE usuario1id = $1 OR usuario2id = $1;`,
                [userid]
            );
            return chats.rows.map((chat) => new ChatsModel(chat));
        } finally {
            client.release();
        }

    }

    static async create({ input }) {
        try {
            const { usuario1id, usuario2id } = input
            const validate = await this.validate({ input });
            if (validate) return validate;

            const db = new Database();
            const client = await db.pool.connect();
            try {
                const newChat = await client.query(
                    `INSERT INTO "Usuario"."Chats" (usuario1id, usuario2id) VALUES ($1, $2) RETURNING *;`,
                    [usuario1id, usuario2id]
                );

                return new ChatsModel(newChat.rows[0]);
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error creating chat: ${error.message}`)
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
                    `DELETE FROM "Usuario"."Chats" WHERE chatid = $1;`,
                    [id]
                );
                return true;
            } finally {
                client.release();
            }
        } catch (error) {
            throw new Error(`Error deleting chat: ${error.message}`)
        }
    }

    static async validate({ input }) {
        const { usuario1id, usuario2id } = input
        const db = new Database();
        const client = await db.pool.connect();
        try {
            const chat = await this.query(
                `SELECT * FROM "Usuario"."Chats" WHERE (usuario1id = $1 AND usuario2id = $2) OR (usuario1id = $2 AND usuario2id = $1);`,
                [usuario1id, usuario2id]
            );
            return chat.rowCount > 0 ? new ChatsModel(chat.rows[0]) : null;
        } finally {
            client.release();
        }
    }
}