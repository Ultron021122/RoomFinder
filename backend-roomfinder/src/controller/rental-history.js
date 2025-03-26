export class RentalHistoryController {
    constructor({ rentalHistoryModel }) {
        this.rentalHistoryModel = rentalHistoryModel;
    }

    getAll = async (req, res, next) => {
        try {
            const rentalHistory = await this.rentalHistoryModel.getAll()
            return res.json(rentalHistory)
        } catch (err) {
            next(err)
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.rentalHistoryModel.getById({ id })
            .then(rental => {
                if (rental) return res.json(rental)
                return res.status(404).json({ message: 'Rental History not found' })
            })
            .catch(next);
    }

    getByStudentId = async (req, res, next) => {
        const { studentid } = req.params
        await this.rentalHistoryModel.getByStudentId({ studentid })
            .then(rental => {
                if (rental) return res.json(rental)
                return res.status(404).json({ message: 'Rental History not found' })
            })
            .catch(next);
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.rentalHistoryModel.delete({ id })
            .then(result => {
                if (result == false) return res.status(400).json({ message: 'Rental History not found.' })
                return res.json({ message: 'Rental History deleted' })
            })
            .catch(next);
    }
}