import { validateRecovery, validatePartialRecovery } from "../schemas/recoverypass.js";

export class RecoveryPassController {
    constructor({ recoveryPassModel }) {
        this.recoveryPassModel = recoveryPassModel;
    }

    getAll = async (req, res, next) => {
        try {
            const recovery = await this.recoveryPassModel.getAll();
            return res.json(recovery);
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params;
        await this.recoveryPassModel.getById({ id })
            .then(recovery => {
                if (recovery) return res.json(recovery);
                return res.status(404).json({ message: 'Recovery not found' });
            })
            .catch(next);
    }

    getByToken = async (req, res, next) => {
        const { token } = req.params;
        await this.recoveryPassModel.getByToken({ token })
            .then(recovery => {
                if (recovery) return res.json(recovery);
                return res.status(404).json({ message: 'Recovery not found' });
            })
            .catch(next);
    }

    getByUser = async (req, res, next) => {
        const { id } = req.params;
        await this.recoveryPassModel.getByUser({ id })
            .then(recovery => {
                if (recovery) return res.json(recovery);
                return res.status(404).json({ message: 'Recovery not found' });
            })
            .catch(next);
    }

    create = async (req, res, next) => {
        const result = validateRecovery(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        await this.recoveryPassModel.create({ input: result.data })
            .then(recovery => {
                if (recovery) return res.status(201).json(recovery);
                return res.status(400).json({ message: 'Recovery not created' });
            })
            .catch(next);
    }

    update = async (req, res, next) => {
        const result = validateRecovery(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const { id } = req.params;
        await this.recoveryPassModel.update({ id, input: result.data })
            .then(recovery => {
                if (recovery) return res.json(recovery);
                return res.status(400).json({ message: 'Recovery not updated' });
            })
            .catch(next);
    }

    delete = async (req, res, next) => {
        const { id } = req.params;
        await this.recoveryPassModel.delete({ id })
            .then(recovery => {
                if (recovery) return res.json({ message: 'Recovery deleted' });
                return res.status(400).json({ message: 'Recovery not deleted' });
            })
            .catch(next);
    }

}