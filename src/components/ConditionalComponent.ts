import {
  BaseComponent
} from "./BaseComponent.js";

import {
  renderTemplate
} from "../utils/templateRenderer.js";

export interface ConditionalComponentProps {
  condition?: unknown;
  content?: unknown;
}

export class ConditionalComponent
  extends BaseComponent<
    ConditionalComponentProps
  > {
  render(): string {
    if (!this.props.condition) {
      return "";
    }

    return renderTemplate(
      "<p>{{content}}</p>",
      {
        content:
          this.props.content ??
          "Default content"
      }
    );
  }
}
