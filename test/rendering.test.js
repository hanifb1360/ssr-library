const test = require("node:test");
const assert = require("node:assert/strict");

const BaseComponent =
  require("../src/components/BaseComponent");

const {
  renderToHTML
} = require("../src/renderer");

const {
  createCache
} = require("../src/utils/cache");

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

test("renderToHTML does not cache by default", () => {
  let renderCount = 0;

  class Counter extends BaseComponent {
    render() {
      renderCount += 1;
      return `<p>${renderCount}</p>`;
    }
  }

  const component = new Counter();

  assert.equal(
    renderToHTML(component),
    "<p>1</p>"
  );

  assert.equal(
    renderToHTML(component),
    "<p>2</p>"
  );

  assert.equal(renderCount, 2);
});

test("renderToHTML supports explicit caching", () => {
  let renderCount = 0;

  class Counter extends BaseComponent {
    render() {
      renderCount += 1;
      return `<p>${renderCount}</p>`;
    }
  }

  const component = new Counter();
  const cache = createCache();

  assert.equal(
    renderToHTML(component, {
      cache,
      cacheKey: "counter"
    }),
    "<p>1</p>"
  );

  assert.equal(
    renderToHTML(component, {
      cache,
      cacheKey: "counter"
    }),
    "<p>1</p>"
  );

  assert.equal(renderCount, 1);
});

test("renderToHTML correctly caches empty strings", () => {
  let renderCount = 0;

  class EmptyComponent extends BaseComponent {
    render() {
      renderCount += 1;
      return "";
    }
  }

  const component = new EmptyComponent();
  const cache = createCache();

  assert.equal(
    renderToHTML(component, {
      cache,
      cacheKey: "empty"
    }),
    ""
  );

  assert.equal(
    renderToHTML(component, {
      cache,
      cacheKey: "empty"
    }),
    ""
  );

  assert.equal(renderCount, 1);
});

test("renderToHTML requires a cache key when caching", () => {
  const cache = createCache();

  class Greeting extends BaseComponent {
    render() {
      return "<p>Hello</p>";
    }
  }

  assert.throws(
    () =>
      renderToHTML(
        new Greeting(),
        { cache }
      ),
    /cacheKey is required/
  );
});

test("renderToHTML rejects a cache key without a cache", () => {
  class Greeting extends BaseComponent {
    render() {
      return "<p>Hello</p>";
    }
  }

  assert.throws(
    () =>
      renderToHTML(
        new Greeting(),
        { cacheKey: "greeting" }
      ),
    /cacheKey requires a cache/
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
      return {
        html: "<p>Hello</p>"
      };
    }
  }

  assert.throws(
    () => renderToHTML(new InvalidComponent()),
    {
      name: "TypeError",
      message:
        "Render method must return a string."
    }
  );
});

test("renderToHTML preserves render errors", () => {
  const expectedError =
    new Error("Component failed");

  class BrokenComponent extends BaseComponent {
    render() {
      throw expectedError;
    }
  }

  assert.throws(
    () =>
      renderToHTML(
        new BrokenComponent()
      ),
    (error) => error === expectedError
  );
});

test("BaseComponent renderTemplate binds props", () => {
  class Greeting extends BaseComponent {
    render() {
      return this.renderTemplate(
        "<p>Hello {{name}}</p>"
      );
    }
  }

  const component =
    new Greeting({ name: "Hanif" });

  assert.equal(
    component.render(),
    "<p>Hello Hanif</p>"
  );
});
