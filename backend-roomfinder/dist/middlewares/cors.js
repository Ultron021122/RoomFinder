"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corsMiddleware = void 0;
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:1234', 'http://localhost:3000', 'https://roomfinder.site', 'https://www.roomfinder.site'];
const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS
} = {}) => (0, _cors.default)({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (!origin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
});
exports.corsMiddleware = corsMiddleware;