// Lack validation for the input

export class VerifiedController {
    constructor({ verifiedModel }) {
        this.verifiedModel = verifiedModel;
    }

    getAll = async (req, res, next) => {
        try {
            const verified = await this.verifiedModel.getAll()
            return res.json(verified);
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.verifiedModel.getById({ id })
            .then(verified => {
                if (verified) return res.json(verified)
                return res.status(404).json({ message: 'Verified not found' })
            })
            .catch(next);
    }

    getByToken = async (req, res, next) => {
        const { token } = req.params
        await this.verifiedModel.getByToken({ token })
            .then(verified => {
                if (verified) return res.json(verified)
                return res.status(404).json({ message: 'Verified not found' })
            })
            .catch(next);
    }
    
}