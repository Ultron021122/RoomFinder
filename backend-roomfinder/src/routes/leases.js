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

    leasesRouter.get('/property/:propertyid', [
        // Validation
        param('propertyid').isInt().withMessage('propertyid must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        leasesController.getByPropertyId
    ])

    leasesRouter.get('/lessor/:lessorid', [
        // Validation
        param('lessorid').isInt().withMessage('lessorid must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        leasesController.getByLessorId
    ])

    leasesRouter.get('/student/:studentid', [
        // Validation
        param('studentid').isInt().withMessage('studentid must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        leasesController.getByStudentId
    ])

    leasesRouter.get('/lease-number/:lease_number', [
        // Validation
        param('lease_number').isInt().withMessage('lease_number must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        leasesController.getByLeaseNumber
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