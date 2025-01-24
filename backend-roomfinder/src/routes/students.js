import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { StudentController } from '../controller/students.js';

export const createStudentsRouter = ({ studentModel }) => {
    const studentsRouter = Router()
    const studentController = new StudentController({ studentModel })

    /**
     * @swagger
     * tags:
     *  name: Students
     *  description: Students manage.
     */

    studentsRouter.get('/', studentController.getAll)
    studentsRouter.get('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        studentController.getById
    ])
    studentsRouter.get('/chat/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        studentController.getByChat
    ])
    studentsRouter.post('/', studentController.create)
    studentsRouter.delete('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        studentController.delete
    ])
    studentsRouter.patch('/:id', [
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        studentController.updateStudent
    ])

    return studentsRouter
}
