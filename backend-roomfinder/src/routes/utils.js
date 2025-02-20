import { Router } from "express";
import { param, validationResult } from 'express-validator'
import { UtilsController } from "../controller/utils.js";

export const createUtilsRouter = () => {
    const utilsRouter = Router()
    const utilsController = new UtilsController()

    /**
     * @swagger
     * tags:
     *  name: Utils
     *  description: Utils manage.
     */

    /**
     * @swagger
     * /api/utils/{query}:
     *  get:
     *      summary: Get data.
     *      tags: [Utils]
     *      description: List of addresses.
     *      responses:
     *          '200':
     *              description: A JSON array of utils data
     */
    utilsRouter.get('/:query', [
        param('query').isString().withMessage('query must be an string'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()})
            }
            next()
        },
        utilsController.getData
    ])

    return utilsRouter
}