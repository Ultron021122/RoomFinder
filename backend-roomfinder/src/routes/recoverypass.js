import { Router } from "express";
import { param, validationResult } from "express-validator";
import { RecoveryPassController } from "../controller/recoverypass.js";

export const createRecoveryPassRouter = ({ recoveryPassModel }) => {
    const recoveryPassRouter = Router();
    const recoveryPassController = new RecoveryPassController({ recoveryPassModel });

    /**
     * @swagger
     * tags:
     *  name: RecoveryPass
     *  description: RecoveryPass routes management
     */

    recoveryPassRouter.get('/', recoveryPassController.getAll);
    recoveryPassRouter.get('/:id', [
        // Validation
        param('id').isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        recoveryPassController.getById
    ])
    recoveryPassRouter.get('/token/:token', [
        // Validation
        param('token').isString().withMessage('token must be a string'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        recoveryPassController.getByToken
    ])
    recoveryPassRouter.get("/user/:id", [
        param("id").isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        recoveryPassController.getByUser
    ]);
    recoveryPassRouter.post("/", recoveryPassController.create);
    recoveryPassRouter.put("/:id", [
        param("id").isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        recoveryPassController.update
    ]);
    recoveryPassRouter.delete("/:id", [
        param("id").isInt().withMessage('id must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        recoveryPassController.delete
    ]);
    recoveryPassRouter.delete("/user/:usuarioid", [
        param("usuarioid").isInt().withMessage('usuarioid must be an integer'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        recoveryPassController.deleteByUser
    ]);

    return recoveryPassRouter;
}