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
import { createRecoveryPassRouter } from './routes/recoverypass.js'
import { createTypePropertyRouter } from './routes/typeproperty.js'
// Importar el modelo de la base de datos
// PostgreSQL
import { UsersModel } from './model/postgresql/user.js'
import { PropertiesModel } from './model/postgresql/propertie.js'
import { LessorsModel } from './model/postgresql/lessor.js'
import { StudentsModel } from './model/postgresql/student.js'
import { MessagesModel } from './model/postgresql/messages.js'
import { ChatsModel } from './model/postgresql/chats.js'
import { RecoveryPassModel } from './model/postgresql/recoverypass.js'
import { PropertyTypeModel } from './model/postgresql/typeproperty.js'
import { verificarJWT } from './auth.js'
//MySQL 
// import { UsersModel } from './model/mysql/user.js'
// import { PropertiesModel } from './model/mysql/propertie.js'
// import { LessorsModel } from './model/mysql/lessor.js'
// import { StudentsModel } from './model/mysql/student.js'

const swagger = swaggerJSDoc(options)
const app = express()

app.use(corsMiddleware())
app.use(morgan("dev"))
app.use(json())
app.disable('x-powered-by')

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10000, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again later.' })
    }
});

// apply to all requests
app.use('/api/', apiLimiter);

app.use('/api/users', verificarJWT, createUsersRouter({ userModel: UsersModel }))
app.use('/api/properties', verificarJWT, createPropertiesRouter({ propertieModel: PropertiesModel }))
app.use('/api/typeproperty', verificarJWT, createTypePropertyRouter({ typePropertyModel: PropertyTypeModel }))
app.use('/api/lessors', verificarJWT, createLessorsRouter({ lessorModel: LessorsModel }))
app.use('/api/students', verificarJWT, createStudentsRouter({ studentModel: StudentsModel }))
app.use('/api/messages', verificarJWT, createMessagesRouter({ messageModel: MessagesModel }))
app.use('/api/chats', verificarJWT, createChatsRouter({ chatsModel: ChatsModel }))
app.use('/api/recovery', verificarJWT, createRecoveryPassRouter({ recoveryPassModel: RecoveryPassModel }))

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swagger)) // Documentation of the API
app.use(errorHandler) // Middleware for error handling
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

export default app