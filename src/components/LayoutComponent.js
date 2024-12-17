const BaseComponent = require("./BaseComponent");

class LayoutComponent extends BaseComponent {
  render() {
    const content = this.props.content || "";
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${this.props.title || "SSR App"}</title>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  }
}

module.exports = LayoutComponent;