export interface SSRResponse {
  send(html: string): unknown;
}

export type SSRNextFunction = (
  error: unknown
) => unknown;

export type SSRRenderFunction<
  Request = unknown
> = (
  request: Request
) => string | PromiseLike<string>;

function isPromiseLike(
  value: unknown
): value is PromiseLike<unknown> {
  if (
    value === null ||
    (
      typeof value !== "object" &&
      typeof value !== "function"
    )
  ) {
    return false;
  }

  return (
    typeof (
      value as {
        then?: unknown;
      }
    ).then === "function"
  );
}

export function ssrMiddleware<
  Request = unknown
>(
  generateHTML:
    SSRRenderFunction<Request>
) {
  if (
    typeof generateHTML !== "function"
  ) {
    throw new TypeError(
      "ssrMiddleware requires a render function."
    );
  }

  return (
    req: Request,
    res: SSRResponse,
    next?: SSRNextFunction
  ): unknown | Promise<unknown> => {
    const handleError = (
      error: unknown
    ): unknown => {
      if (typeof next === "function") {
        return next(error);
      }

      throw error;
    };

    const sendHTML = (
      html: unknown
    ): unknown => {
      if (typeof html !== "string") {
        throw new TypeError(
          "SSR render function must return a string."
        );
      }

      return res.send(html);
    };

    try {
      const result =
        generateHTML(req);

      if (isPromiseLike(result)) {
        return Promise.resolve(result)
          .then(sendHTML)
          .catch(handleError);
      }

      return sendHTML(result);
    } catch (error: unknown) {
      return handleError(error);
    }
  };
}
