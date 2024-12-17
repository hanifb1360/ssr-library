
# SSR Library

## Overview

**SSR Library** is a lightweight, framework-agnostic utility for building **server-side rendering (SSR) components** in Node.js applications. It provides a **component-based architecture**, dynamic data binding, caching, virtual DOM diffing, and middleware support to generate clean HTML on the server.

---

## Key Features

- **Component-Based Architecture**: Build reusable, composable components by extending the `BaseComponent` class.
- **Advanced Components**: Pre-built components like `LayoutComponent` for layouts and `ConditionalComponent` for conditional rendering.
- **Render Components into HTML**: Use `renderToHTML` to generate static HTML strings for your components.
- **Dynamic Templating**: Inject dynamic data into components using `{{key}}` placeholders.
- **Props to Attributes Conversion**: Convert props into valid HTML attributes using `propsToAttributes`.
- **Server-Side Caching**: Use built-in caching for performance optimization.
- **Virtual DOM Diffing**: Optimize updates by comparing old and new HTML using `diffDOM`.
- **Express.js Middleware**: Easily integrate SSR into Express apps.
- **Lightweight & Framework-Agnostic**: Designed to be minimal, flexible, and compatible with any Node.js project.
- **TypeScript Support**: Built-in type definitions (`index.d.ts`) for seamless integration with TypeScript projects.

---

## Installation

Install the package using npm:

```bash
npm install ssr-library
```

---

## Usage

### 1. Create Components

**Using `BaseComponent`**, create reusable components.

```javascript
const { BaseComponent, renderToHTML, propsToAttributes } = require("ssr-library");

// Button Component
class Button extends BaseComponent {
  render() {
    const template = `<button {{props}}>{{text}}</button>`;
    return this.renderTemplate(template);
  }
}

// Conditional Component
const { ConditionalComponent } = require("ssr-library");

class CustomConditional extends ConditionalComponent {
  render() {
    return this.props.condition
      ? `<div>${this.props.text}</div>`
      : "";
  }
}

// Layout Component
const { LayoutComponent } = require("ssr-library");

class PageLayout extends LayoutComponent {
  render() {
    const content = this.props.content || "";
    return `<html><head><title>${this.props.title}</title></head><body>${content}</body></html>`;
  }
}
```

### 2. Use Advanced Components and Utilities

Here’s how to combine these components with utilities like caching and `diffDOM`:

```javascript
const { renderToHTML, cache, diffDOM } = require("ssr-library");

// Create components
const button1 = new Button({ text: "Submit", props: propsToAttributes({ class: "btn-primary" }) });
const button2 = new Button({ text: "Cancel", props: propsToAttributes({ class: "btn-secondary" }) });

const conditional = new CustomConditional({ condition: true, text: "This is visible" });

const layout = new PageLayout({
  title: "Demo Page",
  content: `${button1.render()} ${button2.render()} ${conditional.render()}`,
});

// Caching the output
const cachedHTML = cache.get(layout, layout.props);
if (!cachedHTML) {
  const html = renderToHTML(layout);
  cache.set(layout, layout.props, html);
  console.log("Rendered HTML:", html);
} else {
  console.log("Using cached HTML:", cachedHTML);
}

// Using Virtual DOM diffing
const oldHTML = "<p>Old Content</p>";
const newHTML = "<p>New Content</p>";
const diffed = diffDOM(oldHTML, newHTML);
console.log("Virtual DOM Diff Result:", diffed);
```

### 3. Express.js Integration

Integrate with an Express app using middleware:

```javascript
const express = require("express");
const { ssrMiddleware, renderToHTML, BaseComponent } = require("ssr-library");

class Header extends BaseComponent {
  render() {
    return `<h1>{{title}}</h1>`;
  }
}

const app = express();

app.use("/", ssrMiddleware(() => {
  const header = new Header({ title: "SSR Middleware Demo" });
  return renderToHTML(header);
}));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

---

## API Reference

### `LayoutComponent`
Allows you to create page layouts.

**Example**:
```javascript
const { LayoutComponent } = require("ssr-library");

class PageLayout extends LayoutComponent {
  render() {
    return `<html><head><title>{{title}}</title></head><body>{{content}}</body></html>`;
  }
}
```

### `ConditionalComponent`
Render components conditionally.

**Example**:
```javascript
const { ConditionalComponent } = require("ssr-library");

class CustomConditional extends ConditionalComponent {
  render() {
    return this.props.condition ? `<p>Condition met</p>` : "";
  }
}
```

### `cache` Utility
Caches rendered outputs for performance.

```javascript
const { cache, renderToHTML } = require("ssr-library");
const layout = new PageLayout({ title: "Cached Page", content: "<p>Hello</p>" });

const cached = cache.get(layout, layout.props);
if (!cached) {
  const html = renderToHTML(layout);
  cache.set(layout, layout.props, html);
}
```

### `diffDOM(oldHTML, newHTML)`
Performs virtual DOM diffing.

```javascript
const { diffDOM } = require("ssr-library");

const oldHTML = "<p>Old</p>";
const newHTML = "<p>New</p>";
console.log(diffDOM(oldHTML, newHTML)); // "<p>New</p>"
```

---

## Output Examples

**Final Rendered HTML**:
```html
<html>
  <head><title>Demo Page</title></head>
  <body>
    <button class="btn-primary">Submit</button>
    <button class="btn-secondary">Cancel</button>
    <div>This is visible</div>
  </body>
</html>
```

**Cached Output**:
```html
<html>
  <head><title>Cached Page</title></head>
  <body>
    <p>Hello</p>
  </body>
</html>
```

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Hanif Bahari**
