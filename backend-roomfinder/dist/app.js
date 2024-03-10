import express, { json } from 'express';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { options } from "./swaggerOptions.js";
import { corsMiddleware } from './middlewares/cors.js';
import morgan from "morgan";
// Importar las rutas
import { createUsersRouter } from './routes/users.js';
import { createPropertiesRouter } from './routes/properties.js';
import { createLessorsRouter } from './routes/lessors.js';
import { createStudentsRouter } from './routes/students.js';
// Importar el modelo de la base de datos
// PostgreSQL
import { UsersModel } from './model/postgresql/user.js';
import { PropertiesModel } from './model/postgresql/propertie.js';
import { LessorsModel } from './model/postgresql/lessor.js';
import { StudentsModel } from './model/postgresql/student.js';
//MySQL 
// import { UsersModel } from './model/mysql/user.js'
// import { PropertiesModel } from './model/mysql/propertie.js'
// import { LessorsModel } from './model/mysql/lessor.js'
// import { StudentsModel } from './model/mysql/student.js'

const swagger = swaggerJSDoc(options);
const app = express();
app.use(corsMiddleware());
app.use(morgan("dev"));
app.use(json());
app.disable('x-powered-by');
app.use('/users', createUsersRouter({
  userModel: UsersModel
}));
app.use('/properties', createPropertiesRouter({
  propertieModel: PropertiesModel
}));
app.use('/lessors', createLessorsRouter({
  lessorModel: LessorsModel
}));
app.use('/students', createStudentsRouter({
  studentModel: StudentsModel
}));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagger));
export default app;