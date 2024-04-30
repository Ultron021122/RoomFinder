"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStudentsRouter = void 0;
var _express = require("express");
var _expressValidator = require("express-validator");
var _students = require("../controller/students.js");
const createStudentsRouter = ({
  studentModel
}) => {
  const studentsRouter = (0, _express.Router)();
  const studentController = new _students.StudentController({
    studentModel
  });

  /**
   * @swagger
   * tags:
   *  name: Students
   *  description: Students manage.
   */

  studentsRouter.get('/', studentController.getAll);
  studentsRouter.get('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, studentController.getById]);
  studentsRouter.post('/', studentController.create);
  studentsRouter.delete('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, studentController.delete]);
  studentsRouter.patch('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, studentController.updateStudent]);
  return studentsRouter;
};
exports.createStudentsRouter = createStudentsRouter;