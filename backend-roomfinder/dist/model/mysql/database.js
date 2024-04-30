"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Database = void 0;
var _promise = _interopRequireDefault(require("mysql2/promise"));
var _config = require("./config.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Database {
  static async query(sql, params) {
    let connection;
    try {
      connection = await _promise.default.createConnection(_config.config);
      const result = await connection.query(sql, params);
      return result;
    } finally {
      this.close(connection);
    }
  }
  static async close(connection) {
    if (connection) {
      await connection.end();
    }
  }
}
exports.Database = Database;