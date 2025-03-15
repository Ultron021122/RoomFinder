import { validatePartialReview, validateReview } from "../schemas/reviews.js";
import { EmailService } from "../server/email.js";

export class ReviewController {
    constructor({ reviewModel }) {
        this.reviewModel = reviewModel;
        this.EmailService = new EmailService();
    }

    getAll = async (req, res, next) => {
        try {
            const reviews = await this.reviewModel.getAll()
            return res.json(reviews);
        } catch (err) {
            next(err);
        }
    }

    getByOwner = async (req, res, next) => {
        try {
            const { studentid } = req.params

            const reviews = await this.reviewModel.getByOwner({ studentid })
            if (reviews) return res.json(reviews)
            return res.status(404).json({ message: 'Reviews not found' });
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.reviewModel.getById({ id })
            .then(review => {
                if (review) return res.json(review)
                return res.status(404).json({ message: 'Review not found' })
            })
            .catch(next);
    }

    getByProperty = async (req, res, next) => {
        const { propertyid } = req.params
        await this.reviewModel.getByProperty({ propertyid })
            .then(review => {
                if (review) return res.json(review)
                return res.status(404).json({ message: 'Reviews not found' })
            })
            .catch(next);
    }

    create = async (req, res, next) => {
        const result = validateReview(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const newReview = await this.reviewModel.create({ input: result.data });
            if (newReview === false) return res.status(409).json({ message: 'Review already exists' });
            return res.status(201).json(newReview)
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.reviewModel.delete({ id })
            .then(result => {
                if (result === false) return res.status(404).json({ message: 'Review not found' })
                return res.json({ message: 'Review deleted' })
            })
            .catch(next);
    }

    updateReview = async (req, res, next) => {
        const result = validatePartialReview(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const { id } = req.paramsF
        await this.reviewModel.update({ id, input: result.data})
            .then(updateReview => {
                if (!updateReview)  return res.status(404).json({ message: 'Review not found'})
                return res.json(updateReview)
            })
            .catch(next);
    }
}