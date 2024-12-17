# Example Usage

Here’s how you can create and render custom components using the SSR Library.

### Custom Button Component
```javascript
const { BaseComponent, renderToHTML, propsToAttributes } = require("ssr-library");

// Define a Custom Button Component
class Button extends BaseComponent {
  render() {
    const attributes = propsToAttributes(this.props);
    return `<button ${attributes}>${this.props.text || "Click me"}</button>`;
  }
}

// Usage
const button = new Button({ text: "Submit", class: "btn-primary" });
const html = renderToHTML(button);
console.log(html); // Output: <button class="btn-primary">Submit</button>