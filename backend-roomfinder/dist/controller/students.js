import { validateStudent, validatePartialStudent } from '../schemas/student.js';
import bcrypt from 'bcrypt';
export class StudentController {
  constructor({
    studentModel
  }) {
    this.studentModel = studentModel;
  }
  getAll = async (req, res) => {
    const student = await this.studentModel.getAll();
    res.json(student);
  };
  getById = async (req, res) => {
    const {
      id
    } = req.params;
    const student = await this.studentModel.getById({
      id
    });
    if (student) return res.json(student);
    res.status(404).json({
      message: 'Student not found'
    });
  };
  create = async (req, res) => {
    const result = validateStudent(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(result.data.password, salt);
    result.data.password = hashedPassword;
    const newStudent = await this.studentModel.create({
      input: result.data
    });
    if (newStudent === false) return res.status(409).json({
      message: 'Email already exists'
    });
    res.status(201).json(newStudent);
  };
  delete = async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.studentModel.delete({
      id
    });
    if (result == false) {
      return res.status(400).json({
        message: 'Student not found.'
      });
    }
    return res.json({
      message: 'Student deleted'
    });
  };
  updateStudent = async (req, res) => {
    const result = validatePartialStudent(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    if (result.data.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(result.data.password, salt);
      result.data.password = hashedPassword;
    }
    const {
      id
    } = req.params;
    const updateStudent = await this.studentModel.update({
      id,
      input: result.data
    });
    if (updateStudent === false) return res.status(409).json({
      message: 'Email already exists'
    });
    if (!updateStudent) return res.status(404).json({
      message: 'Student not found'
    });
    return res.json(updateStudent);
  };
}