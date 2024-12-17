function renderToHTML(component) {
    if (!component || typeof component.render !== "function") {
      throw new Error("Invalid component. Must implement a render method.");
    }
  
    return component.render();
  }
  
  module.exports = { renderToHTML };