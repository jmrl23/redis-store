# Cache Manager Redis Store

Redis store for [Cache Manager](https://www.npmjs.com/package/cache-manager)

## Sample usage

```ts
import { caching } from 'cache-manager';
import redisStore from '@jmrl23/redis-store';

async function main() {
  const store = await redisStore({
    url: 'redis://',
    prefix: 'example',
    ttl: 0,
  });
  const cache = await caching(store);

  await cache.set('message', 'Hello, World!');

  const message = await cache.get<string>('message');

  console.log(message); // Hello, World!

  await store.disconnect();
}

void main();
```

## Options

| Key    | Description                     | Defaults  |
| ------ | ------------------------------- | --------- |
| prefix | prefix for keys                 | undefined |
| ttl    | Time to Live, `0` is to disable | undefined |
