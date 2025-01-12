import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { TypePropertyController } from "../controller/typeproperty.js";

export const createTypePropertyRouter = ({ typePropertyModel }) => {
    const typePropertyRouter = Router()
    const typePropertyController = new TypePropertyController({ typePropertyModel })

    /**
     * @swagger
     * tags:
     *  name: TypeProperties
     *  description: TypeProperties manage.
     */
    
    typePropertyRouter.get('/', typePropertyController.getAll)

    return typePropertyRouter
}