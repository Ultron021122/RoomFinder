import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { StatusController } from "../controller/request-status.js";

export const createStatusRouter = ({ statusModel }) => {
    const statusRouter = Router()
    const statusController = new StatusController({ statusModel })

    /**
     * @swagger
     * tags:
     *  name: Status
     *  description: Status manage.
     */
    
    statusRouter.get('/', statusController.getAll)

    return statusRouter
}