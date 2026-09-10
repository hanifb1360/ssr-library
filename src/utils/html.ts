const RAW_HTML: unique symbol =
  Symbol("ssr-library.rawHTML");

export interface RawHTML {
  readonly value: string;
  readonly [RAW_HTML]: true;
}

function escapeCharacter(character: string): string {
  switch (character) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    case '"':
      return "&quot;";
    case "'":
      return "&#39;";
    default:
      return character;
  }
}

export function escapeHTML(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(
    /[&<>"']/g,
    escapeCharacter
  );
}

export function rawHTML(value: unknown): RawHTML {
  return Object.freeze({
    [RAW_HTML]: true as const,
    value:
      value === null || value === undefined
        ? ""
        : String(value)
  });
}

export function isRawHTML(
  value: unknown
): value is RawHTML {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const candidate = value as Partial<RawHTML>;

  return (
    candidate[RAW_HTML] === true &&
    typeof candidate.value === "string"
  );
}

export function renderHTMLValue(
  value: unknown
): string {
  return isRawHTML(value)
    ? value.value
    : escapeHTML(value);
}
