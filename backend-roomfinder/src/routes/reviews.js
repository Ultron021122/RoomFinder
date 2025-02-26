import { Router } from "express"
import { ReviewController } from "../controller/reviews.js"
import { param, validationResult } from "express-validator"

export const createReviewsRouter = ({ reviewModel }) => {
    const reviewsRouter = Router()
    const reviewController = new ReviewController({ reviewModel })

    /**
     * @swagger
     * tags:
     *  name: Reviews
     *  description: Reviews manage.
     */

    reviewsRouter.get('/', reviewController.getAll)

    reviewsRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        reviewController.getById
    ])

    reviewsRouter.get('/owner/:studentid', [
        param('studentid').isInt().withMessage('Student id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        reviewController.getByOwner
    ])

    reviewsRouter.get('/property/:propertyid', [
        param('propertyid').isInt().withMessage('Property id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        reviewController.getByProperty
    ])

    reviewsRouter.post('/', reviewController.create)

    reviewsRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        reviewController.delete
    ])

    reviewsRouter.patch(':/id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        reviewController.updateReview
    ])

    return reviewsRouter
}