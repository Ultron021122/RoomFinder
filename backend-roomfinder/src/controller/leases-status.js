export class LeaseStatusController {
    constructor({ leasestatusModel }) {
        this.leasestatusModel = leasestatusModel;
    }

    getAll = async (req, res, next) => {
        try {
            const status = await this.leasestatusModel.getAll()
            return res.json(status);
        } catch (err) {
            next(err);
        }
    }
}