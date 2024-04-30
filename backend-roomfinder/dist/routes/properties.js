"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPropertiesRouter = void 0;
var _express = require("express");
var _expressValidator = require("express-validator");
var _properties = require("../controller/properties.js");
const createPropertiesRouter = ({
  propertieModel
}) => {
  const propertiesRouter = (0, _express.Router)();
  const propertyController = new _properties.PropertyController({
    propertieModel
  });

  /**
   * @swagger
   * tags:
   *  name: Properties
   *  description: Properties manage.
   */

  propertiesRouter.get('/', propertyController.getAll);
  propertiesRouter.get('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, propertyController.getById]);
  propertiesRouter.post('/', propertyController.create);
  propertiesRouter.delete('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, propertyController.delete]);
  propertiesRouter.patch('/:id', [(0, _expressValidator.param)('id').isInt().withMessage('id must be an integer'), (req, res, next) => {
    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  }, propertyController.updateProperty]);
  return propertiesRouter;
};
exports.createPropertiesRouter = createPropertiesRouter;