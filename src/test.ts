import redisStore from './main';
import assert from 'node:assert';

async function main() {
  const store = redisStore({
    url: 'redis://',
    prefix: 'Test',
  });

  await store.set('message-1', 'Hello, World 1');
  assert.strictEqual(
    await store.get('message-1'),
    'Hello, World 1',
    'Should return the value of `message-1`',
  );

  await store.del('message-1');
  assert.strictEqual(
    await store.get('message-1'),
    undefined,
    '`Should remove the `message-1` froom the store',
  );

  await store.mset([
    ['message-1', 'Hello, World 1'],
    ['message-2', 'Hello, World 2'],
    ['message-3', 'Hello, World 3'],
    ['message-4', 'Hello, World 4'],
    ['message-5', 'Hello, World 5'],
    ['message-6', 'Hello, World 6'],
  ]);
  assert.strictEqual((await store.keys()).length, 6, 'Should have 6 items');
  assert.deepStrictEqual(
    await store.mget('message-1', 'message-2', 'message-3'),
    ['Hello, World 1', 'Hello, World 2', 'Hello, World 3'],
    'Should get the values of messages 1 to 3',
  );

  await store.reset();
  assert.deepStrictEqual(
    await store.keys(),
    [],
    'Should remove all of the items',
  );

  const testObject = { message: 'test' };
  await store.set('test-object', testObject);
  assert.deepStrictEqual(
    await store.get('test-object'),
    testObject,
    'Should be able to store objects',
  );

  await store.set('test-value', true, 1000);
  assert.deepEqual(
    await store.get('test-value'),
    true,
    '`test-value` should have a value',
  );
  await new Promise((resolve) => setTimeout(resolve, 1100));
  assert.deepEqual(
    await store.get('test-value'),
    undefined,
    '`test-value` should be expired',
  );

  await store.reset();
  await store.disconnect();
}

void main();
