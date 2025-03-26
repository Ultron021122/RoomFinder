import { Router } from "express";
import { param, validationResult } from 'express-validator'
import { RentalHistoryController } from "../controller/rental-history.js";

export const createRentalHistoryRouter = ({ rentalHistoryModel }) => {
    const rentalHistoryRouter = Router()
    const rentalHistoryController = new RentalHistoryController({ rentalHistoryModel })

    /**
     * @swagger
     * tags:
     *  name: Rental-History
     *  description: Rental-History manage.
     */

    /**
     * @swagger
     * /api/rental-history:
     *  get:
     *      summary: Get all rental history.
     *      tags: [Lessors]
     *      description: List of rental history in database.
     *      responses:
     *          '200':
     *              description: A JSON array of rental history data
     */
    rentalHistoryRouter.get('/', rentalHistoryController.getAll)

    rentalHistoryRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        rentalHistoryController.getById
    ])

    rentalHistoryRouter.get('/user/:studentid', [
        param('studentid').isInt().withMessage('studentid must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        rentalHistoryController.getByStudentId
    ])

    rentalHistoryRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        rentalHistoryController.delete
    ])

    return rentalHistoryRouter
}