import { prisma } from '@/config';
import getOrSetCache from '@/utils/redis-utils';

async function findFirst() {
  return getOrSetCache('event', prisma.event.findFirst);
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
