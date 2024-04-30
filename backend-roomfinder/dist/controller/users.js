"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserController = void 0;
var _user = require("../schemas/user.js");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import { EmailService } from '../server/emailService.js'

class UserController {
  constructor({
    userModel
  }) {
    this.userModel = userModel;
  }
  getAll = async (req, res, next) => {
    try {
      const users = await this.userModel.getAll();
      return res.json(users);
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  };
  getByUser = async (req, res, next) => {
    try {
      const {
        type_user
      } = req.params;
      const users = await this.userModel.getByUser({
        type_user
      });
      if (users) return res.json(users);
      return res.status(404).json({
        message: 'User type not found'
      });
    } catch (err) {
      next(err);
    }
  };
  getById = async (req, res, next) => {
    const {
      id
    } = req.params;
    await this.userModel.getById({
      id
    }).then(user => {
      if (user) return res.json(user);
      return res.status(404).json({
        message: 'User not found'
      });
    }).catch(next); // Pass the error to the error handler
  };
  login = async (req, res, next) => {
    const result = (0, _user.validatePartialUser)(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    await this.userModel.login({
      input: result.data
    }).then(login => {
      if (login) return res.status(200).json(login);
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }).catch(next); // Pass the error to the error handler
  };
  create = async (req, res, next) => {
    const result = (0, _user.validateUser)(req.body);
    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    // Encrypt password
    const salt = await _bcrypt.default.genSalt(10);
    const hashedPassword = await _bcrypt.default.hash(result.data.password, salt);
    result.data.password = hashedPassword;
    await this.userModel.create({
      input: result.data
    }).then(newUser => {
      if (newUser === false) return res.status(409).json({
        message: 'User already exists'
      });
      // const token = await EmailService.generarTokenVerification();
      // await EmailService.sendEmailVerificate(newUser.email, token);
      return res.status(201).json(newUser);
    }).catch(next); // Pass the error to the error handler
  };
  verifyEmail = async (req, res, next) => {
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
  delete = async (req, res, next) => {
    const {
      id
    } = req.params;
    await this.userModel.delete({
      id
    }).then(result => {
      if (result == false) return res.status(404).json({
        message: 'User not found'
      });
      return res.json({
        message: 'User deleted'
      });
    }).catch(next); // Pass the error to the error handler
  };
  updateUser = async (req, res, next) => {
    const result = (0, _user.validatePartialUser)(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      });
    }
    if (result.data.password) {
      const salt = await _bcrypt.default.genSalt(10);
      const hashedPassword = await _bcrypt.default.hash(result.data.password, salt);
      result.data.password = hashedPassword;
    }
    const {
      id
    } = req.params;
    await this.userModel.update({
      id,
      input: result.data
    }).then(updateUser => {
      if (updateUser === false) return res.status(409).json({
        message: 'Email already exists'
      });
      if (!updateUser) return res.status(404).json({
        message: 'User not found'
      });
      return res.json(updateUser);
    }).catch(next); // Pass the error to the error handler
  };
}
exports.UserController = UserController;