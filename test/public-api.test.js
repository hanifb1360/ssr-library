const test = require("node:test");
const assert = require("node:assert/strict");

const library = require("../src");

test("public API exposes the expected v2 functionality", () => {
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
    "renderToHTML",
    "ssrMiddleware"
  ].sort();

  assert.deepEqual(
    Object.keys(library).sort(),
    expectedExports
  );
});
