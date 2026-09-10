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

test("ssrMiddleware passes the request to the render function", () => {
  const req = {
    url: "/profile",
    user: { name: "Hanif" }
  };

  let receivedRequest;
  let responseBody;

  const middleware = ssrMiddleware((request) => {
    receivedRequest = request;
    return `<h1>${request.user.name}</h1>`;
  });

  middleware(req, {
    send(value) {
      responseBody = value;
    }
  });

  assert.equal(receivedRequest, req);
  assert.equal(responseBody, "<h1>Hanif</h1>");
});

test("ssrMiddleware supports async render functions", async () => {
  let responseBody;

  const middleware = ssrMiddleware(async () => {
    return "<h1>Async</h1>";
  });

  await middleware(
    {},
    {
      send(value) {
        responseBody = value;
      }
    }
  );

  assert.equal(responseBody, "<h1>Async</h1>");
});

test("ssrMiddleware forwards synchronous errors to next", () => {
  const expectedError = new Error("Render failed");
  let receivedError;

  const middleware = ssrMiddleware(() => {
    throw expectedError;
  });

  middleware(
    {},
    { send() {} },
    (error) => {
      receivedError = error;
    }
  );

  assert.equal(receivedError, expectedError);
});

test("ssrMiddleware forwards async errors to next", async () => {
  const expectedError = new Error("Async render failed");
  let receivedError;

  const middleware = ssrMiddleware(async () => {
    throw expectedError;
  });

  await middleware(
    {},
    { send() {} },
    (error) => {
      receivedError = error;
    }
  );

  assert.equal(receivedError, expectedError);
});

test("ssrMiddleware rejects non-string render output", () => {
  let receivedError;

  const middleware = ssrMiddleware(() => {
    return { html: "<h1>Hello</h1>" };
  });

  middleware(
    {},
    { send() {} },
    (error) => {
      receivedError = error;
    }
  );

  assert.ok(receivedError instanceof TypeError);
  assert.match(
    receivedError.message,
    /must return a string/
  );
});

test("ssrMiddleware validates the render function", () => {
  assert.throws(
    () => ssrMiddleware(null),
    {
      name: "TypeError",
      message: "ssrMiddleware requires a render function."
    }
  );
});

test("ssrMiddleware throws render errors when next is unavailable", () => {
  const expectedError = new Error("Render failed");

  const middleware = ssrMiddleware(() => {
    throw expectedError;
  });

  assert.throws(
    () => middleware({}, { send() {} }),
    expectedError
  );
});

test("ssrMiddleware rejects async render errors when next is unavailable", async () => {
  const expectedError = new Error("Async render failed");

  const middleware = ssrMiddleware(async () => {
    throw expectedError;
  });

  await assert.rejects(
    middleware({}, { send() {} }),
    expectedError
  );
});
