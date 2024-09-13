import { validateChat, validatePartialChat } from "../schemas/chats.js";

export class ChatsController {
    constructor({ chatsModel }) {
        this.chatsModel = chatsModel;
    }

    getAll = async (req, res, next) => {
        try {
            const chats = await this.chatsModel.getAll();
            return res.json(chats);
        } catch (err) {
            next(err); // Pass the error to the error handler
        }
    }

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;

            const chat = await this.chatsModel.getById({ id });
            if (chat) return res.json(chat);
            return res.status(404).json({ message: "Chat not found" });
        } catch (err) {
            next(err);
        }
    }

    getByUser = async (req, res, next) => {
        try {
            const { userid } = req.params;

            const chats = await this.chatsModel.getByUser({ userid });
            if (chats) return res.json(chats);
            return res.status(404).json({ message: "Chat not found" });
        } catch (err) {
            next(err);
        }
    }

    create = async (req, res, next) => {
        console.log('Error problem:',req.body);
        const result = validateChat(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        await this.chatsModel.create({ input: result.data })
            .then(chat => {
                if (chat) return res.status(201).json(chat);
                return res.status(400).json({ message: "Chat already exists" });
            })
            .catch(next);
    }

    delete = async (req, res, next) => {
        const { id } = req.params;
        await this.chatsModel.delete({ id })
            .then(deleted => {
                if (deleted) return res.json({ message: "Chat deleted" });
                return res.status(404).json({ message: "Chat not found" });
            })
            .catch(next);
    }
}