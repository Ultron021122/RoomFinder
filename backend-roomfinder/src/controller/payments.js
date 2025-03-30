import { validatePartialPayment, validatePayment } from "../schemas/payment.js";
import { EmailService } from "../server/email.js"

export class PaymentController {
    constructor({ paymentModel }) {
        this.paymentModel = paymentModel
        this.EmailService = new EmailService();
    }

    getAll = async (req, res, next) => {
        try {
            const payment = await this.paymentModel.getAll()
            return res.json(payment)
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.paymentModel.getById({ id })
            .then(payment => {
                if (payment) return res.json(payment)
                return res.status(404).json({ message: 'Payment not found' })
            })
            .catch(next);
    }

    getByLeases = async (req, res, next) => {
        const { id } = req.params
        await this.paymentModel.getByLeases({ leasesid: id })
            .then(student => {
                if (student) return res.json(student)
                return res.status(404).json({ message: 'Payment not found' })
            })
            .catch(next);
    }

    create = async (req, res, next) => {
        const result = validatePayment(req.body)
        if (result.error) {
            return res.status(404).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const newPayment = await this.paymentModel.create({ input: result.data });
            if (newPayment === false) return res.status(409).json({ message: 'Payment already exists' });

            // await this.EmailService.sendRequestLeasor({ input: newPayment });
            return res.status(201).json(newPayment)
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.paymentModel.delete({ id })
            .then(result => {
                if (result === false) return res.status(404).json({ message: 'Payment not found' })
                return res.json({ message: 'Payment deleted' })
            })
            .catch(next);
    }

    updatePayment = async (req, res, next) => {
        const result = validatePartialPayment(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const { id } = req.params
        await this.paymentModel.update({ id, input: result.data })
            .then(updatePayment => {
                if (!updatePayment) return res.status(404).json({ message: 'Payment not found' })
                return res.json(updatePayment)
            })
            .catch(next);
    }
}