// Core classes
const BaseComponent = require("./BaseComponent");

// Core utilities
const { renderToHTML } = require("./renderer");
const { propsToAttributes } = require("./utils/propsToAttributes");

// Exporting everything from a single entry point
module.exports = {
  BaseComponent,
  renderToHTML,
  propsToAttributes,
};