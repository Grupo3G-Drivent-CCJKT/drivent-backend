import { Activities } from '@prisma/client';
import { prisma } from '@/config';
import { ActivitiesDates, LocationsActivitiesInput } from '@/protocols';

async function findActivitiesByDate(date: Date): Promise<LocationsActivitiesInput[]> {
  return await prisma.$queryRaw`
      SELECT l.id AS id,
        l.name AS name,
        CASE
          WHEN COUNT(a.id) = 0 THEN '[]'
          ELSE json_agg(
            json_build_object(
              'id', a.id,
              'name', a.name,
              'startsAt', a."startsAt",
              'endsAt', a."endsAt",
              'available', a.capacity - COALESCE(sub.registers, 0),
              'capacity', a.capacity
            )
          )
        END AS activities
      FROM "Locations" l
      LEFT JOIN (
        SELECT *
        FROM "Activities"
        WHERE DATE("startsAt") = ${date}
      ) a ON l.id = a."locationId"
      LEFT JOIN (
        SELECT "activityId", count(*) AS registers
        FROM "Register" r
        GROUP BY "activityId"
      ) AS sub ON sub."activityId" = a.id
      GROUP BY l.id;
    `;
}

async function findActivitiesDates(): Promise<ActivitiesDates[]> {
  return prisma.activities.findMany({
    select: {
      startsAt: true,
    },
  });
}

async function createRegister(userId: number, activityId: number) {
  return await prisma.register.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function findRegistersByUserId(userId: number) {
  return await prisma.register.findMany({
    where: {
      userId: userId,
    },
  });
}

async function findActivitiy(id: number): Promise<Activities> {
  return prisma.activities.findUnique({
    where: { id },
  });
}

async function findActivitiesByUserId(userId: number) {
  return await prisma.activities.findMany({
    where: {
      Register: {
        some: {
          userId: { equals: userId },
        },
      },
    },
  });
}

const activitiesRepository = {
  findActivitiesByDate,
  findActivitiesDates,
  createRegister,
  findRegistersByUserId,
  findActivitiy,
  findActivitiesByUserId,
};

export default activitiesRepository;
