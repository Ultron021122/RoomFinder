import { Router } from "express";
import { StudentController } from '../controller/students.js';
export const createStudentsRouter = ({
  studentModel
}) => {
  const studentsRouter = Router();
  const studentController = new StudentController({
    studentModel
  });
  studentsRouter.get('/', studentController.getAll);
  studentsRouter.get('/:id', studentController.getById);
  studentsRouter.post('/', studentController.create);
  studentsRouter.delete('/:id', studentController.delete);
  studentsRouter.patch('/:id', studentController.updateStudent);
  return studentsRouter;
};