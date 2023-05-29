import { dateIsNotValid } from '@/errors/date-isnotvalid-error';
import { LocationsActivitiesInput, ActivitiesDates } from '@/protocols';
import activitiesRepository from '@/repositories/activities-repository';
import { isStringDateValid } from '@/utils/validDate-utils';
import { notFoundError } from '@/errors';

async function findActivitiesDates() {
  const dates: ActivitiesDates[] = await activitiesRepository.findActivitiesDates();
  return [...new Set(dates.map((event) => event.startsAt.toISOString().split('T')[0]))];
}

async function findActivitiesByDate(date: string): Promise<LocationsActivitiesInput[]> {
  if (!isStringDateValid(date)) {
    throw dateIsNotValid();
  }
  const activitiesByDate = await activitiesRepository.findActivitiesByDate(new Date(date));
  return activitiesByDate;
}

async function subscribeInActivities(userId: number, activityId: number) {
  if (!userId || !activityId) throw notFoundError();
  return await activitiesRepository.createRegister(userId, activityId);
}

async function findActivitiesByUserId(userId: number) {
  return await activitiesRepository.findActivitiesByUserId(userId);
}

const activitiesService = {
  findActivitiesDates,
  findActivitiesByDate,
  subscribeInActivities,
  findActivitiesByUserId,
};

export default activitiesService;
