const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderTemplate
} = require("../src/utils/templateRenderer");

const {
  propsToAttributes
} = require("../src/utils/propsToAttributes");

const {
  escapeHTML,
  rawHTML
} = require("../src/utils/html");

const {
  createCache
} = require("../src/utils/cache");

test("escapeHTML escapes HTML special characters", () => {
  assert.equal(
    escapeHTML(`<script>alert("x") & 'y'</script>`),
    "&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;"
  );
});

test("escapeHTML handles nullish values", () => {
  assert.equal(escapeHTML(null), "");
  assert.equal(escapeHTML(undefined), "");
});

test("renderTemplate replaces placeholders", () => {
  assert.equal(
    renderTemplate(
      "<p>{{ greeting }}, {{name}}!</p>",
      {
        greeting: "Hello",
        name: "Hanif"
      }
    ),
    "<p>Hello, Hanif!</p>"
  );
});

test("renderTemplate removes missing placeholders", () => {
  assert.equal(
    renderTemplate("<p>{{missing}}</p>", {}),
    "<p></p>"
  );
});

test("renderTemplate escapes interpolated HTML", () => {
  assert.equal(
    renderTemplate(
      "<p>{{content}}</p>",
      {
        content:
          `<img src="x" onerror="alert('x')">`
      }
    ),
    "<p>&lt;img src=&quot;x&quot; onerror=&quot;alert(&#39;x&#39;)&quot;&gt;</p>"
  );
});

test("rawHTML intentionally bypasses escaping", () => {
  assert.equal(
    renderTemplate(
      "<section>{{content}}</section>",
      {
        content: rawHTML(
          "<strong>Trusted</strong>"
        )
      }
    ),
    "<section><strong>Trusted</strong></section>"
  );
});

test("propsToAttributes converts attributes", () => {
  assert.equal(
    propsToAttributes({
      id: "main",
      class: "container"
    }),
    'id="main" class="container"'
  );
});

test("propsToAttributes escapes attribute values", () => {
  assert.equal(
    propsToAttributes({
      title: `A "quote" & <tag>`
    }),
    'title="A &quot;quote&quot; &amp; &lt;tag&gt;"'
  );
});

test("propsToAttributes handles boolean and nullish attributes", () => {
  assert.equal(
    propsToAttributes({
      disabled: true,
      hidden: false,
      title: null,
      id: undefined,
      required: true
    }),
    "disabled required"
  );
});

test("propsToAttributes rejects invalid attribute names", () => {
  assert.throws(
    () =>
      propsToAttributes({
        '"><script': "bad"
      }),
    /Invalid HTML attribute name/
  );
});

test("cache stores and retrieves values by explicit key", () => {
  const cache = createCache();

  cache.set("page:1", "<p>Cached</p>");

  assert.equal(
    cache.get("page:1"),
    "<p>Cached</p>"
  );

  assert.equal(cache.size, 1);

  cache.clear();

  assert.equal(
    cache.get("page:1"),
    undefined
  );
});

test("cache evicts the least recently used entry", () => {
  const cache = createCache({
    maxEntries: 2
  });

  cache.set("a", "A");
  cache.set("b", "B");

  // Accessing a makes b the least recently used.
  assert.equal(cache.get("a"), "A");

  cache.set("c", "C");

  assert.equal(cache.get("a"), "A");
  assert.equal(cache.get("b"), undefined);
  assert.equal(cache.get("c"), "C");
  assert.equal(cache.size, 2);
});

test("cache expires values after TTL", () => {
  const originalNow = Date.now;
  let now = 1000;

  Date.now = () => now;

  try {
    const cache = createCache({
      ttl: 50
    });

    cache.set("page", "<p>Hello</p>");

    assert.equal(
      cache.get("page"),
      "<p>Hello</p>"
    );

    now = 1049;

    assert.equal(
      cache.get("page"),
      "<p>Hello</p>"
    );

    now = 1050;

    assert.equal(
      cache.get("page"),
      undefined
    );

    assert.equal(cache.size, 0);
  } finally {
    Date.now = originalNow;
  }
});

test("cache delete removes an entry", () => {
  const cache = createCache();

  cache.set("page", "<p>Hello</p>");

  assert.equal(
    cache.delete("page"),
    true
  );

  assert.equal(
    cache.get("page"),
    undefined
  );
});

test("cache validates its configuration", () => {
  assert.throws(
    () => createCache({ maxEntries: 0 }),
    /positive integer/
  );

  assert.throws(
    () => createCache({ ttl: -1 }),
    /non-negative finite number/
  );
});

test("cache accepts empty string values", () => {
  const cache = createCache();

  cache.set("empty", "");

  assert.equal(cache.has("empty"), true);
  assert.equal(cache.get("empty"), "");
});
