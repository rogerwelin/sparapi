import { Router } from 'express';
import sparRouter from './spar.routes';

const routes = Router();

routes.use('/personsok', sparRouter);

export default routes;