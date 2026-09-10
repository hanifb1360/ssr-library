const RAW_HTML = Symbol("ssr-library.rawHTML");

const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(
    /[&<>"']/g,
    (character) => ESCAPE_MAP[character]
  );
}

function rawHTML(value) {
  return Object.freeze({
    [RAW_HTML]: true,
    value: value === null || value === undefined
      ? ""
      : String(value)
  });
}

function isRawHTML(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    value[RAW_HTML] === true &&
    typeof value.value === "string"
  );
}

function renderHTMLValue(value) {
  return isRawHTML(value)
    ? value.value
    : escapeHTML(value);
}

module.exports = {
  escapeHTML,
  rawHTML,
  isRawHTML,
  renderHTMLValue
};
