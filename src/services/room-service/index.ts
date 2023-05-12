import hotelsService from '../hotels-service';
import { notFoundError } from '@/errors';
import roomRepository from '@/repositories/room-repository';
import { badRequestError } from '@/errors/bad-request-error';

async function getRoomsWithOccupiedQuantity(userId: number, hotelId: number) {
  if (!hotelId) throw badRequestError();
  await hotelsService.listHotels(userId);

  const rooms = await roomRepository.findAllByHotelIdWithOccupiedQuantity(hotelId);
  if (!rooms || rooms.length === 0) {
    throw notFoundError();
  }
  return rooms;
}

export default {
  getRoomsWithOccupiedQuantity,
};
