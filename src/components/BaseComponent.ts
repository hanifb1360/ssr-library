import {
  renderTemplate
} from "../utils/templateRenderer.js";

export type ComponentProps =
  Record<string, unknown>;

export abstract class BaseComponent<
  Props extends object = ComponentProps
> {
  props: Props;
  children: BaseComponent[];

  constructor(props?: Props) {
    this.props =
      props ?? ({} as Props);

    this.children = [];
  }

  setChildren(
    children: BaseComponent[]
  ): void {
    this.children = children;
  }

  renderTemplate(
    template: string
  ): string {
    return renderTemplate(
      template,
      this.props
    );
  }

  render(): string {
    throw new Error(
      "Render method not implemented"
    );
  }
}
