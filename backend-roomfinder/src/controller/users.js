import { validateUser, validatePartialUser } from '../schemas/user.js'
import { EmailService } from '../server/email.js'
import bcrypt from 'bcrypt'

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel;
        this.EmailService = new EmailService();
    }

    getAll = async (req, res, next) => {
        try {
            const users = await this.userModel.getAll()
            return res.json(users);
        } catch (err) {
            next(err); // Pass the error to the error handler
        }
    }

    getByUser = async (req, res, next) => {
        try {
            const { roleid } = req.params

            const users = await this.userModel.getByUser({ roleid })
            if (users) return res.json(users)
            return res.status(404).json({ message: 'User type not found' })
        } catch (err) {
            next(err);
        }
    }

    getById = async (req, res, next) => {
        const { id } = req.params
        await this.userModel.getById({ id })
            .then(user => {
                if (user) return res.json(user)
                return res.status(404).json({ message: 'User not found' })
            })
            .catch(next); // Pass the error to the error handler
    }

    create = async (req, res, next) => {
        const result = validateUser(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.data.vchpassword, salt);
        result.data.vchpassword = hashedPassword;

        // Create user and send verification email
        try {
            const newUser = await this.userModel.create({ input: result.data });
            if (newUser === false) return res.status(409).json({ message: 'User already exists' });

            const token = await this.EmailService.generarTokenVerification();
            // Save token in database and send email
            await this.userModel.saveToken({ verify: { usuarioid: newUser.usuarioid, vchtoken: token } })
            await this.EmailService.sendEmailVerificate( newUser.usuarioid, newUser.vchname, newUser.vchemail, token);

            return res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        const { id } = req.params
        await this.userModel.delete({ id })
            .then(result => {
                if (result == false) return res.status(404).json({ message: 'User not found' })
                return res.json({ message: 'User deleted' })
            })
            .catch(next); // Pass the error to the error handler
    }

    updateUser = async (req, res, next) => {
        const result = validatePartialUser(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        if (result.data.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(result.data.password, salt)
            result.data.password = hashedPassword
        }
        const { id } = req.params
        await this.userModel.update({ id, input: result.data })
            .then(updateUser => {
                if (updateUser === false) return res.status(409).json({ message: 'Email already exists' })
                if (!updateUser) return res.status(404).json({ message: 'User not found' })
                return res.json(updateUser)
            })
            .catch(next); // Pass the error to the error handler
    }

    // Login and logout - Session management
    login = async (req, res, next) => {
        const result = validatePartialUser(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        await this.userModel.login({ input: result.data })
            .then(login => {
                if (login) return res.status(200).json(login)
                return res.status(401).json({ message: 'Invalid credentials' })
            })
            .catch(next); // Pass the error to the error handler
    }

    logout = async (req, res, next) => {
        const { sessionid } = req.params
        await this.userModel.logout({ sessionid })
            .then(logout => {
                if (logout) return res.json({ message: 'User logged out' })
                return res.status(404).json({ message: 'Session not found' })
            })
            .catch(next); // Pass the error to the error handler
    }

    // Email verification
    verifyEmail = async (req, res, next) => {
        try {
            const { id, token } = req.params;
            const verifiedUser = await this.userModel.verifyToken({ verify: { usuarioid: id, vchtoken: token } });
            if (verifiedUser === false) return res.status(404).json({ message: 'User not found' });
            if (!verifiedUser) return res.status(400).json({ message: 'Invalid verification token' });

            await this.userModel.update({ id, input: { bnverified: true } });
            return res.status(200).json({ message: 'Email verified successfully' });
        } catch (err) {
            next(err);
        }
    }
    // Password recovery
    recoveryPassword = async (req, res, next) => {
        try {
            const result = validatePartialUser(req.body)
            if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) });

            const user = await this.userModel.getByEmail({ email: result.data.vchemail });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const token = await this.EmailService.generarTokenVerification();
            const recovery = await this.userModel.recoveryPassword({ recover: { usuarioid: user.usuarioid, vchtoken: token } })
            if (!recovery) return res.status(400).json({ message: 'Error generating recovery token' });

            await this.EmailService.sendEmailRecovery(user.vchname, user.vchemail, token);
            return res.status(200).json({ message: 'Recovery email sent' });
        } catch (err) {
            next(err);
        }
    }
}