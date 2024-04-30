"use strict";

require("dotenv/config");
var _app = _interopRequireDefault(require("./app.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PORT = process.env.PORT ?? 3000;
_app.default.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});