import { validateLessor, validatePartialLessor } from "../schemas/lessor.js"
import bcrypt from 'bcrypt'

export class LessorController {
    constructor({ lessorModel }) {
        this.lessorModel = lessorModel
    }

    getAll = async (req, res) => {
        const lessor = await this.lessorModel.getAll()
        res.json(lessor)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const lessor = await this.lessorModel.getById({ id })
        if (lessor) return res.json(lessor)
        res.status(404).json({ message: 'Lessor not found' })
    }

    create = async (req, res) => {
        const result = validateLessor(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.data.password, salt);
        result.data.password = hashedPassword;

        const newLessor = await this.lessorModel.create({ input: result.data })
        if (newLessor === false) return res.status(409).json({ message: 'Email already exists'})
        res.status(201).json(newLessor)
    }

    delete = async (req, res) => {
        const { id } = req.params
        const result = await this.lessorModel.delete({ id })
        if (result == false) {
            return res.status(400).json({ message: 'Lessor not found.' })
        }
        return res.json({ message: 'Lessor deleted' })
    }

    updateLessor = async (req, res) => {
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
        const updateLessor = await this.lessorModel.update({ id, input: result.data })
        if (updateLessor === false) return res.status(409).json({ message: 'Email already exists' })
        if (!updateLessor) return res.status(404).json({ message: 'Lessor not found' })
        return res.json(updateLessor)
    }
}