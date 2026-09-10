class SSRCache {
  constructor(options = {}) {
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
    this.entries = new Map();
  }

  get(key) {
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

    // Refresh insertion order for LRU behavior.
    this.entries.delete(key);
    this.entries.set(key, entry);

    return entry.value;
  }

  set(key, value) {
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

    while (this.entries.size > this.maxEntries) {
      const oldestKey =
        this.entries.keys().next().value;

      this.entries.delete(oldestKey);
    }
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    this.validateKey(key);
    return this.entries.delete(key);
  }

  clear() {
    this.entries.clear();
  }

  get size() {
    this.purgeExpired();
    return this.entries.size;
  }

  purgeExpired() {
    const now = Date.now();

    for (const [key, entry] of this.entries) {
      if (
        entry.expiresAt !== null &&
        entry.expiresAt <= now
      ) {
        this.entries.delete(key);
      }
    }
  }

  validateKey(key) {
    if (typeof key !== "string") {
      throw new TypeError(
        "Cache keys must be strings."
      );
    }
  }
}

function createCache(options) {
  return new SSRCache(options);
}

// Kept as a convenient shared cache, but renderToHTML
// does not use it unless explicitly requested.
const cache = createCache();

module.exports = {
  SSRCache,
  createCache,
  cache
};
