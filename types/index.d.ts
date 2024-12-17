// BaseComponent
export declare class BaseComponent {
    constructor(props?: Record<string, any>);
    props: Record<string, any>;
    children: BaseComponent[];
  
    setChildren(children: BaseComponent[]): void;
    render(): string;
    renderTemplate(template: string): string;
  }
  
  // Utilities
  export declare function renderToHTML(component: BaseComponent): string;
  export declare function propsToAttributes(props: Record<string, any>): string;
  
  // Caching
  export declare const cache: {
    get(component: BaseComponent, props: Record<string, any>): string | undefined;
    set(component: BaseComponent, props: Record<string, any>, output: string): void;
    clear(): void;
  };
  
  // Virtual DOM
  export declare function diffDOM(oldHTML: string, newHTML: string): string | null;
  export declare function renderWithDiff(renderFunc: () => string, previousHTML: string): string;
  
  // Components
  export declare class LayoutComponent extends BaseComponent {}
  export declare class ConditionalComponent extends BaseComponent {}
  
  // Middleware
  export declare function ssrMiddleware(renderFn: () => string): any;