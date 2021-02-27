import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import createConnection from './database/connection';
import errorHandler from './errors/handler';
import routes from './routes';

createConnection();

const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandler);

export default app;
