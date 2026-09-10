const test = require("node:test");
const assert = require("node:assert/strict");

const { ssrMiddleware } = require("../src/middleware/expressMiddleware");

test("ssrMiddleware sends generated HTML", () => {
  let responseBody;

  const middleware = ssrMiddleware(
    () => "<h1>Hello</h1>"
  );

  const req = {};

  const res = {
    send(value) {
      responseBody = value;
    }
  };

  middleware(req, res);

  assert.equal(responseBody, "<h1>Hello</h1>");
});
