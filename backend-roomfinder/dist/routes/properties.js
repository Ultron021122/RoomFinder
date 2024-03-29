import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { PropertyController } from "../controller/properties.js";
export const createPropertiesRouter = ({
  propertieModel
}) => {
  const propertiesRouter = Router();
  const propertyController = new PropertyController({
    propertieModel
  });

  /**
   * @swagger
   * tags:
   *  name: Properties
   *  description: Properties manage.
   */

  propertiesRouter.get('/', propertyController.getAll);
  propertiesRouter.get('/:id', [param('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, propertyController.getById]);
  propertiesRouter.post('/', propertyController.create);
  propertiesRouter.delete('/:id', [param('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, propertyController.delete]);
  propertiesRouter.patch('/:id', [param('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, propertyController.updateProperty]);
  return propertiesRouter;
};