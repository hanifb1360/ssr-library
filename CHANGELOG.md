# Changelog

All notable changes to this project are documented here.

This project follows Semantic Versioning.

## 2.0.0 - 2026-09-10

### Added

- TypeScript as the single source of truth with generated type declarations.
- Native ESM and CommonJS package entry points.
- Safe HTML escaping for template interpolation and attribute values.
- `rawHTML()` for explicitly trusted HTML.
- Public `renderTemplate()` utility.
- Explicit bounded caching with configurable maximum entries and TTL.
- LRU-style cache eviction.
- Async SSR middleware support.
- Request forwarding and middleware error propagation.
- Package consumer tests for CommonJS, ESM, and TypeScript.
- CI testing on Node.js 22, 24, and 26.
- Enforced test coverage thresholds.

### Changed

- `renderToHTML()` is deterministic by default and no longer caches automatically.
- Rendering cache usage is now explicit through `cache` and `cacheKey`.
- Cache keys are explicitly controlled by the application.
- Dynamic template values are escaped by default.
- Middleware no longer requires Express as a package dependency.
- The npm package now ships compiled distribution files instead of duplicated source implementations.
- Node.js 22 or newer is required.

### Removed

- `diffDOM()`.
- `renderWithDiff()`.
- The misleading virtual DOM implementation.
- The Express runtime dependency.
- Jest, Supertest, and other unnecessary development dependencies.
- Handwritten duplicate TypeScript declarations.

### Security

HTML interpolation now escapes `&`, `<`, `>`, double quotes, and single quotes by default.

`rawHTML()` deliberately bypasses escaping and must only be used with trusted HTML. Escaping HTML does not by itself sanitize arbitrary URLs, JavaScript, CSS, or other context-sensitive values.
