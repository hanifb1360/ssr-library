const test = require("node:test");
const assert = require("node:assert/strict");

const BaseComponent =
  require("../src/components/BaseComponent");

const ConditionalComponent =
  require("../src/components/ConditionalComponent");

const LayoutComponent =
  require("../src/components/LayoutComponent");

const {
  rawHTML
} = require("../src/utils/html");

test("BaseComponent stores props", () => {
  const component =
    new BaseComponent({ name: "Hanif" });

  assert.deepEqual(
    component.props,
    { name: "Hanif" }
  );

  assert.deepEqual(component.children, []);
});

test("BaseComponent uses empty props by default", () => {
  const component = new BaseComponent();

  assert.deepEqual(component.props, {});
});

test("BaseComponent setChildren replaces children", () => {
  const component = new BaseComponent();

  const children = [
    new BaseComponent(),
    new BaseComponent()
  ];

  component.setChildren(children);

  assert.equal(component.children, children);
});

test("BaseComponent render must be implemented by subclasses", () => {
  const component = new BaseComponent();

  assert.throws(
    () => component.render(),
    /Render method not implemented/
  );
});

test("ConditionalComponent renders content when condition is true", () => {
  const component =
    new ConditionalComponent({
      condition: true,
      content: "Visible"
    });

  assert.equal(
    component.render(),
    "<p>Visible</p>"
  );
});

test("ConditionalComponent renders nothing when condition is false", () => {
  const component =
    new ConditionalComponent({
      condition: false,
      content: "Hidden"
    });

  assert.equal(component.render(), "");
});

test("ConditionalComponent supplies default content", () => {
  const component =
    new ConditionalComponent({
      condition: true
    });

  assert.equal(
    component.render(),
    "<p>Default content</p>"
  );
});

test("ConditionalComponent escapes dynamic HTML", () => {
  const component =
    new ConditionalComponent({
      condition: true,
      content: "<script>alert('x')</script>"
    });

  assert.equal(
    component.render(),
    "<p>&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;</p>"
  );
});

test("ConditionalComponent supports explicitly trusted HTML", () => {
  const component =
    new ConditionalComponent({
      condition: true,
      content: rawHTML(
        "<strong>Trusted</strong>"
      )
    });

  assert.equal(
    component.render(),
    "<p><strong>Trusted</strong></p>"
  );
});

test("LayoutComponent renders trusted HTML content", () => {
  const component =
    new LayoutComponent({
      title: "Example",
      content: rawHTML(
        "<main>Hello</main>"
      )
    });

  const html = component.render();

  assert.match(html, /<!DOCTYPE html>/);
  assert.match(
    html,
    /<title>Example<\/title>/
  );
  assert.match(
    html,
    /<main>Hello<\/main>/
  );
});

test("LayoutComponent escapes title and untrusted content", () => {
  const component =
    new LayoutComponent({
      title: `<script>alert("title")</script>`,
      content: "<main>Unsafe</main>"
    });

  const html = component.render();

  assert.doesNotMatch(
    html,
    /<script>/
  );

  assert.match(
    html,
    /&lt;script&gt;/
  );

  assert.match(
    html,
    /&lt;main&gt;Unsafe&lt;\/main&gt;/
  );
});
