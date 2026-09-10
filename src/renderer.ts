export interface Renderable {
  render(): string;
}

export interface HTMLCache {
  get(key: string):
    string | undefined;

  set(
    key: string,
    value: string
  ): void;
}

export interface RenderToHTMLOptions {
  cache?: HTMLCache;
  cacheKey?: string;
}

export function renderToHTML(
  component: Renderable,
  options: RenderToHTMLOptions = {}
): string {
  if (
    !component ||
    typeof component.render !== "function"
  ) {
    throw new Error(
      "Invalid component. Must implement a render method."
    );
  }

  if (
    options === null ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    throw new TypeError(
      "renderToHTML options must be an object."
    );
  }

  const {
    cache,
    cacheKey
  } = options;

  let resolvedCache:
    | {
        cache: HTMLCache;
        key: string;
      }
    | undefined;

  if (cache !== undefined) {
    if (
      !cache ||
      typeof cache.get !== "function" ||
      typeof cache.set !== "function"
    ) {
      throw new TypeError(
        "renderToHTML cache must implement get and set."
      );
    }

    if (typeof cacheKey !== "string") {
      throw new TypeError(
        "cacheKey is required when caching is enabled."
      );
    }

    resolvedCache = {
      cache,
      key: cacheKey
    };

    const cachedOutput =
      resolvedCache.cache.get(
        resolvedCache.key
      );

    if (cachedOutput !== undefined) {
      return cachedOutput;
    }
  } else if (cacheKey !== undefined) {
    throw new TypeError(
      "cacheKey requires a cache."
    );
  }

  let output: string;

  try {
    output = component.render();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Render method encountered an error."
    );
  }

  if (typeof output !== "string") {
    throw new TypeError(
      "Render method must return a string."
    );
  }

  if (resolvedCache !== undefined) {
    resolvedCache.cache.set(
      resolvedCache.key,
      output
    );
  }

  return output;
}
