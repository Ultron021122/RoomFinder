import { Router } from "express"
import { param, validationResult } from "express-validator"
import { PaymentOrderController } from "../controller/payments-orders.js"

export const createPaymentOrderRouter = ({ paymentOrderModel }) => {
    const paymentOrderRouter = Router()
    const paymentOrderController = new PaymentOrderController({ paymentOrderModel })

    /**
     * @swagger
     * tags:
     *  name: Payments Orders
     *  description: Payments orders manage.
     */

    paymentOrderRouter.get('/', paymentOrderController.getAll)

    paymentOrderRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentOrderController.getById
    ])

    paymentOrderRouter.get('/leases/:id', [
        param('id').isInt().withMessage('ID id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentOrderController.getByLeases
    ])

    paymentOrderRouter.post('/', paymentOrderController.create)

    paymentOrderRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentOrderController.delete
    ])

    paymentOrderRouter.put('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        paymentOrderController.update
    ])

    return paymentOrderRouter
}