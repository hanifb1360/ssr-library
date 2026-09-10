const { renderHTMLValue } = require("./html");

function renderTemplate(template, data = {}) {
  return template.replace(
    /{{\s*([\w]+)\s*}}/g,
    (_, key) => {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        return "";
      }

      return renderHTMLValue(data[key]);
    }
  );
}

module.exports = { renderTemplate };
