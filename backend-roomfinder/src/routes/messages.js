import { Router } from "express"
import { param, validationResult } from 'express-validator'
import { MessageController } from '../controller/messages.js'

export const createMessagesRouter = ({ messageModel }) => {
    const messagesRouter = Router()
    const messageController = new MessageController({ messageModel })

    /**
     * @swagger
     * tags:
     *  name: Messages
     *  description: Messages manage.
     */

    /**
     * @swagger
     * /api/messages:
     *  get:
     *      summary: Get all messages.
     *      tags: [Messages]
     */
    messagesRouter.get('/', messageController.getAll)
    /**
     * @swagger
     * /api/messages/chat/{chatid}:
     *  get:
     *      summary: Get message by id.
     *      tags: [Messages]
     */
    messagesRouter.get('/chat/:chatid', [
        // Validation
        param('chatid').isInt().withMessage('Chat id must be a integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        messageController.getByChat
    ])
    /**
     * @swagger
     * /api/messages/{id}:
     *  get:
     *      summary: Get message by id.
     *      tags: [Messages]
     */
    messagesRouter.get('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        messageController.getById
    ])
    /**
     * @swagger
     * /api/messages:
     *  post:
     *      summary: Create a new message.
     *      tags: [Messages]
     */
    messagesRouter.post('/', messageController.create)
    /**
     * @swagger
     * /api/messages/{id}:
     *  delete:
     *      summary: Delete message by id.
     *      tags: [Messages]
     */
    messagesRouter.delete('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        messageController.delete
    ])
    /**
     * @swagger
     * /api/messages/{id}:
     *  patch:
     *      summary: Update message by id.
     *      tags: [Messages]
     */
    messagesRouter.patch('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        messageController.updateMessage
    ])

    return messagesRouter
}