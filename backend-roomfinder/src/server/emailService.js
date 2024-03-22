import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend('re_12345678');

export function generateUniqueToken() {
    const token = uuidv4();
    return token;
}

export class EmailService {
    static async generarTokenVerification() {
        const token = generateUniqueToken();
        return token;
    }

    static async sendEmailVerificate(email, token) {
        try {

            const { data, error } = await resend.emails.send({
                from: 'RoomFinder <onboarding@resend.dev>',
                to: [`${email}`],
                subject: 'Verificación de correo',
                html: `<strong>It works! ${token}</strong>`,
            });
            if (error) {
                console.error({ error });
            }
        } catch (error) {
            throw new Error(`Error sending mail: ${error.message}`);
        }
    }
}