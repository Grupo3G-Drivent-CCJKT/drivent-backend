import { Response } from 'express';
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
