import { Router } from "express";
import { UserController } from '../controller/users.js';
export const createUsersRouter = ({
  userModel
}) => {
  const usersRouter = Router();
  const userController = new UserController({
    userModel
  });

  /**
   * @swagger
   * tags:
   *  name: Users
   *  description: Users manage.
   */

  /**
   * @swagger
   * /users:
   *  get:
   *      summary: Get all users.
   *      tags: [Users]
   *      description: List of users in database
   *      responses:
   *          '200':
   *              description: A JSON array of user data
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: array
   *                          items:
   *                              type: object
   *                              properties:
   *                                  id:
   *                                      type: integer
   *                                      example: 1
   *                                  type_user:
   *                                      type: string
   *                                      example: student
   *                                  name:
   *                                      type: string
   *                                      example: johny
   *                                  last_name:
   *                                      type: string
   *                                      example: smith
   *                                  email:
   *                                      type: string
   *                                      example: correo@gmail.com
   *                                  password:
   *                                      type: string
   *                                      example: contraseña
   *                                  birthday:
   *                                      type: string
   *                                      example: 2000-01-12T06:00:00.000Z
   *                                  status:
   *                                      type: string
   *                                      example: inactive
   *                                  created_date:
   *                                      type: string
   *                                      example: 2024-01-22T04:15:16.000Z
   */
  usersRouter.get('/', userController.getAll);
  /**
   * @swagger
   * /users/{id}:
   *  get:
   *      summary: Get a user.
   *      tags: [Users]
   *      parameters:
   *          -   in: path
   *              name: id
   *              schema:
   *                  type: integer
   *              required: true
   *              description: User identifier.
   *      responses:
   *          '200':
   *              description: Returns a user.
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              id:
   *                                  type: integer
   *                                  example: 4
   *                              type_user:
   *                                  type: string
   *                                  example: student
   *                              name:
   *                                  type: string
   *                                  example: johny
   *                              last_name:
   *                                  type: string
   *                                  example: smith
   *                              email:
   *                                  type: string
   *                                  example: correo@gmail.com
   *                              password:
   *                                  type: string
   *                                  example: contraseña
   *                              birthday:
   *                                  type: string
   *                                  example: 2000-01-12T06:00:00.000Z
   *                              status:
   *                                  type: string
   *                                  example: inactive
   *                              created_date:
   *                                  type: string
   *                                  example: 2024-01-22T04:15:16.000Z
   *          '404':
   *              description: A user with the specified ID was not found.
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              message:
   *                                  type: string
   *                                  example: User not found
   *          default:
   *              description: Unexpected error
   */
  usersRouter.get('/:id', userController.getById);
  /**
   * @swagger
   * /users/type/{type_user}:
   *  get:
   *      summary: Get a lessor
   *      tags: [Users]
   */
  usersRouter.get('/type/:type_user', userController.getByUser);
  /**
   * @swagger
   * /users/login:
   *  post:
   *      summary: Login
   *      tags: [Users]
   */
  usersRouter.post('/login', userController.login);
  /**
   * @swagger
   * /users:
   *  post:
   *      summary: Post a user
   *      tags: [Users]
   */
  usersRouter.post('/', userController.create);
  /**
   * @swagger
   * /users/{id}:
   *  delete:
   *      summary: Delete a user
   *      tags: [Users]
   */
  usersRouter.delete('/:id', userController.delete);
  /**
   * @swagger
   * /users/{id}:
   *  patch:
   *      summary: Update a user
   *      tags: [Users]
   *      parameters:
   *          -   in: path
   *              name: id
   *              schema:
   *                  type: integer
   *              required: true
   *              description: User identifier.
   *      requestBody:
   *          required: true
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          type_user:
   *                              type: string
   *                          name:
   *                              type: string
   *                          last_name:
   *                              type: string
   *                          email:
   *                              type: string
   *                          password:
   *                              type: string
   *                          birthday:
   *                              type: string
   *                          status:
   *                              type: string
   *      responses:
   *          '200':
   *              description: Return a user.
   */
  usersRouter.patch('/:id', userController.updateUser);
  return usersRouter;
};