import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';

export async function get(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    res.send(userId);
  } catch (error) {
    console.log(error);
  }
}
