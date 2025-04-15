import { Router } from "express";
import { param, validationResult } from 'express-validator'
import { LeasesController } from "../controller/leases.js";

export const createLeasesRouter = ({ leasesModel }) => {
    const leasesRouter = Router()
    const leasesController = new LeasesController({ leasesModel })

    /**
     * @swagger
     * tags:
     *  name: Leases
     *  description: Leases manage.
     */
    /**
     * @swagger
     * /api/leases:
     *  get:
     *      summary: Get all leases.
     *      tags: [Leases]
     *      description: List of leases in database
     *      responses:
     *          '200':
     *              description: A JSON array of lease data
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              type: object
     */
    leasesRouter.get('/', leasesController.getAll)

    leasesRouter.get('/:id', [
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
        leasesController.getById
    ])

    leasesRouter.post('/', leasesController.create)

    leasesRouter.delete('/:id', [
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
        leasesController.delete
    ])

    leasesRouter.patch('/:id', [
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
        leasesController.updateLease
    ])

    return leasesRouter
}