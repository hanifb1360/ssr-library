declare const rawHTMLBrand: unique symbol;

export interface RawHTML {
  readonly value: string;
  readonly [rawHTMLBrand]: true;
}

export declare function escapeHTML(
  value: unknown
): string;

export declare function rawHTML(
  value: unknown
): RawHTML;

export declare class BaseComponent {
  constructor(
    props?: Record<string, unknown>
  );

  props: Record<string, unknown>;
  children: BaseComponent[];

  setChildren(
    children: BaseComponent[]
  ): void;

  render(): string;

  renderTemplate(
    template: string
  ): string;
}

export interface CacheOptions {
  maxEntries?: number;
  ttl?: number;
}

export declare class SSRCache {
  constructor(options?: CacheOptions);

  get(key: string): string | undefined;

  set(
    key: string,
    value: string
  ): void;

  has(key: string): boolean;

  delete(key: string): boolean;

  clear(): void;

  readonly size: number;
}

export declare function createCache(
  options?: CacheOptions
): SSRCache;

export declare const cache: SSRCache;

export interface RenderToHTMLOptions {
  cache?: SSRCache;
  cacheKey?: string;
}

export declare function renderToHTML(
  component: BaseComponent,
  options?: RenderToHTMLOptions
): string;

export declare function propsToAttributes(
  props?: Record<string, unknown>
): string;

export declare function diffDOM(
  oldHTML: string,
  newHTML: string
): string | null;

export declare function renderWithDiff(
  renderFunc: (
    props?: unknown
  ) => string,
  previousHTML: string,
  props?: unknown
): string;

export declare class LayoutComponent
  extends BaseComponent {}

export declare class ConditionalComponent
  extends BaseComponent {}

export interface SSRResponse {
  send(html: string): unknown;
}

export type SSRNextFunction = (
  error?: unknown
) => unknown;

export type SSRRenderFunction<Request = unknown> = (
  request: Request
) => string | Promise<string>;

export declare function ssrMiddleware<
  Request = unknown
>(
  renderFn: SSRRenderFunction<Request>
): (
  req: Request,
  res: SSRResponse,
  next?: SSRNextFunction
) => unknown | Promise<unknown>;
