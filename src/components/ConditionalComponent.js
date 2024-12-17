const BaseComponent = require("./BaseComponent");

class ConditionalComponent extends BaseComponent {
  render() {
    return this.props.condition
      ? `<p>${this.props.content || "Default content"}</p>`
      : "";
  }
}

module.exports = ConditionalComponent;