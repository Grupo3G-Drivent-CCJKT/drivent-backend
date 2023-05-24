import { ActivitiesDates } from '@/protocols';
import activitiesRepository from '@/repositories/activities-repository';

async function findActivitiesDates() {
  const dates: ActivitiesDates[] = await activitiesRepository.findActivitiesDates();
  return [...new Set(dates.map((event) => event.startsAt.toISOString().split('T')[0]))];
}

const activitiesService = {
  findActivitiesDates,
};

export default activitiesService;
