import { validateUser, validatePartialUser } from '../schemas/user.js';
import { EmailService } from '../server/emailService.js';
import bcrypt from 'bcrypt';
export class UserController {
  constructor({
    userModel
  }) {
    this.userModel = userModel;
  }
  getAll = async (req, res) => {
    const users = await this.userModel.getAll();
    res.json(users);
  };
  getByUser = async (req, res) => {
    const {
      type_user
    } = req.params;
    const users = await this.userModel.getByUser({
      type_user
    });
    if (users) return res.json(users);
    res.status(404).json({
      message: 'User type not found'
    });
  };
  getById = async (req, res) => {
    const {
      id
    } = req.params;
    const user = await this.userModel.getById({
      id
    });
    if (user) return res.json(user);
    res.status(404).json({
      message: 'User not found'
    });
  };
  login = async (req, res) => {
    const result = validatePartialUser(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    const login = await this.userModel.login({
      input: result.data
    });
    if (login === false) return res.status(401).json({
      message: "Invalid credentials"
    });
    res.status(200).json(login);
  };
  create = async (req, res) => {
    const result = validateUser(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(result.data.password, salt);
    result.data.password = hashedPassword;
    const newUser = await this.userModel.create({
      input: result.data
    });
    if (newUser === false) return res.status(409).json({
      message: "User already exists"
    });

    // const token = await EmailService.generarTokenVerification();
    // await EmailService.sendEmailVerificate(newUser.email, token);

    return res.status(201).json(newUser);
  };
  verifyEmail = async (req, res) => {
    const {
      token
    } = req.params;
    const verifiedUser = await this.userModel.verifyEmail({
      token
    });
    if (!verifiedUser) {
      return res.status(400).json({
        message: 'Invalid verification token'
      });
    }
    await this.userModel.updateVerified({
      id: verifiedUser.id
    });
    return res.status(200).json({
      message: 'Email verified successfully'
    });
  };
  delete = async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.userModel.delete({
      id
    });
    if (result == false) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    return res.json({
      message: 'User deleted'
    });
  };
  updateUser = async (req, res) => {
    const result = validatePartialUser(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    if (result.data.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(result.data.password, salt);
      result.data.password = hashedPassword;
    }
    const {
      id
    } = req.params;
    const updateUser = await this.userModel.update({
      id,
      input: result.data
    });
    if (updateUser === false) return res.status(409).json({
      message: 'Email already exists'
    });
    if (!updateUser) return res.status(404).json({
      message: 'User not found'
    });
    return res.json(updateUser);
  };
}