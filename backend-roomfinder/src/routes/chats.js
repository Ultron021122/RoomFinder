import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { ChatsController } from '../controller/chats.js';

export const createChatsRouter = ({ chatsModel }) => {
    const chatsRouter = Router();
    const chatsController = new ChatsController({ chatsModel });

    /**
     * @swagger
     * tags:
     *  name: Chats
     *  description: Chats endpoints
     */
    /**
     * @swagger
     * /chats:
     *  get:
     *      summary: Get all chats
     *      tags: [Chats]
     */
    chatsRouter.get('/', chatsController.getAll);
    /**
     * @swagger
     * /chats/{id}:
     *  get:
     *      summary: Get chat by id
     *      tags: [Chats]
     */
    chatsRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        chatsController.getById
    ])
    /**
     * @swagger
     * /chats/user/{userid}:
     *  get:
     *      summary: Get chat by user
     *      tags: [Chats]
     */
    chatsRouter.get('/user/:userid', [
        param('userid').isInt().withMessage('userid must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        chatsController.getByUser
    ])
    /**
     * @swagger
     * /chats:
     *  post:
     *      summary: Create chat
     *      tags: [Chats]
     */
    chatsRouter.post('/', chatsController.create);
    /**
     * @swagger
     * /chats/{id}:
     *  delete:
     *      summary: Delete chat
     *      tags: [Chats]
     */
    chatsRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        chatsController.delete
    ])

    return chatsRouter;
}