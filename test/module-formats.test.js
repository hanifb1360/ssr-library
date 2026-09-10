const test = require("node:test");
const assert = require("node:assert/strict");

const expectedExports = [
  "BaseComponent",
  "ConditionalComponent",
  "LayoutComponent",
  "SSRCache",
  "cache",
  "createCache",
  "escapeHTML",
  "propsToAttributes",
  "rawHTML",
  "renderTemplate",
  "renderToHTML",
  "ssrMiddleware"
].sort();

test("CommonJS package entry exposes the v2 API", () => {
  const library = require("..");

  assert.deepEqual(
    Object.keys(library).sort(),
    expectedExports
  );
});

test("ESM build exposes the v2 API", async () => {
  const library =
    await import("../dist/index.mjs");

  assert.deepEqual(
    Object.keys(library).sort(),
    expectedExports
  );
});
