import { dateIsNotValid } from '@/errors/date-isnotvalid-error';
import { LocationsActivitiesInput, ActivitiesDates, ActivitiesInput } from '@/protocols';
import activitiesRepository from '@/repositories/activities-repository';
import { isStringDateValid } from '@/utils/validDate-utils';

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

const activitiesService = {
  findActivitiesDates,
  findActivitiesByDate,
};

export default activitiesService;
