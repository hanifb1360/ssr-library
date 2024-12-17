function diffDOM(oldHTML, newHTML) {
    if (oldHTML === newHTML) {
      return null; // No changes
    }
    return newHTML; // In a simple implementation, just return the updated HTML
  }
  
  function renderWithDiff(renderFunction, oldHTML, props) {
    const newHTML = renderFunction(props);
    return diffDOM(oldHTML, newHTML) || oldHTML;
  }
  
  module.exports = { diffDOM, renderWithDiff };