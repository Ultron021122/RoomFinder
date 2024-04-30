"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsersModel = void 0;
var _database = require("./database.js");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class UsersModel extends _database.Database {
  constructor({
    id,
    type_user,
    name,
    last_name,
    email,
    password,
    birthday,
    status,
    created_date
  }) {
    super();
    this.id = id;
    this.type_user = type_user;
    this.name = name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.birthday = birthday;
    this.status = status;
    this.created_date = created_date;
  }
  static async getAll() {
    const [users] = await this.query("SELECT * FROM users;");
    return users.map(user => new UsersModel(user));
  }
  static async getByUser({
    type_user
  }) {
    const [users] = await this.query("SELECT * FROM users WHERE type_user = ?;", [type_user]);
    return users.map(user => new UsersModel(user));
  }
  static async getById({
    id
  }) {
    const [user] = await this.query('SELECT * FROM users WHERE id = ?;', [id]);
    return user[0] ? new UsersModel(user[0]) : null;
  }
  static async login({
    input
  }) {
    try {
      const {
        email,
        password
      } = input;
      const [user] = await this.query('SELECT * FROM users WHERE email = ?;', [email]);
      if (user.length == 0) return false;
      const validPassword = await _bcrypt.default.compare(password, user[0].password);
      if (!validPassword) return false;
      return new UsersModel(user[0]);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  static async create({
    input
  }) {
    try {
      const {
        type_user,
        name,
        last_name,
        email,
        password,
        birthday,
        status
      } = input;
      const [result] = await this.query('INSERT INTO users (type_user, name, last_name, email, password, birthday, status) VALUES (?, ?, ?, ?, ?, ?, ?);', [type_user, name, last_name, email, password, birthday, status]);
      const id = result.insertId;
      const newUser = await this.getById({
        id
      });
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
  static async delete({
    id
  }) {
    try {
      const [user] = await this.query('DELETE FROM users WHERE id = ?;', [id]);
      return user.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
  static async update({
    id,
    input
  }) {
    try {
      const {
        type_user,
        name,
        last_name,
        email,
        password,
        birthday,
        status
      } = input;
      const user = await this.getById({
        id
      });
      if (user === null) return false;
      const updateColumns = Object.entries({
        type_user,
        name,
        last_name,
        email,
        password,
        birthday,
        status
      }).filter(([key, value]) => value !== undefined).map(([key, value]) => `${key} = ?`).join(', ');
      const updateValues = Object.values({
        type_user,
        name,
        last_name,
        email,
        password,
        birthday,
        status
      }).filter(value => value !== undefined);
      if (updateValues.length !== 0) {
        await this.query(`UPDATE users SET ${updateColumns} WHERE id = ?;`, [...updateValues, id]);
      }
      return await this.getById({
        id
      });
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}
exports.UsersModel = UsersModel;