# @jmrl23/redis-store

Redis simplified wrapper

## Sample usage

```ts
import redisStore from '@jmrl23/redis-store';

async function main() {
  const store = redisStore({
    url: 'redis://',
    prefix: 'Example',
  });

  await store.set('message', 'Hello, World!');

  const message = await store.get<string>('message');

  console.log(message); // Hello, World!

  await store.del('message');

  await store.disconnect();
}

void main();
```

## Additional Options

| Key    | Description                     | Type    |
| ------ | ------------------------------- | ------- |
| prefix | Prefix for keys                 | string? |
| ttl    | Time to Live, `0` is to disable | number? |
