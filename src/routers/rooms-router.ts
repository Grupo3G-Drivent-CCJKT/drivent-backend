import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getRoomsWithOccupiedQuantity } from '@/controllers';

const roomsRouter = Router();

roomsRouter.all('/*', authenticateToken).get('/:hotelId', getRoomsWithOccupiedQuantity);

export { roomsRouter };
