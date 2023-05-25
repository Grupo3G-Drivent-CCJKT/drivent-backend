import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { findActivitiesDates } from '@/controllers';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken).get('/', findActivitiesDates);

export { activitiesRouter };
