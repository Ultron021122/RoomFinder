import { validateProperty, validatePartialProperty } from '../schemas/property.js';
export class PropertyController {
  constructor({
    propertieModel
  }) {
    this.propertieModel = propertieModel;
  }
  getAll = async (req, res, next) => {
    await this.propertieModel.getAll().then(properties => {
      return res.json(properties);
    }).catch(next);
  };
  getById = async (req, res, next) => {
    const {
      id
    } = req.params;
    await this.propertieModel.getById({
      id
    }).then(propertie => {
      if (propertie) return res.json(propertie);
      return res.status(404).json({
        message: 'User not found'
      });
    }).catch(next);
  };
  create = async (req, res, next) => {
    const result = validateProperty(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    await this.propertieModel.create({
      input: result.data
    }).then(newProperty => {
      if (newProperty === false) return res.status(409).json({
        message: 'Property already exists'
      });
      return res.status(201).json(newProperty);
    }).catch(next);
  };
  delete = async (req, res, next) => {
    const {
      id
    } = req.params;
    await this.propertieModel.delete({
      id
    }).then(result => {
      if (result === false) return res.status(404).json({
        message: 'Property not found'
      });
      return res.json({
        message: 'Property deleted'
      });
    }).catch(next);
  };
  updateProperty = async (req, res, next) => {
    const result = validatePartialProperty(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    const {
      id
    } = req.params;
    await this.propertieModel.update({
      id,
      input: result.data
    }).then(updateProperty => {
      if (updateProperty === false) return res.status(409).json({
        message: 'Property already exists'
      });
      if (!updateProperty) return res.status(404).json({
        message: 'Property not found'
      });
      return res.json(updateProperty);
    }).catch(next);
  };
}