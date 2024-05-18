import { validateStudent, validatePartialStudent } from '../schemas/student.js'
import bcrypt from 'bcrypt'

export class StudentController {
    constructor({ studentModel }) {
        this.studentModel = studentModel
    }

    getAll = async (req, res, next) => {
        try {
            const student = await this.studentModel.getAll()
            return res.json(student)
        } catch (err) {
            next(err); // Pass the error to the error handler
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.studentModel.getById({ id })
            .then(student => {
                if (student) return res.json(student)
                return res.status(404).json({ message: 'Student not found' })
            })
            .catch(next); // Pass the error to the error handler
    }

    create = async (req, res, next) => {
        console.log(req.body)
        const result = validateStudent(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.data.vchpassword, salt);
        result.data.vchpassword = hashedPassword;

        await this.studentModel.create({ input: result.data })
            .then(newStudent => {
                if (newStudent === false) return res.status(409).json({ message: 'Email already exists' })
                return res.status(201).json(newStudent)
            })
            .catch(next); // Catch the error
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.studentModel.delete({ id })
            .then(result => {
                if (result == false) {
                    return res.status(400).json({ message: 'Student not found.' })
                }
                return res.json({ message: 'Student deleted' })
            })
            .catch(next);
    }

    updateStudent = async (req, res, next) => {
        const result = validatePartialStudent(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        if (result.data.vchpassword) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(result.data.vchpassword, salt)
            result.data.vchpassword = hashedPassword
        }
        const { id } = req.params
        await this.studentModel.update({ id, input: result.data })
            .then(updateStudent => {
                if (updateStudent === false) return res.status(409).json({ message: 'Email already exists' })
                if (!updateStudent) return res.status(404).json({ message: 'Student not found' })
                return res.json(updateStudent)
            })
            .catch(next);
    }
}