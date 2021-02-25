import { Router } from 'express';
import UserController from './controllers/UserController';
import SurveyController from './controllers/SurveyController';

const userController = new UserController();
const surveyController = new SurveyController();

const routes = Router();

routes.post('/users', userController.create);

routes.get('/surveys', surveyController.show);
routes.post('/surveys', surveyController.create);

export default routes;
