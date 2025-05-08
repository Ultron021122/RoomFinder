import cron from 'node-cron';
import moment from 'moment';
import { EmailService } from '../server/email.js';
import axios from 'axios';
import dotenv from 'dotenv';

// Crear una instancia de tu servicio de correo
const emailService = new EmailService();

// Esta función verifica las fechas y envía el correo
const changeStatus = async () => {
  try {
    const hoy = moment();

    const response = await axios.get(`${process.env.ROUTE_LOCAL}/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${process.env.TOKEN}`
      }
    });

    if (response) {
        await emailService.sendNotificationStatus('admin', 'admin@roomfinder.website', hoy.format('YYYY-MM-DD'));
        console.log(`Correo enviado a admin (admin@roomfinder.website)`);
    } else {
        console.log('No se encontraron operaciones para cambiar de estatus.');
    }

  } catch (error) {
    console.error('Error verificando y enviando correos:', error);
  }
};

// Programar la tarea para que se ejecute todos los días a las 12 AM
cron.schedule('0 0 * * *', () => {
  console.log('Cambiando estatus de operaciones...');
  changeStatus();
}, {
  timezone: "America/Mexico_City"
});


export { changeStatus };