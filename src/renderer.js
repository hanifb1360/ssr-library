function renderToHTML(component, options = {}) {
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

    const cachedOutput = cache.get(cacheKey);

    if (cachedOutput !== undefined) {
      return cachedOutput;
    }
  } else if (cacheKey !== undefined) {
    throw new TypeError(
      "cacheKey requires a cache."
    );
  }

  let output;

  try {
    output = component.render();
  } catch (error) {
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

  if (cache !== undefined) {
    cache.set(cacheKey, output);
  }

  return output;
}

module.exports = { renderToHTML };
