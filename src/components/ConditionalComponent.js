const BaseComponent = require("./BaseComponent");
const {
  renderTemplate
} = require("../utils/templateRenderer");

class ConditionalComponent extends BaseComponent {
  render() {
    if (!this.props.condition) {
      return "";
    }

    return renderTemplate(
      "<p>{{content}}</p>",
      {
        content:
          this.props.content ??
          "Default content"
      }
    );
  }
}

module.exports = ConditionalComponent;
