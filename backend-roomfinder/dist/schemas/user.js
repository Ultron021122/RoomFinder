"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePartialUser = validatePartialUser;
exports.validateUser = validateUser;
var _zod = _interopRequireDefault(require("zod"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const userSchema = _zod.default.object({
  type_user: _zod.default.enum(["student", "lessor"]),
  name: _zod.default.string({
    required_error: 'User name is required.'
  }),
  last_name: _zod.default.string({
    required_error: 'User last name is required.'
  }),
  email: _zod.default.string().email(),
  password: _zod.default.string().min(8, {
    message: 'Must be 8 or more characters long'
  }),
  birthday: _zod.default.coerce.date().max(new Date(), {
    message: "Too young!"
  }),
  status: _zod.default.enum(["active", "inactive"]),
  image: _zod.default.string().url()
});
function validateUser(input) {
  return userSchema.safeParse(input);
}
function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}