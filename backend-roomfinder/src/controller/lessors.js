import { validateLessor, validatePartialLessor } from "../schemas/lessor.js"
import bcrypt from 'bcrypt'

export class LessorController {
    constructor({ lessorModel }) {
        this.lessorModel = lessorModel
    }

    getAll = async (req, res, next) => {
        try {
            const lessor = await this.lessorModel.getAll()
            return res.json(lessor)
        } catch (err) {
            next(err)
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.lessorModel.getById({ id })
            .then(lessor => {
                if (lessor) return res.json(lessor)
                return res.status(404).json({ message: 'Lessor not found' })
            })
            .catch(next);
    }

    create = async (req, res, next) => {
        const result = validateLessor(req.body)
        if (result.error) {
            console.log(result.error)
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.data.password, salt);
        result.data.password = hashedPassword;

        await this.lessorModel.create({ input: result.data })
            .then(newLessor => {
                if (newLessor === false) return res.status(409).json({ message: 'Email already exists' })
                return res.status(201).json(newLessor)
            })
            .catch(next);
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.lessorModel.delete({ id })
            .then(result => {
                if (result == false) return res.status(400).json({ message: 'Lessor not found.' })
                return res.json({ message: 'Lessor deleted' })
            })
            .catch(next);
    }

    updateLessor = async (req, res, next) => {
        const result = validatePartialLessor(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        if (result.data.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(result.data.password, salt)
            result.data.password = hashedPassword
        }
        const { id } = req.params
        await this.lessorModel.update({ id, input: result.data })
            .then(updateLessor => {
                if (updateLessor === false) return res.status(409).json({ message: 'Email already exists' })
                if (!updateLessor) return res.status(404).json({ message: 'Lessor not found' })
                return res.json(updateLessor)
            })
            .catch(next);
    }
}