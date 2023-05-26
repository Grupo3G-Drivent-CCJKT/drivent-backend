import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import {
  findActivitiesByDate,
  findActivitiesDates,
  subscribeInActivities,
  findActivitiesByUserId,
} from '@/controllers';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', findActivitiesDates)
  .get('/locations', findActivitiesByDate)
  .post('/', subscribeInActivities)
  .get('/subscriptions', findActivitiesByUserId);

export { activitiesRouter };
