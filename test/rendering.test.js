const test = require("node:test");
const assert = require("node:assert/strict");

const BaseComponent = require("../src/components/BaseComponent");
const { renderToHTML } = require("../src/renderer");
const cache = require("../src/utils/cache");

test.beforeEach(() => {
  cache.clear();
});

test("renderToHTML renders a component", () => {
  class Greeting extends BaseComponent {
    render() {
      return "<p>Hello</p>";
    }
  }

  assert.equal(
    renderToHTML(new Greeting()),
    "<p>Hello</p>"
  );
});

test("renderToHTML rejects an invalid component", () => {
  assert.throws(
    () => renderToHTML(null),
    /Invalid component/
  );
});

test("renderToHTML rejects non-string render output", () => {
  class InvalidComponent extends BaseComponent {
    render() {
      return { html: "<p>Hello</p>" };
    }
  }

  assert.throws(
    () => renderToHTML(new InvalidComponent()),
    /Render method must return a string/
  );
});

test("BaseComponent renderTemplate binds props", () => {
  class Greeting extends BaseComponent {
    render() {
      return this.renderTemplate("<p>Hello {{name}}</p>");
    }
  }

  const component = new Greeting({ name: "Hanif" });

  assert.equal(
    component.render(),
    "<p>Hello Hanif</p>"
  );
});
