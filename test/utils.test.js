const test = require("node:test");
const assert = require("node:assert/strict");

const { renderTemplate } = require("../src/utils/templateRenderer");
const { propsToAttributes } = require("../src/utils/propsToAttributes");
const { diffDOM, renderWithDiff } = require("../src/utils/virtualDOM");
const cache = require("../src/utils/cache");
const BaseComponent = require("../src/components/BaseComponent");

test("renderTemplate replaces placeholders", () => {
  assert.equal(
    renderTemplate(
      "<p>{{ greeting }}, {{name}}!</p>",
      { greeting: "Hello", name: "Hanif" }
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

test("propsToAttributes converts props to attributes", () => {
  assert.equal(
    propsToAttributes({
      id: "main",
      class: "container"
    }),
    'id="main" class="container"'
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
    props => `<p>${props.message}</p>`,
    "<p>Old</p>",
    { message: "New" }
  );

  assert.equal(result, "<p>New</p>");
});

test("cache stores and retrieves rendered output", () => {
  class Example extends BaseComponent {}

  const component = new Example({ id: 1 });

  cache.clear();
  cache.set(component, component.props, "<p>Cached</p>");

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
