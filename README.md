
# SSR Library

## Overview

**SSR Library** is a lightweight, framework-agnostic utility for building **server-side rendering (SSR) components** in Node.js applications. It provides a **component-based architecture**, dynamic data binding, and templating support to generate clean HTML on the server. This makes it ideal for projects that need reusable, dynamic components without relying on large client-side frameworks.

---

## Key Features

- **Component-Based Architecture**: Build reusable, composable components by extending the `BaseComponent` class.
- **Render Components into HTML**: Use `renderToHTML` to generate static HTML strings for your components.
- **Dynamic Templating**: Inject dynamic data into components using `{{key}}` placeholders.
- **Props to Attributes Conversion**: Convert props into valid HTML attributes using `propsToAttributes`.
- **Lightweight & Framework-Agnostic**: Designed to be minimal, flexible, and compatible with any Node.js project.

---

## Installation

Install the package using npm:

```bash
npm install ssr-library
```

---

## Usage

Here’s a complete example of how you can use **SSR Library** to create reusable components and render them to HTML.

### 1. Define Components

Create a `Button` component and a `Container` component by extending `BaseComponent`.

```javascript
const { BaseComponent, renderToHTML, propsToAttributes } = require("ssr-library");

// Define a Button Component
class Button extends BaseComponent {
  render() {
    // Use dynamic templating with placeholders
    const template = `<button class="{{class}}" id="{{id}}">{{text}}</button>`;
    return this.renderTemplate(template);
  }
}

// Define a Container Component for nested components
class Container extends BaseComponent {
  render() {
    const childrenHTML = this.children.map((child) => child.render()).join("");
    return `<div>${childrenHTML}</div>`;
  }
}
```

### 2. Use the Components

Create instances of the components, provide props, and render them into HTML.

```javascript
// Create Button components with props
const button1 = new Button({ text: "Submit", class: "btn-primary", id: "submit-btn" });
const button2 = new Button({ text: "Cancel", class: "btn-secondary", id: "cancel-btn" });

// Nest Buttons inside a Container component
const container = new Container();
container.setChildren([button1, button2]);

// Render to HTML
const html = renderToHTML(container);
console.log(html);
```

### 3. Output

Running the above code generates the following HTML:

```html
<div>
  <button class="btn-primary" id="submit-btn">Submit</button>
  <button class="btn-secondary" id="cancel-btn">Cancel</button>
</div>
```

---

## API Reference

### `BaseComponent`
The base class for creating reusable components.

- **Constructor**:
  - `props`: An object containing props for the component.

- **Methods**:
  - `setChildren(children)`: Sets child components.
  - `render()`: Abstract method that must be implemented in subclasses.
  - `renderTemplate(template)`: Replaces `{{key}}` placeholders in the template with values from `props`.

---

### `renderToHTML(component)`

Renders a component instance into an HTML string.

**Example**:
```javascript
const button = new Button({ text: "Click Me", class: "btn-primary" });
console.log(renderToHTML(button));
// Output: <button class="btn-primary">Click Me</button>
```

---

### `propsToAttributes(props)`

Converts an object of props into a string of valid HTML attributes.

**Example**:
```javascript
const attributes = propsToAttributes({ class: "btn", id: "button-1" });
console.log(`<button ${attributes}></button>`);
// Output: <button class="btn" id="button-1"></button>
```

---

## Real-World Use Case

Imagine you’re building a small **email generation service** in Node.js, where components like buttons and containers are dynamically rendered.

```javascript
const { BaseComponent, renderToHTML } = require("ssr-library");

class EmailHeader extends BaseComponent {
  render() {
    return `<h1>{{title}}</h1>`;
  }
}

class EmailBody extends BaseComponent {
  render() {
    const content = this.props.content || "";
    return `<p>${content}</p>`;
  }
}

class Email extends BaseComponent {
  render() {
    const childrenHTML = this.children.map((child) => child.render()).join("");
    return `<div style="font-family: Arial;">${childrenHTML}</div>`;
  }
}

// Create instances
const header = new EmailHeader({ title: "Welcome to Our Service!" });
const body = new EmailBody({ content: "Thank you for joining us. We're excited to have you." });

const email = new Email();
email.setChildren([header, body]);

// Render the email
const emailHTML = renderToHTML(email);
console.log(emailHTML);
```

### Output

```html
<div style="font-family: Arial;">
  <h1>Welcome to Our Service!</h1>
  <p>Thank you for joining us. We're excited to have you.</p>
</div>
```

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Hanif Bahari**