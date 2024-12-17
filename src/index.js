// Core classes
const BaseComponent = require("./components/BaseComponent");

// Core utilities
const { renderToHTML } = require("./renderer");
const { propsToAttributes } = require("./utils/propsToAttributes");
const cache = require("./utils/cache");
const { diffDOM, renderWithDiff } = require("./utils/virtualDOM");

// Components for advanced features
const LayoutComponent = require("./components/LayoutComponent");
const ConditionalComponent = require("./components/ConditionalComponent");

// Middleware for integrations
const { ssrMiddleware } = require("./middleware/expressMiddleware");

// Exporting everything from a single entry point
module.exports = {
  // Core classes
  BaseComponent,

  // Utilities
  renderToHTML,
  propsToAttributes,
  cache,            // Server-side caching utility
  diffDOM,          // Virtual DOM diffing utility
  renderWithDiff,   // Optimized rendering with Virtual DOM

  // Advanced Components
  LayoutComponent,       // Layout support
  ConditionalComponent,  // Conditional rendering support

  // Middleware
  ssrMiddleware,    // Express.js middleware
};