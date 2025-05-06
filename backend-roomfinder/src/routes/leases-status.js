import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { LeaseStatusController } from "../controller/leases-status.js";

export const createLeaseStatusRouter = ({ leasestatusModel }) => {
    const leaseStatusRouter = Router()
    const leaseStatusController = new LeaseStatusController({ leasestatusModel })

    /**
     * @swagger
     * tags:
     *  name: Status
     *  description: Status manage.
     */

    leaseStatusRouter.get('/', leaseStatusController.getAll)

    return leaseStatusRouter
}