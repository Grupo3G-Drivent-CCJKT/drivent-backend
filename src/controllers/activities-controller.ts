import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
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
    res.send(activitiesByDate);
  } catch (error) {
    next(error);
  }
}

export async function subscribeInActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { activityId } = req.body;
  try {
    const data = await activitiesService.subscribeInActivities(userId, Number(activityId));
    return res.status(httpStatus.CREATED).send(data);
  } catch (error) {
    next(error);
  }
}

export async function findActivitiesByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const subscribedActivities = await activitiesService.findActivitiesByUserId(userId);
    return res.status(httpStatus.OK).send(subscribedActivities);
  } catch (error) {
    next(error);
  }
}
