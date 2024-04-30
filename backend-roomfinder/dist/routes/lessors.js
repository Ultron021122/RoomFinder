"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLessorsRouter = void 0;
var _express = require("express");
var _expressValidator = require("express-validator");
var _lessors = require("../controller/lessors.js");
const createLessorsRouter = ({
  lessorModel
}) => {
  const lessorsRouter = (0, _express.Router)();
  const lessorController = new _lessors.LessorController({
    lessorModel
  });

  /**
   * @swagger
   * tags:
   *  name: Lessors
   *  description: Lessors manage.
   */

  /**
   * @swagger
   * /api/lessors:
   *  get:
   *      summary: Get all lessors.
   *      tags: [Lessors]
   *      description: List of lessors in database.
   *      responses:
   *          '200':
   *              description: A JSON array of lessor data
   */
  lessorsRouter.get('/', lessorController.getAll);
  lessorsRouter.get('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, lessorController.getById]);
  lessorsRouter.post('/', lessorController.create);
  lessorsRouter.delete('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, lessorController.delete]);
  lessorsRouter.patch('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, lessorController.updateLessor]);
  return lessorsRouter;
};
exports.createLessorsRouter = createLessorsRouter;