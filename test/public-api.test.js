const test = require("node:test");
const assert = require("node:assert/strict");

const library = require("../src");

test("public API exposes the expected v1 functionality", () => {
  const expectedExports = [
    "BaseComponent",
    "renderToHTML",
    "propsToAttributes",
    "cache",
    "diffDOM",
    "renderWithDiff",
    "LayoutComponent",
    "ConditionalComponent",
    "escapeHTML",
    "rawHTML",
    "SSRCache",
    "createCache",
    "ssrMiddleware",
  ];

  for (const name of expectedExports) {
    assert.ok(name in library, `Expected public export "${name}"`);
  }
});
