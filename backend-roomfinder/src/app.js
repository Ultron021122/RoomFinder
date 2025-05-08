import express, { json } from 'express'
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import { options } from "./swaggerOptions.js"
import { corsMiddleware } from './middlewares/cors.js'
import morgan from "morgan"
import { errorHandler } from './middlewares/errors.js'
import { rateLimit } from 'express-rate-limit'
import { verificarJWT } from './auth.js';
import webhookHandler from './routes/webhook.js';
// Importar las rutas
import { createUsersRouter } from './routes/users.js'
import { createPropertiesRouter } from './routes/properties.js'
import { createLessorsRouter } from './routes/lessors.js'
import { createStudentsRouter } from './routes/students.js'
import { createMessagesRouter } from './routes/messages.js'
import { createChatsRouter } from './routes/chats.js'
import { createRecoveryPassRouter } from './routes/recoverypass.js'
import { createTypePropertyRouter } from './routes/typeproperty.js'
import { createUtilsRouter } from './routes/utils.js'
import { createLeasesRouter } from './routes/leases.js'
import { createReviewsRouter } from './routes/reviews.js'
import { createRequestsRouter } from './routes/request.js'
import { createStatusRouter } from './routes/request-status.js'
import { createRentalHistoryRouter } from './routes/rental-history.js'
import { createPaymentRouter } from './routes/payments.js'
import { createPaymentOrderRouter } from './routes/payments-orders.js'
import { createLeaseStatusRouter } from './routes/leases-status.js'
import { createTasksRouter } from './routes/tasks.js'
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
import { LeasesModel } from './model/postgresql/leases.js'
import { ReviewsModel } from './model/postgresql/reviews.js'
import { RequestModel } from './model/postgresql/request.js'
import { StatusModel } from './model/postgresql/request-status.js'
import { RentalHistoryModel } from './model/postgresql/rental-history.js'
import { PaymentModel } from './model/postgresql/payments.js'
import { PaymentOrderModel } from './model/postgresql/payments-orders.js'
import { LeaseStatusModel } from './model/postgresql/leases-status.js'
import { TasksModel } from './model/postgresql/tasks.js'
//MySQL 
// import { UsersModel } from './model/mysql/user.js'
// import { PropertiesModel } from './model/mysql/propertie.js'
// import { LessorsModel } from './model/mysql/lessor.js'
// import { StudentsModel } from './model/mysql/student.js'

const swagger = swaggerJSDoc(options)
const app = express()

// Configuración de Express
app.set('trust proxy', 1); // Habilitar 'trust proxy' para proxies
app.use(corsMiddleware())
app.use(morgan("dev"))
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

app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookHandler);
app.use(json())
app.use('/api/users', verificarJWT, createUsersRouter({ userModel: UsersModel }))
app.use('/api/properties', verificarJWT, createPropertiesRouter({ propertieModel: PropertiesModel }))
app.use('/api/typeproperty', verificarJWT, createTypePropertyRouter({ typePropertyModel: PropertyTypeModel }))
app.use('/api/lessors', verificarJWT, createLessorsRouter({ lessorModel: LessorsModel }))
app.use('/api/students', verificarJWT, createStudentsRouter({ studentModel: StudentsModel }))
app.use('/api/messages', verificarJWT, createMessagesRouter({ messageModel: MessagesModel }))
app.use('/api/chats', verificarJWT, createChatsRouter({ chatsModel: ChatsModel }))
app.use('/api/recovery', verificarJWT, createRecoveryPassRouter({ recoveryPassModel: RecoveryPassModel }))
app.use('/api/leases', verificarJWT, createLeasesRouter({ leasesModel: LeasesModel }))
app.use('/api/reviews', verificarJWT, createReviewsRouter({ reviewModel: ReviewsModel }))
app.use('/api/request', verificarJWT, createRequestsRouter({ requestModel: RequestModel }))
app.use('/api/request-status', verificarJWT, createStatusRouter({ statusModel: StatusModel }))
app.use('/api/rental-history', verificarJWT, createRentalHistoryRouter({ rentalHistoryModel: RentalHistoryModel }))
app.use('/api/payments', verificarJWT, createPaymentRouter({ paymentModel: PaymentModel }))
app.use('/api/utils', verificarJWT, createUtilsRouter())
app.use('/api/leases-status', verificarJWT, createLeaseStatusRouter({ leasestatusModel: LeaseStatusModel}))
app.use('/api/payments-orders', verificarJWT, createPaymentOrderRouter({ paymentOrderModel: PaymentOrderModel }))
app.use('/api/tasks', verificarJWT, createTasksRouter({ tasksModel: TasksModel}))

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swagger)) // Documentation of the API
app.use(errorHandler) // Middleware for error handling
app.use((req, res) => {
    res.status(404).json({ message: 'Not found API' });
});

export default app