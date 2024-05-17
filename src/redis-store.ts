import type { Store } from 'cache-manager';
import type { RedisClientType } from 'redis';

export default class RedisStore implements Store {
  constructor(
    public readonly client: RedisClientType,
    private readonly options: Options = {},
  ) {}

  public disconnect = this.client.disconnect.bind(this.client);

  public async get<T>(key: string): Promise<T | undefined> {
    const value = await this.client.get(this.key(key));
    const data = RedisStore.readValue<T>(value);

    return data;
  }

  public async set<T>(key: string, value: T, ttl?: Seconds): Promise<void> {
    const data = JSON.stringify({ data: value } satisfies Data<T>);

    if (typeof ttl === 'undefined') {
      await this.client.set(this.key(key), data);
      return;
    }

    await this.client.setEx(this.key(key), ttl, data);
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }

  async reset(): Promise<void> {
    await this.client.flushDb();
  }

  async mset(entries: Array<[string, unknown]>, ttl?: Seconds): Promise<void> {
    await Promise.all(entries.map(([key, value]) => this.set(key, value, ttl)));
  }

  async mget<T>(...keys: string[]): Promise<Array<T | undefined>> {
    const data = await Promise.all(keys.map(this.get<T>));

    return data;
  }

  async mdel(...keys: string[]): Promise<void> {
    await this.client.del(keys);
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    const keys = await this.client.keys(this.key(pattern));
    const normalizedKeys = keys.map((key) =>
      !this.options.keyPrefix
        ? key
        : key.slice(this.options.keyPrefix.length + 1),
    );

    return normalizedKeys;
  }

  async ttl(key: string): Promise<number> {
    const data = await this.client.ttl(this.key(key));
    return data;
  }

  private static readValue<T>(value: string | null): T | undefined {
    if (value === null) return undefined;

    const data = JSON.parse(value) as Data<T>;
    const result = data.data;

    return result;
  }

  private key(value: string): string {
    if (!this.options.keyPrefix) return value;
    return `${this.options.keyPrefix}:${value}`;
  }
}

export interface Options {
  keyPrefix?: string;
}

interface Data<T> {
  data: T;
}

export type Seconds = number;
