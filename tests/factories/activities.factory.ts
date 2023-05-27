import { prisma } from '@/config';

export function createLocation() {
  return prisma.locations.create({
    data: {
      name: 'Location 1',
    },
  });
}

export function createActivities(locationId: number) {
  const startsAt = new Date('2023-01-21T10:00:00');
  const endsAt = new Date('2023-01-21T12:00:00');
  return prisma.activities.create({
    data: {
      name: 'Jogar Golfe',
      startsAt,
      endsAt,
      capacity: 10,
      locationId,
    },
  });
}
