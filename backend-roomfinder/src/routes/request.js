import { Router } from "express"
import { param, validationResult } from "express-validator"
import { RequestController } from "../controller/request.js"

export const createRequestsRouter = ({ requestModel }) => {
    const requestRouter = Router()
    const requestController = new RequestController({ requestModel })

    /**
     * @swagger
     * tags:
     *  name: Reviews
     *  description: Reviews manage.
     */

    requestRouter.get('/', requestController.getAll)

    requestRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.getById
    ])

    requestRouter.get('/owner/:studentid', [
        param('studentid').isInt().withMessage('Student id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.getByOwner
    ])

    requestRouter.get('/leasor/:leasorid', [
        param('leasorid').isInt().withMessage('Leasor id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.getByLeasor
    ])

    requestRouter.get('/property/:propertyid', [
        param('propertyid').isInt().withMessage('Property id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.getByProperty
    ])

    requestRouter.get('/search/:studentid/:propertyid', [
        param('studentid').isInt().withMessage('Student id must be an integer'),
        param('propertyid').isInt().withMessage('Property id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.getByStudentAndProperty
    ])

    requestRouter.post('/', requestController.create)

    requestRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.delete
    ])

    requestRouter.patch('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        requestController.updateRequest
    ])

    return requestRouter
}