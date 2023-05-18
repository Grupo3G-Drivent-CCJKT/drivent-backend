import { createClient } from 'redis';

const redisClient = createClient();

export const redisConnect = async () => await redisClient.connect();

export { redisClient };
