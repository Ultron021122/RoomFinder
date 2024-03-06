import { Router } from "express"
import { PropertyController } from "../controller/properties.js"

export const createPropertiesRouter = ({ propertieModel }) => {
    const propertiesRouter = Router()
    const propertyController = new PropertyController({ propertieModel })

    propertiesRouter.get('/', propertyController.getAll)
    propertiesRouter.get('/:id', propertyController.getById)
    propertiesRouter.post('/', propertyController.create)
    propertiesRouter.delete('/:id', propertyController.delete)
    propertiesRouter.patch('/:id', propertyController.updateProperty)

    return propertiesRouter
}