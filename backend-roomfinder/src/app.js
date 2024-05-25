import express, { json } from 'express'
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import { options } from "./swaggerOptions.js"
import { corsMiddleware } from './middlewares/cors.js'
import morgan from "morgan"
import { errorHandler } from './middlewares/errors.js'
import { rateLimit } from 'express-rate-limit'
// Importar las rutas
import { createUsersRouter } from './routes/users.js'
import { createPropertiesRouter } from './routes/properties.js'
import { createLessorsRouter } from './routes/lessors.js'
import { createStudentsRouter } from './routes/students.js'
import { createMessagesRouter } from './routes/messages.js'
import { createChatsRouter } from './routes/chats.js'
// Importar el modelo de la base de datos
// PostgreSQL
import { UsersModel } from './model/postgresql/user.js'
import { PropertiesModel } from './model/postgresql/propertie.js'
import { LessorsModel } from './model/postgresql/lessor.js'
import { StudentsModel } from './model/postgresql/student.js'
import { MessagesModel } from './model/postgresql/messages.js'
import { ChatsModel } from './model/postgresql/chats.js'
// Email
import nodemailer from 'nodemailer';
//MySQL 
// import { UsersModel } from './model/mysql/user.js'
// import { PropertiesModel } from './model/mysql/propertie.js'
// import { LessorsModel } from './model/mysql/lessor.js'
// import { StudentsModel } from './model/mysql/student.js'

const swagger = swaggerJSDoc(options)
const app = express()
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

app.use(corsMiddleware())
app.use(morgan("dev"))
app.use(json())
app.disable('x-powered-by')

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 10 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again later.' })
    }
});

// apply to all requests
app.use('/api/', apiLimiter);

app.use('/api/users', createUsersRouter({ userModel: UsersModel }))
app.use('/api/properties', createPropertiesRouter({ propertieModel: PropertiesModel }))
app.use('/api/lessors', createLessorsRouter({ lessorModel: LessorsModel }))
app.use('/api/students', createStudentsRouter({ studentModel: StudentsModel }))
app.use('/api/messages', createMessagesRouter({ messageModel: MessagesModel }))
app.use('/api/chats', createChatsRouter({ chatsModel: ChatsModel }))
app.get('/api/send-email', async (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'marvelsml25@gmail.com, juanricardomartinezlopez@outlook.com, smldeveloper02@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html: '<b>Hello world?</b>',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagger)) // Documentation of the API
app.use(errorHandler) // Middleware for error handling
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

export default app