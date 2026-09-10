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
  diffDOM,
  renderWithDiff
} = require("../src/utils/virtualDOM");

const cache = require("../src/utils/cache");
const BaseComponent = require("../src/components/BaseComponent");

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

test("diffDOM returns null when HTML is unchanged", () => {
  assert.equal(
    diffDOM("<p>Hello</p>", "<p>Hello</p>"),
    null
  );
});

test("diffDOM returns new HTML when content changes", () => {
  assert.equal(
    diffDOM("<p>Old</p>", "<p>New</p>"),
    "<p>New</p>"
  );
});

test("renderWithDiff keeps previous HTML when unchanged", () => {
  const result = renderWithDiff(
    () => "<p>Hello</p>",
    "<p>Hello</p>",
    {}
  );

  assert.equal(result, "<p>Hello</p>");
});

test("renderWithDiff returns new HTML when changed", () => {
  const result = renderWithDiff(
    (props) => `<p>${props.message}</p>`,
    "<p>Old</p>",
    { message: "New" }
  );

  assert.equal(result, "<p>New</p>");
});

test("cache stores and retrieves rendered output", () => {
  class Example extends BaseComponent {}

  const component = new Example({ id: 1 });

  cache.clear();

  cache.set(
    component,
    component.props,
    "<p>Cached</p>"
  );

  assert.equal(
    cache.get(component, component.props),
    "<p>Cached</p>"
  );

  cache.clear();

  assert.equal(
    cache.get(component, component.props),
    undefined
  );
});
