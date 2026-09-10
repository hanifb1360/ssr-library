import {
  escapeHTML
} from "./html.js";

const ATTRIBUTE_NAME_PATTERN =
  /^[A-Za-z_:][A-Za-z0-9:._-]*$/;

export type AttributeValue = unknown;

export function propsToAttributes(
  props: Record<string, AttributeValue> = {}
): string {
  if (
    props === null ||
    typeof props !== "object" ||
    Array.isArray(props)
  ) {
    throw new TypeError(
      "propsToAttributes expects an object."
    );
  }

  return Object.entries(props)
    .flatMap(([key, value]) => {
      if (
        !ATTRIBUTE_NAME_PATTERN.test(key)
      ) {
        throw new TypeError(
          `Invalid HTML attribute name: ${key}`
        );
      }

      if (
        value === false ||
        value === null ||
        value === undefined
      ) {
        return [];
      }

      if (value === true) {
        return [key];
      }

      return [
        `${key}="${escapeHTML(value)}"`
      ];
    })
    .join(" ");
}
