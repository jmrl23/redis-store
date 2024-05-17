import {
  type RedisClientOptions,
  type RedisClientType,
  createClient,
} from 'redis';
import RedisStore, { type Options } from './redis-store';

export default async function redisStore(
  clientOptions: RedisClientOptions = {},
  storeOptions: Options = {},
): Promise<RedisStore> {
  const redisClient = createClient(clientOptions);

  await redisClient.connect();

  const redisStore = new RedisStore(
    redisClient as RedisClientType,
    storeOptions,
  );

  return redisStore;
}
