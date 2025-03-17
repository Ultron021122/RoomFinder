export class StatusController {
    constructor({ statusModel }) {
        this.statusModel = statusModel;
    }

    getAll = async (req, res, next) => {
        try {
            const status = await this.statusModel.getAll()
            return res.json(status);
        } catch (err) {
            next(err);
        }
    }
}