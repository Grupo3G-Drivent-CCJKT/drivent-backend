import { prisma } from '@/config';
import { HotelsInput } from '@/protocols';

async function findHotels(): Promise<HotelsInput[]> {
  return await prisma.$queryRaw`
    SELECT h.id AS id,
      h.name AS name,
      h.image AS image,
      sum(r.capacity - coalesce(subquery.bookings, 0)) AS totalAvailableRooms,
      json_agg(
        json_build_object(
          'id', r.id,
          'name', r.name,
          'capacity', r.capacity,
          'hotelId', r."hotelId",
          'bookings', coalesce(subquery.bookings, 0),
          'available', r.capacity - coalesce(subquery.bookings, 0)
        )
      ) AS Rooms
    FROM "Hotel" h
    INNER JOIN "Room" r ON r."hotelId" = h.id
    LEFT JOIN (
      SELECT "roomId", count(*) AS bookings
      FROM "Booking"
      GROUP BY "roomId"
    ) AS subquery ON subquery."roomId" = r.id
    GROUP BY h.id
  `;
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: {
        include: {
          _count: {
            select: {
              Booking: true,
            },
          },
        },
      },
    },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;
