import { Database } from './database.js';

export class ChatsModel extends Database {
    
    constructor({ chatid, usuario1id, usuario2id, created_at }) {
        super();
        this.chatid = chatid;
        this.usuario1id = usuario1id;
        this.usuario2id = usuario2id;
        this.created_at = created_at;
    }

    static async getAll() {
        const chats = await this.query(
            `SELECT * FROM "Usuario"."Chats";`
        );
        return chats.map((chat) => new ChatsModel(chat));
    }

    static async getById({ id }) {
        const chat = await this.query(
            `SELECT * FROM "Usuario"."Chats" WHERE chatid = $1;`,
            [id]
        );
        return chat[0] ? new ChatsModel(chat[0]) : null;
    }

    static async getByUser({ userid }) {
        const chats = await this.query(
            `SELECT * FROM "Usuario"."Chats" WHERE usuario1id = $1 OR usuario2id = $1;`,
            [userid]
        );
        return chats.map((chat) => new ChatsModel(chat));
    }

    static async create({ input }) {
        try {
            const { usuario1id, usuario2id } = input
            const validate = await this.validate({ input });
            if (validate) return validate;

            const newChat = await this.query(
                `INSERT INTO "Usuario"."Chats" (usuario1id, usuario2id) VALUES ($1, $2) RETURNING *;`,
                [usuario1id, usuario2id]
            );

            return new ChatsModel(newChat[0]);
        } catch (error) {
            throw new Error(`Error creating chat: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            await this.query(
                `DELETE FROM "Usuario"."Chats" WHERE chatid = $1;`,
                [id]
            );
            return true;
        } catch (error) {
            throw new Error(`Error deleting chat: ${error.message}`)
        }
    }

    static async validate({ input }) {
        const { usuario1id, usuario2id } = input
        const chat = await this.query(
            `SELECT * FROM "Usuario"."Chats" WHERE (usuario1id = $1 AND usuario2id = $2) OR (usuario1id = $2 AND usuario2id = $1);`,
            [usuario1id, usuario2id]
        );
        return chat[0] ? new ChatsModel(chat[0]) : null;
    }
}