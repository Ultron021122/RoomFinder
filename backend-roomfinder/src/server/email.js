import 'dotenv/config'
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

async function generateUniqueToken() {
    const token = uuidv4();
    return token;
}

export class EmailService {
    static async generarTokenVerification() {
        const token = await generateUniqueToken();
        return token;
    }

    static async sendEmailVerificate(vchname, vchemail, token) {
        try {
            const email = vchemail;
            const info = await transporter.sendMail({
                from: `"Sebastián Martínez López 👻" <${process.env.EMAIL_USER}>`,
                to: [`${email}`],
                subject: 'Verificación de correo',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=League+Spartan:wght@100..900&display=swap" rel="stylesheet">
                        <title>Verificación de correo</title>
                        <style>
                            body {
                                font-family: "DM Sans", sans-serif;
                                background-color: #f4f4f7;
                                margin: 0;
                                padding: 0;
                                -webkit-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                background-color: #007bff;
                                padding: 20px;
                                border-radius: 8px 8px 0 0;
                                text-align: center;
                                color: #ffffff;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                            }
                            .content {
                                padding: 20px;
                                text-align: center;
                            }
                            .content p {
                                font-size: 16px;
                                color: #333333;
                            }
                            .content .token {
                                display: inline-block;
                                background-color: #f0f0f0;
                                padding: 10px 20px;
                                font-size: 20px;
                                font-weight: bold;
                                letter-spacing: 1px;
                                border-radius: 4px;
                                margin: 20px 0;
                            }
                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #999999;
                            }
                            .footer a {
                                color: #007bff;
                                text-decoration: none;
                            }
                            .footer a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>Verificación de correo</h1>
                            </div>
                            <div class="content">
                                <p>Hola ${vchname},</p>
                                <p>Gracias por registrarte. Por favor, utiliza el siguiente código para verificar tu dirección de correo electrónico:</p>
                                <div class="token">${token}</div>
                                <p>Si no solicitaste este correo, por favor ignóralo.</p>
                            </div>
                            <div class="footer">
                                <p>Gracias,</p>
                                <p>El equipo de RoomFinder</p>
                                <p>¿Tienes alguna pregunta? <a href="mailto:support@roomfinder.website">Contacta con soporte</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            });
            console.log('Message sent: %s', info.messageId);
            return info.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }
}