import { validateProperty, validatePartialProperty } from '../schemas/property.js';
export class PropertyController {
  constructor({
    propertieModel
  }) {
    this.propertieModel = propertieModel;
  }
  getAll = async (req, res) => {
    const properties = await this.propertieModel.getAll();
    res.json(properties);
  };
  getById = async (req, res) => {
    const {
      id
    } = req.params;
    const propertie = await this.propertieModel.getById({
      id
    });
    if (propertie) return res.json(propertie);
    res.status(404).json({
      message: 'User not found'
    });
  };
  create = async (req, res) => {
    const result = req.body;
    const newProperty = await this.propertieModel.create({
      input: result
    });
    res.status(201).json(newProperty);
  };
  delete = async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.propertieModel.delete({
      id
    });
    if (result == false) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }
    return res.json({
      message: 'User deleted'
    });
  };
  updateProperty = async (req, res) => {
    const result = validatePartialProperty(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    const {
      id
    } = req.params;
    const updateProperty = await this.propertieModel.update({
      id,
      input: result.data
    });
    return res.json(updateProperty);
  };
}