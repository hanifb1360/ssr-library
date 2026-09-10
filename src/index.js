const BaseComponent =
  require("./components/BaseComponent");

const {
  renderToHTML
} = require("./renderer");

const {
  propsToAttributes
} = require("./utils/propsToAttributes");

const {
  SSRCache,
  createCache,
  cache
} = require("./utils/cache");

const {
  diffDOM,
  renderWithDiff
} = require("./utils/virtualDOM");

const {
  escapeHTML,
  rawHTML
} = require("./utils/html");

const LayoutComponent =
  require("./components/LayoutComponent");

const ConditionalComponent =
  require("./components/ConditionalComponent");

const {
  ssrMiddleware
} = require("./middleware/expressMiddleware");

module.exports = {
  BaseComponent,
  renderToHTML,
  propsToAttributes,
  SSRCache,
  createCache,
  cache,
  diffDOM,
  renderWithDiff,
  escapeHTML,
  rawHTML,
  LayoutComponent,
  ConditionalComponent,
  ssrMiddleware
};
