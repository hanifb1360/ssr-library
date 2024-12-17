// Core classes
import BaseComponent from "./components/BaseComponent.js";

// Core utilities
import { renderToHTML } from "./renderer.js";
import { propsToAttributes } from "./utils/propsToAttributes.js";
import cache from "./utils/cache.js";
import { diffDOM, renderWithDiff } from "./utils/virtualDOM.js";

// Advanced components
import LayoutComponent from "./components/LayoutComponent.js";
import ConditionalComponent from "./components/ConditionalComponent.js";

// Middleware
import { ssrMiddleware } from "./middleware/expressMiddleware.js";

// Export everything
export {
  BaseComponent,
  renderToHTML,
  propsToAttributes,
  cache,
  diffDOM,
  renderWithDiff,
  LayoutComponent,
  ConditionalComponent,
  ssrMiddleware,
};