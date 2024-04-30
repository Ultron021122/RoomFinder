"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
const config = exports.config = {
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'user',
  port: process.env.DB_PORT ?? 3306,
  password: process.env.DB_PASSWORD ?? 'userpassword',
  database: process.env.DB_DATABASE ?? 'student_nest_finder'
};