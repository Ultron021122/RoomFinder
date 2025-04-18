import { validateLeases, validatePartialLeases } from "../schemas/leases.js";
import { EmailService } from "../server/email.js";


export class LeasesController {
    constructor({ leasesModel }) {
        this.leasesModel = leasesModel;
        this.EmailService = new EmailService();
    }

    getAll = async (req, res, next) => {
        try {
            const leases = await this.leasesModel.getAll()
            return res.json(leases);
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.leasesModel.getById({ id })
            .then(lease => {
                if (lease) return res.json(lease);
                return res.status(404).json({ message: 'Lease not found ' })
            })
            .catch(next);
    }

    create = async (req, res, next) => {
        const result = validateLeases(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const newLeases = await this.leasesModel.create({ input: result.data });
            if (newLeases === false) return res.status(409).json({ message: 'Lease already exists' });

            // Add logic to send email
            // await this.EmailService.sendEmailNotification();

            return res.status(201).json(newLeases);
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.leasesModel.delete({ id })
            .then(result => {
                if (result === false) return res.status(404).json({ message: 'Lease not found' })
                return res.json({ message: 'Lease deleted' })
            })
            .catch(next);
    }

    updateLease = async (req, res, next) => {
        const result = validatePartialLeases(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message)})
        }

        const { id } = req.params
        await this.leasesModel.update({ id, input: result.data })
            .then(updateLease => {
                if (updateLease === false) return res.status(409).json({ message: 'Bad request'});
                if (!updateLease) return res.status(404).json({ message: 'Lease not found'})
                return res.json(updateLease)
            })
            .catch(next);
    }
}