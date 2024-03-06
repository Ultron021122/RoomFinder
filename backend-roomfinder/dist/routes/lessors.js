import { Router } from "express";
import { LessorController } from '../controller/lessors.js';
export const createLessorsRouter = ({
  lessorModel
}) => {
  const lessorsRouter = Router();
  const lessorController = new LessorController({
    lessorModel
  });

  /**
   * @swagger
   * tags:
   *  name: Lessors
   *  description: Lessors manage.
   */

  /**
   * @swagger
   * /lessors:
   *  get:
   *      summary: Get all lessors.
   *      tags: [Lessors]
   *      description: List of lessors in database.
   *      responses:
   *          '200':
   *              description: A JSON array of lessor data
   */
  lessorsRouter.get('/', lessorController.getAll);
  lessorsRouter.get('/:id', lessorController.getById);
  lessorsRouter.post('/', lessorController.create);
  lessorsRouter.delete('/:id', lessorController.delete);
  lessorsRouter.patch('/:id', lessorController.updateLessor);
  return lessorsRouter;
};