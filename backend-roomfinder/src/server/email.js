import 'dotenv/config'
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
    }

    async generateUniqueToken() {
        const token = uuidv4();
        return token;
    }

    async generarTokenVerification() {
        const token = await this.generateUniqueToken(); // Generate a unique token
        return token;
    }

    async sendEmailVerificate(usuarioid, vchname, vchemail, token) {
        try {
            const email = vchemail;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
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
                        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
                        <title>Verificación de correo</title>
                        <style>
                            body {
                                font-family: 'Roboto Mono', sans-serif;
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
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                                color: #333333;
                            }

                            .header {
                                background-color: #0f172a;
                                padding: 20px;
                                color: #ffffff;
                                text-align: center;
                            }

                            .header img {
                                max-width: 120px;
                                margin-bottom: 10px;
                            }

                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                                font-weight: 700;
                            }

                            .content {
                                padding: 20px;
                            }

                            .content p {
                                font-size: 15px;
                                line-height: 1.5;
                                margin: 0 0 20px;
                            }

                            .button {
                                display: inline-block;
                                padding: 15px 25px;
                                font-size: 16px;
                                color: #ffffff;
                                background-color: #0f172a;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: 500;
                            }

                            .button:hover {
                                background-color: #335bcb;
                            }

                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #999999;
                                background-color: #f4f4f7;
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
                                <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                                <h1>Verificación de cuenta</h1>
                            </div>
                            <div class="content">
                                <p>Hola ${vchname},<br>Oprime el siguiente botón para poder verificar tu cuenta:</p>
                                <a href="${process.env.URL_FRONTEND + '/users/verify?ui=' + usuarioid + '&token=' + token}" class="button">Verificar cuenta</a>
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
            };
            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendEmailRecovery(vchname, vchemail, token) {
        try {
            const email = vchemail;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [`${email}`],
                subject: 'Recuperación de cuenta',
                html: `
                <!DOCTYPE html>
                <html lang="es">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
                        rel="stylesheet">
                    <title>Recuperación de cuenta</title>
                    <style>
                        body {
                            font-family: 'Roboto Mono', sans-serif;
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
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                            color: #333333;
                        }

                        .number {
                            display: inline-block;
                            padding: 15px 25px;
                            font-size: 24px;
                            margin-bottom: 1rem;
                            color: #ffffff;
                            background-color: #0f172a;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: 500;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                            margin-top: 20px;
                        }

                        .footer a {
                            color: #007bff;
                            text-decoration: none;
                        }

                        .footer a:hover {
                            text-decoration: underline;
                        }

                        .header {
                            background-color: #0f172a;
                            padding: 20px;
                            color: #ffffff;
                            text-align: center;
                        }

                        .header img {
                            max-width: 120px;
                            margin-bottom: 10px;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 700;
                        }

                        .content {
                            padding: 20px;
                        }

                        .content p {
                            font-size: 15px;
                            line-height: 1.5;
                            margin: 0 0 20px;
                        }

                        .button {
                            display: inline-block;
                            padding: 15px 25px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #0f172a;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: 500;
                        }

                        .button:hover {
                            background-color: #335bcb;
                        }

                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 14px;
                            color: #999999;
                            background-color: #f4f4f7;
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
                            <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                            <h1>Recuperación de cuenta</h1>
                        </div>
                        <div class="content">
                            <p>Hola ${vchname},<br>Copia el siguiente número para poder recuperar tu cuenta:</p>
                            <div class="number">${token}</div>
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

            };
            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendRequestAccepted({ input }) {
        try {
            const { vchstudentemail, vchlessoremail, vchtitle, vchstudentname } = input;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [`${vchstudentemail}`],
                subject: 'Aceptación de solicitud',
                html: `
                <!DOCTYPE html>
                <html lang="es">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
                        rel="stylesheet">
                    <title>Actualización de solicitud</title>
                    <style>
                        body {
                            font-family: 'Roboto Mono', sans-serif;
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
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                            color: #333333;
                        }

                        .number {
                            display: inline-block;
                            padding: 15px 25px;
                            font-size: 24px;
                            margin-bottom: 1rem;
                            color: #ffffff;
                            background-color: #0f172a;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: 500;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                            margin-top: 20px;
                        }

                        .footer a {
                            color: #007bff;
                            text-decoration: none;
                        }

                        .footer a:hover {
                            text-decoration: underline;
                        }

                        .header {
                            background-color: #0f172a;
                            padding: 20px;
                            color: #ffffff;
                            text-align: center;
                        }

                        .header img {
                            max-width: 120px;
                            margin-bottom: 10px;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 700;
                        }

                        .content {
                            padding: 20px;
                        }

                        .content p {
                            font-size: 15px;
                            line-height: 1.5;
                            margin: 0 0 20px;
                        }

                        .button {
                            display: inline-block;
                            padding: 15px 25px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #0f172a;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: 500;
                        }

                        .button:hover {
                            background-color: #335bcb;
                        }

                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 14px;
                            color: #999999;
                            background-color: #f4f4f7;
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
                            <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                            <h1>Confirmación de solicitud</h1>
                        </div>
                        <div class="content">
                            <p>Hola ${vchstudentname},<br> Tu solicitud a la propiedad ${vchtitle} ha sido aceptada. Quedamos a la espera de tu confirmación.</p>
                            <a href="${process.env.URL_FRONTEND + '/dashboard/request'}" class="button">Confirmar solicitud</a>
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

            };
            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendRequestLeasor({ input }) {
        try {
            const { vchname, vchemail } = input;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [`${vchemail}`],
                subject: 'Solicitud de arrendamiento',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
                        <title>Notificación de arrendamiento</title>
                        <style>
                            body {
                                font-family: 'Roboto Mono', sans-serif;
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
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                                color: #333333;
                            }

                            .header {
                                background-color: #0f172a;
                                padding: 20px;
                                color: #ffffff;
                                text-align: center;
                            }

                            .header img {
                                max-width: 120px;
                                margin-bottom: 10px;
                            }

                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                                font-weight: 700;
                            }

                            .content {
                                padding: 20px;
                            }

                            .content p {
                                font-size: 15px;
                                line-height: 1.5;
                                margin: 0 0 20px;
                            }

                            .button {
                                display: inline-block;
                                padding: 15px 25px;
                                font-size: 16px;
                                background-color: #0f172a;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: 500;
                                color: white;
                            }

                            .button:hover {
                                background-color: #335bcb;
                            }

                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #999999;
                                background-color: #f4f4f7;
                            }

                            .footer a {
                                color: #007bff;
                                text-decoration: none;
                            }

                            .footer a:hover {
                                text-decoration: underline;
                            }
                            .pt-4 {
                                padding-top: 25px;
                            }
                        </style>
                    </head>

                    <body>
                        <div class="email-container">
                            <div class="header">
                                <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                                <h1>Notificación de arrendamiento</h1>
                            </div>
                            <div class="content">
                                <p>Hola ${vchname},<br> tienes una nueva solicitud de arrendamiento:</p>
                                <a href="${process.env.URL_FRONTEND + '/dashboard/request'}" class="button">Ir a solicitudes</a>
                                <p class="pt-4">
                                    No responda a este correo electrónico. Si tiene alguna pregunta, por favor <a href="mailto:support@roomfinder.website">contáctenos</a>.
                                </p>
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
            };

            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendNotificationUpdateStatus({ input }) {
        try {
            const { vchstudentemail, vchtitle } = input;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [`${vchstudentemail}`],
                subject: 'Notifiación por correo',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
                        <title>Notificación de actualización de solicitud</title>
                        <style>
                            body {
                                font-family: 'Roboto Mono', sans-serif;
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
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                                color: #333333;
                            }

                            .header {
                                background-color: #0f172a;
                                padding: 20px;
                                color: #ffffff;
                                text-align: center;
                            }

                            .header img {
                                max-width: 120px;
                                margin-bottom: 10px;
                            }

                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                                font-weight: 700;
                            }

                            .content {
                                padding: 20px;
                            }

                            .content p {
                                font-size: 15px;
                                line-height: 1.5;
                                margin: 0 0 20px;
                            }

                            .button {
                                display: inline-block;
                                padding: 15px 25px;
                                font-size: 16px;
                                color: #ffffff;
                                background-color: #0f172a;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: 500;
                            }

                            .button:hover {
                                background-color: #335bcb;
                            }

                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #999999;
                                background-color: #f4f4f7;
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
                                <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                                <h1>Notificación de Actualización</h1>
                            </div>
                            <div class="content">
                                <p>Actualización de solicitud.</p>
                                <p>La solicitud de arrendamiento de la propiedad ${vchtitle}, ha sufrido una actualización.</p>
                                <p>Por favor, revisa la plataforma para más detalles.</p>
                                <p>Si no solicitaste este correo, por favor ignóralo.</p>
                                <p class="pt-4">
                                    No responda a este correo electrónico. Si tiene alguna pregunta, por favor <a href="mailto:support@roomfinder.website">contáctenos</a>.
                                </p>
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
            };
            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendNotificationStatus( vchname, vchemail, fechaPago) {
        try {
            const email = vchemail;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [`${email}`],
                subject: 'Notifiación por correo',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
                        <title>Notificación de cambio de estatus</title>
                        <style>
                            body {
                                font-family: 'Roboto Mono', sans-serif;
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
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                                color: #333333;
                            }

                            .header {
                                background-color: #0f172a;
                                padding: 20px;
                                color: #ffffff;
                                text-align: center;
                            }

                            .header img {
                                max-width: 120px;
                                margin-bottom: 10px;
                            }

                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                                font-weight: 700;
                            }

                            .content {
                                padding: 20px;
                            }

                            .content p {
                                font-size: 15px;
                                line-height: 1.5;
                                margin: 0 0 20px;
                            }

                            .button {
                                display: inline-block;
                                padding: 15px 25px;
                                font-size: 16px;
                                color: #ffffff;
                                background-color: #0f172a;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: 500;
                            }

                            .button:hover {
                                background-color: #335bcb;
                            }

                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #999999;
                                background-color: #f4f4f7;
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
                                <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                                <h1>Notificación cambio de estatus</h1>
                            </div>
                            <div class="content">
                                <p>Hola ${vchname},<br> tienes una nueva notificación.</p>
                                <p>Se actualizaron los arrendamientos. ${fechaPago}</p>
                                <p>Si no solicitaste este correo, por favor ignóralo.</p>
                                <p class="pt-4">
                                    No responda a este correo electrónico. Si tiene alguna pregunta, por favor <a href="mailto:support@roomfinder.website">contáctenos</a>.
                                </p>
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
            };
            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendNotification(usuarioid, vchname, vchemail, fechaPago) {
        try {
            const email = vchemail;
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [`${email}`],
                subject: 'Notifiación por correo',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
                        <title>Notificación</title>
                        <style>
                            body {
                                font-family: 'Roboto Mono', sans-serif;
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
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                                color: #333333;
                            }

                            .header {
                                background-color: #0f172a;
                                padding: 20px;
                                color: #ffffff;
                                text-align: center;
                            }

                            .header img {
                                max-width: 120px;
                                margin-bottom: 10px;
                            }

                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                                font-weight: 700;
                            }

                            .content {
                                padding: 20px;
                            }

                            .content p {
                                font-size: 15px;
                                line-height: 1.5;
                                margin: 0 0 20px;
                            }

                            .button {
                                display: inline-block;
                                padding: 15px 25px;
                                font-size: 16px;
                                color: #ffffff;
                                background-color: #0f172a;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: 500;
                            }

                            .button:hover {
                                background-color: #335bcb;
                            }

                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #999999;
                                background-color: #f4f4f7;
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
                                <img src="https://res.cloudinary.com/dal8aivch/image/upload/v1739424183/utils/xoe4vqadlpkfy0d8ux11.png" alt="Logo">
                                <h1>Notificación</h1>
                            </div>
                            <div class="content">
                                <p>Hola ${vchname},<br> tienes una nueva notificación.</p>
                                <p>Su fecha de pago es el ${fechaPago}</p>
                                <p>Si no solicitaste este correo, por favor ignóralo.</p>
                                <p class="pt-4">
                                    No responda a este correo electrónico. Si tiene alguna pregunta, por favor <a href="mailto:support@roomfinder.website">contáctenos</a>.
                                </p>
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
            };
            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }

    async sendLeaseStatusNotification(usuarioid, vchname, vchemail, leaseNumber, nuevoEstatus, fechaInicio, fechaFin) {
        try {
            const info = {
                from: `"RoomFinder" <${process.env.EMAIL_USER}>`,
                to: [vchemail],
                subject: 'Actualización de estado de tu solicitud de arrendamiento',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet">
                        <style>
                        body { font-family: 'Roboto Mono', monospace; background: #f4f4f7; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        .header { background: #0f172a; padding: 20px; text-align: center; color: #fff; }
                        .content { padding: 20px; color: #333; }
                        .footer { padding: 20px; text-align: center; font-size: 14px; color: #999; background: #f4f4f7; }
                        .btn { display: inline-block; padding: 10px 20px; background: #0f172a; color: #fff; text-decoration: none; border-radius: 5px; }
                        .btn:hover { background: #334155; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                        <div class="header">
                            <h1>Actualización de Arrendamiento</h1>
                        </div>
                        <div class="content">
                            <p>Hola ${vchname},</p>
                            <p>Tu arrendamiento <strong>${leaseNumber}</strong> ha cambiado de estado a: <strong>${nuevoEstatus}</strong>.</p>
                            <p><strong>Inicio:</strong> ${fechaInicio}<br/>
                            <strong>Fin:</strong> ${fechaFin}</p>
                            <p>Puedes consultar más detalles ingresando a tu cuenta.</p>
                            <p><a class="btn" href="https://roomfinder.website/dashboard/leases">Ver arrendamiento</a></p>
                        </div>
                        <div class="footer">
                            ¿Tienes preguntas? <a href="mailto:support@roomfinder.website">Contáctanos</a><br/>
                            Gracias por usar RoomFinder.
                        </div>
                        </div>
                    </body>
                    </html>
                `,
            };

            const result = await this.transporter.sendMail(info);
            return result.messageId;
        } catch (error) {
            throw new Error(`Error al enviar correo: ${error.message}`);
        }
    }

}
