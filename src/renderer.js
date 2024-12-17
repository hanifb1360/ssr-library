const cache = require("./utils/cache");

function renderToHTML(component) {
  // Validate the component and its render method
  if (!component || typeof component.render !== "function") {
    throw new Error("Invalid component. Must implement a render method.");
  }

  // Check if a cached output already exists
  const cachedOutput = cache.get(component, component.props);
  if (cachedOutput) return cachedOutput;

  // Call render and validate the output
  let output;
  try {
    output = component.render();
    if (typeof output !== "string") {
      throw new Error("Render method must return a string.");
    }
  } catch (error) {
    // Explicitly re-throw the error if render fails
    throw new Error(error.message || "Render method encountered an error.");
  }

  // Cache the output for future use
  cache.set(component, component.props, output);

  return output;
}

module.exports = { renderToHTML };