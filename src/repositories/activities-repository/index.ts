import { prisma } from '@/config';
import { LocationsActivitiesInput } from '@/protocols';

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

const activitiesRepository = {
  findActivitiesByDate,
};

export default activitiesRepository;
