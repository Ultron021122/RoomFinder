import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { LessorController } from '../controller/lessors.js';
export const createLessorsRouter = ({
  lessorModel
}) => {
  const lessorsRouter = Router();
  const lessorController = new LessorController({
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
   * /lessors:
   *  get:
   *      summary: Get all lessors.
   *      tags: [Lessors]
   *      description: List of lessors in database.
   *      responses:
   *          '200':
   *              description: A JSON array of lessor data
   */
  lessorsRouter.get('/', lessorController.getAll);
  lessorsRouter.get('/:id', [param('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, lessorController.getById]);
  lessorsRouter.post('/', lessorController.create);
  lessorsRouter.delete('/:id', [param('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, lessorController.delete]);
  lessorsRouter.patch('/:id', [param('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, lessorController.updateLessor]);
  return lessorsRouter;
};