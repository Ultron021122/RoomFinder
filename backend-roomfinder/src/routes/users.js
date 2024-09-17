import { Router } from "express"
import { param, validationResult } from 'express-validator'
import { UserController } from '../controller/users.js'

export const createUsersRouter = ({ userModel }) => {
    const usersRouter = Router()
    const userController = new UserController({ userModel })

    /**
     * @swagger
     * tags:
     *  name: Users
     *  description: Users manage.
     */

    /**
     * @swagger
     * /api/users:
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
     *                                  image:
     *                                      type: string
     *                                      example: https://www.google.com
     *                                  created_date:
     *                                      type: string
     *                                      example: 2024-01-22T04:15:16.000Z
     */
    usersRouter.get('/', userController.getAll)
    /**
     * @swagger
     * /api/users/{id}:
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
     *                              image:
     *                                  type: string
     *                                  example: https://www.google.com
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
    usersRouter.get('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        userController.getById
    ])
        /**
     * @swagger
     * /api/users/images/{id}:
     *  get:
     *      summary: Get images of a user.
     *      tags: [Users]
     */
    usersRouter.get('/images/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        userController.getImages
    ])
    /**
     * @swagger
     * /api/users/type/{roleid}:
     *  get:
     *      summary: Get a lessor
     *      tags: [Users]
     */
    usersRouter.get('/type/:roleid', [
        // Validation
        param('roleid').isInt().withMessage('roleid must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        userController.getByUser
    ])
    /**
     * @swagger
     * /api/users/verify/{id}/{token}:
     *  get:
     *      summary: Verify user althoug email
     *      tags: [Users]
     */
    usersRouter.get('/verify/:id/:token', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        param('token').isString().withMessage('token must be a string'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        userController.verifyEmail
    ])
    /**
     * @swagger
     * /api/users/logout:
     *  post:
     *      summary: Logout
     *      tags: [Users]
     */
    usersRouter.post('/logout', userController.logout)
    /**
     * @swagger
     * /api/users/forgot:
     *  post:
     *      summary: Forgot password
     *      tags: [Users]
     */
    usersRouter.post('/forgot', userController.recoveryPassword)
    /**
     * @swagger
     * /api/users/login:
     *  post:
     *      summary: Login
     *      tags: [Users]
     */
    usersRouter.post('/login', userController.login)
    /**
     * @swagger
     * /api/users:
     *  post:
     *      summary: Post a user
     *      tags: [Users]
     */
    usersRouter.post('/', userController.create)
    /**
     * @swagger
     * /api/users/{id}:
     *  delete:
     *      summary: Delete a user by id.
     *      tags: [Users]
     */
    usersRouter.delete('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        userController.delete
    ])
    /**
     * @swagger
     * /api/users/{id}:
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
     *                          image:
     *                              type: string
     *                          status:
     *                              type: string
     *      responses:
     *          '200':
     *              description: Return a user.
     */
    usersRouter.patch('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            // Check for errors
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            next()
        },
        userController.updateUser
    ])

    return usersRouter
}