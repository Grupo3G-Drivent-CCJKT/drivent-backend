import { prisma } from '@/config';

async function findAllByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function findAllByHotelIdWithOccupiedQuantity(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
    include: {
      _count: {
        select: {
          Booking: true,
        },
      },
    },
  });
}

const roomRepository = {
  findAllByHotelId,
  findById,
  findAllByHotelIdWithOccupiedQuantity,
};

export default roomRepository;
