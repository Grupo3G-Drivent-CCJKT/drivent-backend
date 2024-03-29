import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import { cannotBookingError } from '@/errors/cannot-booking-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function checkValidBooking(roomId: number) {
  const room = await roomRepository.findById(roomId);
  const bookings = await bookingRepository.findByRoomId(roomId);

  if (!room) throw notFoundError();
  if (room.capacity <= bookings.length) throw cannotBookingError();
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function bookingRoomById(userId: number, roomId: number) {
  if (!roomId) throw badRequestError();

  await checkEnrollmentTicket(userId);
  await checkValidBooking(roomId);

  await bookingRepository.create({ roomId, userId });

  return bookingRepository.bookingByUserInHotels(userId);
}

async function changeBookingRoomById(userId: number, roomId: number) {
  if (!roomId) throw badRequestError();

  await checkValidBooking(roomId);
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking || booking.userId !== userId) throw cannotBookingError();

  await bookingRepository.upsertBooking({
    id: booking.id,
    roomId,
    userId,
  });

  return bookingRepository.bookingByUserInHotels(userId);
}

const bookingService = {
  bookingRoomById,
  getBooking,
  changeBookingRoomById,
  checkEnrollmentTicket,
  checkValidBooking,
};

export default bookingService;
