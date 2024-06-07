import {
  type RedisClientOptions,
  type RedisClientType,
  createClient,
} from 'redis';
import RedisStore, { type Options } from './redis-store';

export default async function redisStore(
  options: RedisClientOptions & Options & { id: string },
): Promise<RedisStore> {
  const { id, prefix, ttl, ...rest } = options;
  const redisClient = createClient(rest);

  await redisClient.connect();

  const storeOptions = { prefix, ttl };
  const redisStore = new RedisStore(
    redisClient as RedisClientType,
    storeOptions,
    id,
  );

  return redisStore;
}
