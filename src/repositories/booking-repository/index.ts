import { Booking } from '@prisma/client';
import { prisma } from '@/config';
import { BookingInput } from '@/protocols';

type CreateParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateParams = Omit<Booking, 'createdAt' | 'updatedAt'>;

async function create({ roomId, userId }: CreateParams): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function upsertBooking({ id, roomId, userId }: UpdateParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
    },
  });
}

async function bookingByUserInHotels(userId: number): Promise<BookingInput> {
  return prisma.$queryRaw`
    SELECT b.id AS id, 
      json_build_object(
        'name', r.name,
        'capacity', r.capacity
      ) AS room,
      json_build_object(
        'name', h.name,
        'image', h.image
      ) AS hotel,
      (SELECT COUNT(*) FROM "Booking" WHERE "roomId" = r.id)
      AS "personCount"
      FROM "Booking" b 
      INNER JOIN "Room" r ON r.id = b."roomId" 
      INNER JOIN "Hotel" h ON h.id = r."hotelId" 
      WHERE b."userId" = ${userId}
  `;
}

const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  bookingByUserInHotels,
};

export default bookingRepository;
