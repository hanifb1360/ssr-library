export interface CacheOptions {
  maxEntries?: number;
  ttl?: number;
}

interface CacheEntry {
  value: string;
  expiresAt: number | null;
}

export class SSRCache {
  readonly maxEntries: number;
  readonly ttl: number;

  private readonly entries =
    new Map<string, CacheEntry>();

  constructor(options: CacheOptions = {}) {
    const {
      maxEntries = 100,
      ttl = 0
    } = options;

    if (
      !Number.isInteger(maxEntries) ||
      maxEntries <= 0
    ) {
      throw new TypeError(
        "maxEntries must be a positive integer."
      );
    }

    if (
      typeof ttl !== "number" ||
      !Number.isFinite(ttl) ||
      ttl < 0
    ) {
      throw new TypeError(
        "ttl must be a non-negative finite number."
      );
    }

    this.maxEntries = maxEntries;
    this.ttl = ttl;
  }

  get(key: string): string | undefined {
    this.validateKey(key);

    const entry = this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (
      entry.expiresAt !== null &&
      entry.expiresAt <= Date.now()
    ) {
      this.entries.delete(key);
      return undefined;
    }

    this.entries.delete(key);
    this.entries.set(key, entry);

    return entry.value;
  }

  set(key: string, value: string): void {
    this.validateKey(key);

    if (typeof value !== "string") {
      throw new TypeError(
        "Cache values must be strings."
      );
    }

    this.purgeExpired();

    if (this.entries.has(key)) {
      this.entries.delete(key);
    }

    this.entries.set(key, {
      value,
      expiresAt:
        this.ttl === 0
          ? null
          : Date.now() + this.ttl
    });

    while (
      this.entries.size >
      this.maxEntries
    ) {
      const oldest =
        this.entries.keys().next();

      if (oldest.done) {
        break;
      }

      this.entries.delete(oldest.value);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    this.validateKey(key);
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }

  get size(): number {
    this.purgeExpired();
    return this.entries.size;
  }

  private purgeExpired(): void {
    const now = Date.now();

    for (
      const [key, entry]
      of this.entries
    ) {
      if (
        entry.expiresAt !== null &&
        entry.expiresAt <= now
      ) {
        this.entries.delete(key);
      }
    }
  }

  private validateKey(
    key: unknown
  ): asserts key is string {
    if (typeof key !== "string") {
      throw new TypeError(
        "Cache keys must be strings."
      );
    }
  }
}

export function createCache(
  options?: CacheOptions
): SSRCache {
  return new SSRCache(options);
}

export const cache = createCache();
