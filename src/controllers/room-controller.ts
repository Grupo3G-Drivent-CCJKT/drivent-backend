import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import roomService from '@/services/room-service';

export async function getRoomsWithOccupiedQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const rooms = await roomService.getRoomsWithOccupiedQuantity(userId, Number(hotelId));

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    next(error);
  }
}
