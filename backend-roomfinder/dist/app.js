"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireWildcard(require("express"));
var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _swaggerOptions = require("./swaggerOptions.js");
var _cors = require("./middlewares/cors.js");
var _morgan = _interopRequireDefault(require("morgan"));
var _errors = require("./middlewares/errors.js");
var _expressRateLimit = require("express-rate-limit");
var _users = require("./routes/users.js");
var _properties = require("./routes/properties.js");
var _lessors = require("./routes/lessors.js");
var _students = require("./routes/students.js");
var _user = require("./model/postgresql/user.js");
var _propertie = require("./model/postgresql/propertie.js");
var _lessor = require("./model/postgresql/lessor.js");
var _student = require("./model/postgresql/student.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Importar las rutas

// Importar el modelo de la base de datos
// PostgreSQL

//MySQL 
// import { UsersModel } from './model/mysql/user.js'
// import { PropertiesModel } from './model/mysql/propertie.js'
// import { LessorsModel } from './model/mysql/lessor.js'
// import { StudentsModel } from './model/mysql/student.js'

const swagger = (0, _swaggerJsdoc.default)(_swaggerOptions.options);
const app = (0, _express.default)();
app.use((0, _cors.corsMiddleware)());
app.use((0, _morgan.default)("dev"));
app.use((0, _express.json)());
app.disable('x-powered-by');
const apiLimiter = (0, _expressRateLimit.rateLimit)({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  limit: 10,
  // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, please try again later.'
    });
  }
});

// apply to all requests
app.use('/api/', apiLimiter);
app.use('/api/users', (0, _users.createUsersRouter)({
  userModel: _user.UsersModel
}));
app.use('/api/properties', (0, _properties.createPropertiesRouter)({
  propertieModel: _propertie.PropertiesModel
}));
app.use('/api/lessors', (0, _lessors.createLessorsRouter)({
  lessorModel: _lessor.LessorsModel
}));
app.use('/api/students', (0, _students.createStudentsRouter)({
  studentModel: _student.StudentsModel
}));
app.use('/docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swagger)); // Documentation of the API
app.use(_errors.errorHandler); // Middleware for error handling
app.use((req, res) => {
  res.status(404).json({
    message: 'Not found'
  });
});
var _default = exports.default = app;