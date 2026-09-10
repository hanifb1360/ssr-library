import {
  BaseComponent
} from "./BaseComponent.js";

import {
  renderTemplate
} from "../utils/templateRenderer.js";

export interface LayoutComponentProps {
  title?: unknown;
  content?: unknown;
}

export class LayoutComponent
  extends BaseComponent<
    LayoutComponentProps
  > {
  render(): string {
    return renderTemplate(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>{{title}}</title>
      </head>
      <body>
        {{content}}
      </body>
      </html>
    `,
      {
        title:
          this.props.title ??
          "SSR App",

        content:
          this.props.content ??
          ""
      }
    );
  }
}
