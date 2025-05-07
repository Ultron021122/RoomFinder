import { Router } from "express";
import { param, validationResult } from 'express-validator';
import { TasksController } from "../controller/tasks.js";

export const createTasksRouter = ({ tasksModel }) => {
    const tasksRouter = Router()
    const tasksController = new TasksController({ tasksModel })

    /**
     * @swagger
     * tags:
     *  name: Tasks
     *  description: Tasks manage.
     */

    /**
     * @swagger
     * /api/tasks/:
     *  get:
     *      summary: Get all tasks.
     *      tags: [Tasks]
     */
    tasksRouter.get('/', tasksController.setLeasesStatus)

    return tasksRouter
}