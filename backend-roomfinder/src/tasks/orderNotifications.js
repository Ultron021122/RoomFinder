import cron from 'node-cron';
import moment from 'moment';
import { EmailService } from './email.js'; 

// Crear una instancia de tu servicio de correo
const emailService = new EmailService();

// Esta función verifica las fechas y envía el correo
const changeStatus = async () => {
  try {
    const hoy = moment();

    const response = await axios.get(`${process.env.ROUTE_LOCAL}/api/tasks`);
    if (response) {
        await emailService.sendNotification(0, 'admin', 'admin@roomfinder.website', hoy.format('YYYY-MM-DD'));
        console.log(`Correo enviado a admin (admin@roomfinder.website)`);
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