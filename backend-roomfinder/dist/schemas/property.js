"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePartialProperty = validatePartialProperty;
exports.validateProperty = validateProperty;
var _zod = _interopRequireDefault(require("zod"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const propertySchema = _zod.default.object({
  lessor_id: _zod.default.number(),
  type_house: _zod.default.enum(['casa', 'departamento', 'habitación']),
  title: _zod.default.string().min(5, {
    message: 'Must be 5 or more characters long'
  }).max(60, {
    message: 'Must be less than 60 characters long'
  }),
  description: _zod.default.string().min(25),
  street: _zod.default.string(),
  zip: _zod.default.string().superRefine((val, ctx) => {
    const zipRegex = /^\d{5}$/; // Match a 5-digit zip code
    if (!zipRegex.test(val)) {
      ctx.addIssue({
        code: _zod.default.ZodIssueCode.too_big,
        min: 5,
        max: 5,
        message: "Invalid zip"
      });
    }
  }),
  suburb: _zod.default.string(),
  municipality: _zod.default.string(),
  state: _zod.default.string(),
  lat: _zod.default.number().min(-90).max(90, 'La latitud debe ser menor o igual a 90'),
  lng: _zod.default.number().min(-180).max(180, 'La longitud debe ser menor o igual a 180'),
  availability: _zod.default.enum([0, 1]),
  price: _zod.default.number().positive()
});
function validateProperty(input) {
  return propertySchema.safeParse(input);
}
function validatePartialProperty(input) {
  return propertySchema.partial().safeParse(input);
}