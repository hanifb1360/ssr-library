const test = require("node:test");
const assert = require("node:assert/strict");

const BaseComponent = require("../src/components/BaseComponent");
const ConditionalComponent = require("../src/components/ConditionalComponent");
const LayoutComponent = require("../src/components/LayoutComponent");

test("BaseComponent stores props", () => {
  const component = new BaseComponent({ name: "Hanif" });

  assert.deepEqual(component.props, { name: "Hanif" });
  assert.deepEqual(component.children, []);
});

test("BaseComponent uses empty props by default", () => {
  const component = new BaseComponent();

  assert.deepEqual(component.props, {});
});

test("BaseComponent setChildren replaces children", () => {
  const component = new BaseComponent();
  const children = [new BaseComponent(), new BaseComponent()];

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
  const component = new ConditionalComponent({
    condition: true,
    content: "Visible"
  });

  assert.equal(component.render(), "<p>Visible</p>");
});

test("ConditionalComponent renders nothing when condition is false", () => {
  const component = new ConditionalComponent({
    condition: false,
    content: "Hidden"
  });

  assert.equal(component.render(), "");
});

test("ConditionalComponent supplies default content", () => {
  const component = new ConditionalComponent({
    condition: true
  });

  assert.equal(component.render(), "<p>Default content</p>");
});

test("LayoutComponent renders a complete HTML document", () => {
  const component = new LayoutComponent({
    title: "Example",
    content: "<main>Hello</main>"
  });

  const html = component.render();

  assert.match(html, /<!DOCTYPE html>/);
  assert.match(html, /<title>Example<\/title>/);
  assert.match(html, /<main>Hello<\/main>/);
});
