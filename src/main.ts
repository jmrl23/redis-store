import {
  type RedisClientOptions,
  type RedisClientType,
  createClient,
} from 'redis';
import RedisStore, { type Options } from './redis-store';

export default function redisStore(
  options: RedisClientOptions & Options,
): RedisStore {
  const { prefix, ttl, ...redisClientOptions } = options;
  const storeOptions = { prefix, ttl };
  const redisClient = createClient(redisClientOptions);

  redisClient.connect();

  const redisStore = new RedisStore(
    redisClient as RedisClientType,
    storeOptions,
  );

  return redisStore;
}
