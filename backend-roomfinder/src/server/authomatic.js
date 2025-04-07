import cron from 'node-cron';
import moment from 'moment';
import { EmailService } from './email.js'; 

// Crear una instancia de tu servicio de correo
const emailService = new EmailService();

// Esta función verifica las fechas y envía el correo
const notification = async () => {
  try {
    // Suponiendo que las fechas de pago vienen de una base de datos o de una lista de usuarios
    const usuarios = [
      { usuarioid: '123', vchname: 'Juan', vchemail: 'marvelsml25@gmail.com', fechaPago: '2025-04-10' },
      { usuarioid: '456', vchname: 'María', vchemail: 'smldeveloper02@gmail.com', fechaPago: '2025-04-08' }
    ];

    const hoy = moment();

    for (const usuario of usuarios) {
      const fechaPago = moment(usuario.fechaPago);
      
      // Verificar si la fecha de pago está dentro de los próximos 3 días
      if (fechaPago.diff(hoy, 'days') <= 3) {
        
        // Enviar el correo de verificación o recordatorio
        await emailService.sendNotification(usuario.usuarioid, usuario.vchname, usuario.vchemail, usuario.fechaPago);
        console.log(`Correo enviado a ${usuario.vchname} (${usuario.vchemail})`);
      }
    }
  } catch (error) {
    console.error('Error verificando y enviando correos:', error);
  }
};

// Programar la tarea para que se ejecute todos los días a las 8 AM
cron.schedule('29 2 * * *', () => {
  console.log('Verificando fechas de pago y enviando correos...');
  notification();
});


export { notification };