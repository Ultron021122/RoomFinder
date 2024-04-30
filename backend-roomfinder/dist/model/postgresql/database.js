"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Database = void 0;
require("dotenv/config");
var _pg = _interopRequireDefault(require("pg"));
var _config2 = require("./config.js");
var _errors = require("./errors.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  Pool
} = _pg.default;
class Database {
  static async query(sql, params) {
    const client = new Pool(_config2.config);
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } catch (error) {
      const {
        message,
        status
      } = _errors.errorsMap[error.code] || {
        message: 'Internal server error',
        status: 500
      };
      let customError = new Error(message);
      customError.status = status;
      throw customError;
    } finally {
      await client.end();
    }
  }
}
exports.Database = Database;