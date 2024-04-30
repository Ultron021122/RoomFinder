"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLessor = validateLessor;
exports.validatePartialLessor = validatePartialLessor;
var _zod = _interopRequireDefault(require("zod"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const lessorSchema = _zod.default.object({
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
  image: _zod.default.string().url(),
  phone: _zod.default.string().superRefine((val, ctx) => {
    const phoneRegex = /^\d{10}$/; // Match a 10-digit phone number
    if (!phoneRegex.test(val)) {
      ctx.addIssue({
        code: _zod.default.ZodIssueCode.too_small,
        min: 10,
        max: 10,
        message: "Invalid phone."
      });
    }
  }),
  street: _zod.default.string(),
  zip: _zod.default.number().positive().int().min(10000).max(99999),
  suburb: _zod.default.string(),
  municipality: _zod.default.string(),
  state: _zod.default.string()
});
function validateLessor(input) {
  return lessorSchema.safeParse(input);
}
function validatePartialLessor(input) {
  return lessorSchema.partial().safeParse(input);
}