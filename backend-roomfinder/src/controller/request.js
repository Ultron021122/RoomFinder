import { validatePartialRequest, validateRequest } from "../schemas/request.js";
import { EmailService } from "../server/email.js";

export class RequestController {
    constructor({ requestModel }) {
        this.requestModel = requestModel;
        this.EmailService = new EmailService();
    }

    getAll = async (req, res, next) => {
        try {
            const requests = await this.requestModel.getAll()
            return res.json(requests);
        } catch (err) {
            next(err);
        }
    }

    getByOwner = async (req, res, next) => {
        try {
            const { studentid } = req.params

            const requests = await this.requestModel.getByOwner({ studentid })
            if (requests) return res.json(requests)
            return res.status(404).json({ message: 'Requests not found' });
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.requestModel.getById({ id })
            .then(request => {
                if (request) return res.json(request)
                return res.status(404).json({ message: 'Request not found' })
            })
            .catch(next);
    }

    getByLeasor = async (req, res, next) => {
        const { leasorid } = req.params
        await this.requestModel.getByLeasor({ leasorid })
            .then(request => {
                if (request) return res.json(request)
                return res.status(404).json({ message: 'Request not found' })
            })
            .catch(next);
    }

    getByProperty = async (req, res, next) => {
        const { propertyid } = req.params
        await this.requestModel.getByProperty({ propertyid })
            .then(request => {
                if (request) return res.json(request)
                return res.status(404).json({ message: 'Requests not found' })
            })
            .catch(next);
    }

    getByStudentAndProperty = async (req, res, next) => {
        const { studentid, propertyid } = req.params
        await this.requestModel.getByStudentAndProperty({ studentid, propertyid })
            .then(request => {
                if (request) return res.json(request)
                return res.status(404).json({ message: 'Request not found' })
            })
            .catch(next);
    }

    create = async (req, res, next) => {
        const result = validateRequest(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const newRequest = await this.requestModel.create({ input: result.data });
            if (newRequest === false) return res.status(409).json({ message: 'Request already exists' });

            await this.EmailService.sendRequestLeasor({ input: newRequest });
            return res.status(201).json(newRequest)
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.requestModel.delete({ id })
            .then(result => {
                if (result === false) return res.status(404).json({ message: 'Request not found' })
                return res.json({ message: 'Request deleted' })
            })
            .catch(next);
    }

    updateRequest = async (req, res, next) => {
        const result = validatePartialRequest(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const { id } = req.params

        try {
            const request = await this.requestModel.update({ id, input: result.data })
            if (!request) return res.status(404).json({ message: 'Request not found' })

            if (request.statusid === 1) {
                await this.EmailService.sendRequestAccepted({ input: request });
            } else {
                await this.EmailService.sendNotificationUpdateStatus({ input: request });
            }


            return res.json(request)
        } catch (err) {
            next(err);
        }
    }
}