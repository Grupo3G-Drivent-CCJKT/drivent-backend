import { Activities } from '@prisma/client';
import { dateIsNotValid } from '@/errors/date-isnotvalid-error';
import { LocationsActivitiesInput, ActivitiesDates } from '@/protocols';
import activitiesRepository from '@/repositories/activities-repository';
import { isStringDateValid } from '@/utils/validDate-utils';
import { conflictError, notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';

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
  const subscribedActivities = await activitiesRepository.findActivitiesByUserId(userId);
  if (await hasConflit(subscribedActivities, activityId))
    throw conflictError('Cannot subscribe to activity with time conflit');
  return await activitiesRepository.createRegister(userId, activityId);
}

async function findRegistersByUserId(userId: number) {
  return await activitiesRepository.findRegistersByUserId(userId);
}

async function hasConflit(subscribedActivities: Activities[], activityId: number) {
  const activity = await activitiesRepository.findActivitiy(activityId);
  if (!activity) throw badRequestError();
  const conflitedActivieties = subscribedActivities.filter((s) => {
    if (s.startsAt.getTime() <= activity.startsAt.getTime() && activity.startsAt.getTime() <= s.endsAt.getTime())
      return true; // b starts in a
    if (s.startsAt.getTime() <= activity.endsAt.getTime() && activity.endsAt.getTime() <= s.endsAt.getTime())
      return true; // b ends in a
    if (activity.startsAt.getTime() < s.startsAt.getTime() && s.endsAt.getTime() < activity.endsAt.getTime())
      return true; // a in b
    return false;
  });
  return conflitedActivieties.length !== 0;
}

const activitiesService = {
  findActivitiesDates,
  findActivitiesByDate,
  subscribeInActivities,
  findRegistersByUserId,
};

export default activitiesService;
