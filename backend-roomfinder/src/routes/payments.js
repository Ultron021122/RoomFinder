import { Router } from "express"
import { param, validationResult } from "express-validator"
import { PaymentController } from "../controller/payments.js"

export const createPaymentRouter = ({ paymentModel }) => {
    const paymentRouter = Router()
    const paymentController = new PaymentController({ paymentModel })

    /**
     * @swagger
     * tags:
     *  name: Payments
     *  description: Payments manage.
     */

    paymentRouter.get('/', paymentController.getAll)

    paymentRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentController.getById
    ])

    paymentRouter.get('/leases/:id', [
        param('id').isInt().withMessage('ID id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentController.getByLeases
    ])

    paymentRouter.post('/', paymentController.create)

    paymentRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentController.delete
    ])

    paymentRouter.patch('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentController.updatePayment
    ])

    return paymentRouter
}