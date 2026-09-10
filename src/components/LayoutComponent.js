const BaseComponent = require("./BaseComponent");
const {
  renderTemplate
} = require("../utils/templateRenderer");

class LayoutComponent extends BaseComponent {
  render() {
    return renderTemplate(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>{{title}}</title>
      </head>
      <body>
        {{content}}
      </body>
      </html>
    `,
      {
        title: this.props.title ?? "SSR App",
        content: this.props.content ?? ""
      }
    );
  }
}

module.exports = LayoutComponent;
