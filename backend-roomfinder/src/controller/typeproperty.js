import { validateTypeProperty, validatePartialTypeProperty } from "../schemas/typeproperty.js";

export class TypePropertyController {
    constructor({ typePropertyModel }) {
        this.typePropertyModel = typePropertyModel;
    }

    getAll = async (req, res, next) => {
        try {
            const typeProperties = await this.typePropertyModel.getAll()
            return res.json(typeProperties);
        } catch (err) {
            next(err);
        }
    }
}