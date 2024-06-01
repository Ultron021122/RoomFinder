import { validateMessage, validatePartialMessage } from "../schemas/messages.js";

export class MessageController {
    constructor({ messageModel }) {
        this.messageModel = messageModel
    }

    getAll = async (req, res, next) => {
        try {
            const messages = await this.messageModel.getAll()
            return res.json(messages);
        } catch (err) {
            next(err); // Pass the error to the error handler
        }
    }

    getByChat = async (req, res, next) => {
        try {
            const { chatid } = req.params

            const messages = await this.messageModel.getByChat({ chatid })
            if (messages) return res.json(messages)
            return res.status(404).json({ message: 'Chat not found' })
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.messageModel.getById({ id })
            .then(message => {
                if (message) return res.json(message)
                return res.status(404).json({ message: 'Message not found' })
            })
            .catch(next); // Pass the error to the error handler
    }

    create = async (req, res, next) => {
        console.log("req.body: ", req.body);
        const result = validateMessage(req.body)
        if (result.error) {
            console.log(result.error.message)
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        await this.messageModel.create({ input: result.data })
            .then(message => {
                if (message) return res.status(201).json(message)
                return res.status(400).json({ message: 'Message not created' })
            })
            .catch(next); // Pass the error to the error handler
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.messageModel.delete({ id })
            .then(message => {
                if (message) return res.json({ message: 'Message deleted' })
                return res.status(404).json({ message: 'Message not found' })
            })
            .catch(next); // Pass the error to the error handler
    }

    updateMessage = async (req, res, next) => {
        const { id } = req.params
        const result = validatePartialMessage(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        await this.messageModel.update({ id, input: result.data })
            .then(message => {
                if (!message) return res.status(404).json({ message: 'Message not found' })
                return res.json(message)
            })
            .catch(next); // Pass the error to the error handler
    }
}