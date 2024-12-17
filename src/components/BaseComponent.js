const { renderTemplate } = require("../utils/templateRenderer");

class BaseComponent {
  constructor(props = {}) {
    this.props = props;
    this.children = [];
  }

  setChildren(children) {
    this.children = children;
  }

  renderTemplate(template) {
    return renderTemplate(template, this.props);
  }

  render() {
    throw new Error("Render method not implemented");
  }
}

module.exports = BaseComponent;