import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { findActivitiesByDate, findActivitiesDates } from '@/controllers';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken).get('/', findActivitiesDates).get('/locations', findActivitiesByDate);

export { activitiesRouter };
