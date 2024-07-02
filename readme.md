# Cache Manager Redis Store

Redis store for [Cache Manager](https://www.npmjs.com/package/cache-manager)

## Sample usage

```ts
import { caching } from 'cache-manager';
import redisStore from '@jmrl23/redis-store';

async function main() {
  const store = redisStore({
    url: 'redis://',
    prefix: 'Example',
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

| Key    | Description                     | Type    |
| ------ | ------------------------------- | ------- |
| prefix | Prefix for keys                 | string? |
| ttl    | Time to Live, `0` is to disable | number? |
