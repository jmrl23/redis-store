import type { RedisClientType } from 'redis';
import stringify from 'json-stringify-safe';

export default class RedisStore {
  constructor(
    public readonly client: RedisClientType,
    private readonly options: Options,
  ) {}

  public disconnect = this.client.disconnect.bind(this.client);

  public async get<T>(key: string): Promise<T | undefined> {
    const value = await this.client.get(this.key(key));
    const data = RedisStore.getValue<T>(value);
    return data;
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const data = stringify({ _: value } satisfies Data<T>);

    if (typeof ttl === 'undefined') {
      if (!this.options.ttl) {
        await this.client.set(this.key(key), data);
      } else {
        await this.client.set(this.key(key), data, {
          PX: this.options.ttl,
        });
      }
      return;
    }

    await this.client.set(this.key(key), data, {
      PX: ttl,
    });
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }

  async reset(): Promise<void> {
    const keys = await this.keys();
    await Promise.all(keys.map((key) => this.del(key)));
  }

  async mset(entries: Array<[string, unknown]>, ttl?: number): Promise<void> {
    await Promise.all(entries.map(([key, value]) => this.set(key, value, ttl)));
  }

  async mget<T>(...keys: string[]): Promise<Array<T | undefined>> {
    const data = await Promise.all(keys.map(this.get.bind(this)<T>));
    return data;
  }

  async mdel(...keys: string[]): Promise<void> {
    await Promise.all(keys.map(this.del.bind(this)));
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    const keys = await this.client.keys(this.key(pattern));
    const normalizedKeys = keys.map((key) =>
      !this.options.prefix ? key : key.slice(this.options.prefix.length + 1),
    );
    return normalizedKeys;
  }

  async ttl(key: string): Promise<number> {
    const data = await this.client.ttl(this.key(key));
    return data;
  }

  private static getValue<T>(value: string | null): T | undefined {
    if (value === null) return undefined;
    const data = JSON.parse(value) as Data<T>;
    const result = data._;
    return result;
  }

  private key(value: string): string {
    if (!this.options.prefix) return `${value}`;
    return `${this.options.prefix}:${value}`;
  }
}

export interface Options {
  prefix?: string;
  ttl?: number;
}

interface Data<T> {
  _: T;
}
