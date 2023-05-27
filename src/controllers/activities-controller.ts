import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';

export async function findActivitiesDates(req: AuthenticatedRequest, res: Response) {
  try {
    const dates: string[] = await activitiesService.findActivitiesDates();
    res.send(dates);
  } catch (error) {
    console.log(error);
  }
}

export async function findActivitiesByDate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { date } = req.query;
  try {
    const activitiesByDate = await activitiesService.findActivitiesByDate(date as string);
    console.log(activitiesByDate);
    res.send(activitiesByDate);
  } catch (error) {
    next(error);
  }
}
