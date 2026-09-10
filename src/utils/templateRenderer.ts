import {
  renderHTMLValue
} from "./html.js";

export type TemplateData = object;

export function renderTemplate(
  template: string,
  data: TemplateData = {}
): string {
  const values =
    data as Record<string, unknown>;

  return template.replace(
    /{{\s*([\w]+)\s*}}/g,
    (_, key: string) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          values,
          key
        )
      ) {
        return "";
      }

      return renderHTMLValue(values[key]);
    }
  );
}
