import BaseComponent from "./components/BaseComponent.js";
import renderer from "./renderer.js";
import attributes from "./utils/propsToAttributes.js";
import cacheUtils from "./utils/cache.js";
import htmlUtils from "./utils/html.js";
import LayoutComponent from "./components/LayoutComponent.js";
import ConditionalComponent from "./components/ConditionalComponent.js";
import middleware from "./middleware/expressMiddleware.js";

const {
  renderToHTML
} = renderer;

const {
  propsToAttributes
} = attributes;

const {
  SSRCache,
  createCache,
  cache
} = cacheUtils;

const {
  escapeHTML,
  rawHTML
} = htmlUtils;

const {
  ssrMiddleware
} = middleware;

export {
  BaseComponent,
  renderToHTML,
  propsToAttributes,
  SSRCache,
  createCache,
  cache,
  escapeHTML,
  rawHTML,
  LayoutComponent,
  ConditionalComponent,
  ssrMiddleware
};
