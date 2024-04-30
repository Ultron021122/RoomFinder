"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmailService = void 0;
exports.generateUniqueToken = generateUniqueToken;
var _resend = require("resend");
var _uuid = require("uuid");
const resend = new _resend.Resend('re_123456789');
function generateUniqueToken() {
  const token = (0, _uuid.v4)();
  return token;
}
class EmailService {
  static async generarTokenVerification() {
    const token = generateUniqueToken();
    return token;
  }
  static async sendEmailVerificate(email, token) {
    try {
      const {
        data,
        error
      } = await resend.emails.send({
        from: `RoomFinder <onboarding@${process.env.RESEND_DOMAIN}>`,
        to: [`${email}`],
        subject: 'Verificación de correo',
        html: `<strong>It works! ${token}</strong>`
      });
      if (error) {
        console.error({
          error
        });
      }
    } catch (error) {
      throw new Error(`Error sending mail: ${error.message}`);
    }
  }
}
exports.EmailService = EmailService;