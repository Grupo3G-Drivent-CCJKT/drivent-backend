import { redisClient } from '@/config/redisconfig';

export default function getOrSetCache<T>(key: string, callBack: () => Promise<T>) {
  return new Promise<T>(async (resolve, reject) => {
    const data = await redisClient.get(key);
    if (data) resolve(JSON.parse(data));
    else {
      const newData = await callBack();
      redisClient.set(key, JSON.stringify(newData));
      resolve(newData);
    }
    reject('Redis error');
  });
}
