"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StudentController = void 0;
var _student = require("../schemas/student.js");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class StudentController {
  constructor({
    studentModel
  }) {
    this.studentModel = studentModel;
  }
  getAll = async (req, res, next) => {
    try {
      const student = await this.studentModel.getAll();
      return res.json(student);
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  };
  getById = async (req, res, next) => {
    const {
      id
    } = req.params;
    await this.studentModel.getById({
      id
    }).then(student => {
      if (student) return res.json(student);
      return res.status(404).json({
        message: 'Student not found'
      });
    }).catch(next); // Pass the error to the error handler
  };
  create = async (req, res, next) => {
    const result = (0, _student.validateStudent)(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    // Encrypt password
    const salt = await _bcrypt.default.genSalt(10);
    const hashedPassword = await _bcrypt.default.hash(result.data.password, salt);
    result.data.password = hashedPassword;
    await this.studentModel.create({
      input: result.data
    }).then(newStudent => {
      if (newStudent === false) return res.status(409).json({
        message: 'Email already exists'
      });
      return res.status(201).json(newStudent);
    }).catch(next); // Catch the error
  };
  delete = async (req, res, next) => {
    const {
      id
    } = req.params;
    await this.studentModel.delete({
      id
    }).then(result => {
      if (result == false) {
        return res.status(400).json({
          message: 'Student not found.'
        });
      }
      return res.json({
        message: 'Student deleted'
      });
    }).catch(next);
  };
  updateStudent = async (req, res, next) => {
    const result = (0, _student.validatePartialStudent)(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    if (result.data.password) {
      const salt = await _bcrypt.default.genSalt(10);
      const hashedPassword = await _bcrypt.default.hash(result.data.password, salt);
      result.data.password = hashedPassword;
    }
    const {
      id
    } = req.params;
    await this.studentModel.update({
      id,
      input: result.data
    }).then(updateStudent => {
      if (updateStudent === false) return res.status(409).json({
        message: 'Email already exists'
      });
      if (!updateStudent) return res.status(404).json({
        message: 'Student not found'
      });
      return res.json(updateStudent);
    }).catch(next);
  };
}
exports.StudentController = StudentController;