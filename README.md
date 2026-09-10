# ssr-library

A small, dependency-free TypeScript toolkit for safely building and rendering server-side HTML components in Node.js.

`ssr-library` provides a few focused primitives for server-side rendering without introducing a full framework:

- reusable server-rendered components
- HTML-safe template interpolation
- explicit trusted HTML support
- HTML attribute generation
- optional bounded caching
- framework-friendly SSR middleware
- native ESM and CommonJS support
- generated TypeScript declarations

## Requirements

Node.js 22 or newer.

## Installation

```bash
npm install ssr-library
cat > README.md <<'EOF'
# ssr-library

A small, dependency-free TypeScript toolkit for safely building and rendering server-side HTML components in Node.js.

`ssr-library` provides a few focused primitives for server-side rendering without introducing a full framework:

- reusable server-rendered components
- HTML-safe template interpolation
- explicit trusted HTML support
- HTML attribute generation
- optional bounded caching
- framework-friendly SSR middleware
- native ESM and CommonJS support
- generated TypeScript declarations

## Requirements

Node.js 22 or newer.

## Installation

```bash
npm install ssr-library
```

## Quick start

### ESM

```js
import {
  BaseComponent,
  renderToHTML
} from "ssr-library";

class Greeting extends BaseComponent {
  render() {
    return this.renderTemplate(
      "<h1>Hello, {{name}}!</h1>"
    );
  }
}

const component = new Greeting({
  name: "World"
});

console.log(renderToHTML(component));
```

Output:

```html
<h1>Hello, World!</h1>
```

### CommonJS

```js
const {
  BaseComponent,
  renderToHTML
} = require("ssr-library");

class Greeting extends BaseComponent {
  render() {
    return this.renderTemplate(
      "<h1>Hello, {{name}}!</h1>"
    );
  }
}

const html = renderToHTML(
  new Greeting({
    name: "World"
  })
);

console.log(html);
```

## Safe HTML by default

Dynamic values inserted through `renderTemplate()` are HTML escaped automatically.

```js
import {
  renderTemplate
} from "ssr-library";

const html = renderTemplate(
  "<p>{{value}}</p>",
  {
    value: "<script>alert('xss')</script>"
  }
);

console.log(html);
```

Output:

```html
<p>&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</p>
```

The characters `&`, `<`, `>`, `"`, and `'` are escaped.

`null` and `undefined` are rendered as empty strings.

Missing template values are also replaced with an empty string.

## Trusted HTML

Sometimes a value intentionally contains markup that should be rendered rather than escaped.

Use `rawHTML()` only for HTML you trust:

```js
import {
  rawHTML,
  renderTemplate
} from "ssr-library";

const trustedContent =
  rawHTML("<strong>Welcome</strong>");

const html = renderTemplate(
  "<div>{{content}}</div>",
  {
    content: trustedContent
  }
);

console.log(html);
```

Output:

```html
<div><strong>Welcome</strong></div>
```

`rawHTML()` is an explicit trust boundary. Never pass untrusted user input to it.

HTML escaping is also not a complete sanitizer for every browser context. Be careful when constructing URLs, JavaScript, CSS, event-handler attributes, or other context-sensitive values.

## Components

### BaseComponent

Extend `BaseComponent` to create reusable server-rendered components.

```ts
import {
  BaseComponent,
  escapeHTML,
  propsToAttributes
} from "ssr-library";

interface ButtonProps {
  label: string;
  disabled?: boolean;
}

class Button extends BaseComponent<ButtonProps> {
  render(): string {
    const attributes =
      propsToAttributes({
        class: "button",
        disabled: this.props.disabled
      });

    return (
      `<button ${attributes}>` +
      `${escapeHTML(this.props.label)}` +
      `</button>`
    );
  }
}
```

`BaseComponent` stores `props`, provides a `children` collection, and exposes `renderTemplate()` for binding component props to `{{key}}` placeholders.

Subclasses implement `render()` and must return a string.

### ConditionalComponent

`ConditionalComponent` renders its content inside a paragraph when its condition is truthy.

```js
import {
  ConditionalComponent
} from "ssr-library";

const component =
  new ConditionalComponent({
    condition: true,
    content: "Visible"
  });

console.log(component.render());
```

Output:

```html
<p>Visible</p>
```

Its content is escaped by default. Use `rawHTML()` when the content is intentionally trusted markup.

### LayoutComponent

`LayoutComponent` creates a basic HTML document.

```js
import {
  LayoutComponent,
  rawHTML,
  renderTemplate
} from "ssr-library";

const body = renderTemplate(
  "<main><h1>{{title}}</h1></main>",
  {
    title: "Dashboard"
  }
);

const page =
  new LayoutComponent({
    title: "My App",
    content: rawHTML(body)
  });

console.log(page.render());
```

Because layout content is escaped by default, trusted pre-rendered markup must be wrapped with `rawHTML()`.

## Rendering

Use `renderToHTML()` with any object that implements a `render()` method returning a string.

```js
import {
  renderToHTML
} from "ssr-library";

const component = {
  render() {
    return "<p>Hello</p>";
  }
};

const html =
  renderToHTML(component);
```

Rendering is deterministic by default. No cache is consulted unless you explicitly provide one.

## Caching

Caching is opt-in.

Create a cache with `createCache()` and provide both the cache and an application-controlled key to `renderToHTML()`:

```js
import {
  BaseComponent,
  createCache,
  renderToHTML
} from "ssr-library";

class Product extends BaseComponent {
  render() {
    return this.renderTemplate(
      "<article>{{name}}</article>"
    );
  }
}

const cache = createCache({
  maxEntries: 100,
  ttl: 60_000
});

const product =
  new Product({
    name: "Keyboard"
  });

const html = renderToHTML(
  product,
  {
    cache,
    cacheKey: "product:42"
  }
);
```

`maxEntries` controls the maximum number of cached values. The default is `100`.

`ttl` is the lifetime of an entry in milliseconds. The default is `0`, which means entries do not expire automatically.

When the maximum size is exceeded, the least recently used entry is removed.

You are responsible for choosing cache keys that uniquely represent the rendered output. Avoid sharing keys between users, tenants, locales, permissions, or other contexts that produce different HTML.

### Cache API

```js
const cache = createCache({
  maxEntries: 50,
  ttl: 30_000
});

cache.set("page:home", "<h1>Home</h1>");

cache.get("page:home");
cache.has("page:home");
cache.delete("page:home");

console.log(cache.size);

cache.clear();
```

Only string keys and string values are accepted.

A bounded shared cache is also exported as `cache`, but creating and owning a cache instance is usually preferable when different parts of an application require independent cache scopes.

## HTML attributes

`propsToAttributes()` converts an object into an HTML attribute string.

```js
import {
  propsToAttributes
} from "ssr-library";

const attributes =
  propsToAttributes({
    id: "save",
    class: "primary",
    disabled: true,
    hidden: false,
    title: 'Save "now"'
  });

console.log(attributes);
```

Output:

```html
id="save" class="primary" disabled title="Save &quot;now&quot;"
```

`false`, `null`, and `undefined` values are omitted.

`true` values become boolean attributes.

Attribute values are HTML escaped and invalid attribute names are rejected.

The function does not determine whether a particular attribute is appropriate or safe for a particular browser context. Attribute names should remain under application control.

## Middleware

`ssrMiddleware()` creates a small middleware function compatible with frameworks that provide a request object, `res.send()`, and optionally `next(error)`.

The library itself does not depend on Express.

### Express example

```js
import express from "express";

import {
  BaseComponent,
  renderToHTML,
  ssrMiddleware
} from "ssr-library";

class HomePage extends BaseComponent {
  render() {
    return this.renderTemplate(
      "<h1>Hello, {{name}}</h1>"
    );
  }
}

const app = express();

app.get(
  "/",
  ssrMiddleware((req) => {
    return renderToHTML(
      new HomePage({
        name:
          typeof req.query.name === "string"
            ? req.query.name
            : "World"
      })
    );
  })
);

app.listen(3000);
```

The render function receives the request object.

Both synchronous and asynchronous render functions are supported:

```js
app.get(
  "/profile",
  ssrMiddleware(async (req) => {
    const profile =
      await loadProfile(req);

    return renderProfile(profile);
  })
);
```

Errors are forwarded to `next(error)` when a next function is available.

The render function must ultimately produce a string.

## Public API

The runtime API contains:

| Export | Purpose |
| --- | --- |
| `BaseComponent` | Base class for server-rendered components |
| `ConditionalComponent` | Simple conditional component |
| `LayoutComponent` | Basic HTML document component |
| `renderToHTML` | Render a component to an HTML string |
| `renderTemplate` | Safely interpolate `{{key}}` values |
| `escapeHTML` | Escape an arbitrary value for HTML text |
| `rawHTML` | Mark trusted HTML so interpolation does not escape it |
| `propsToAttributes` | Create escaped HTML attributes |
| `SSRCache` | Bounded cache implementation |
| `createCache` | Create an independent cache |
| `cache` | Shared default bounded cache |
| `ssrMiddleware` | Adapt an SSR function to middleware-style request handling |

TypeScript declarations are generated from the TypeScript source and are included with the package.

Important exported types include:

```ts
AttributeValue
CacheOptions
ComponentProps
ConditionalComponentProps
HTMLCache
LayoutComponentProps
RawHTML
Renderable
RenderToHTMLOptions
SSRNextFunction
SSRRenderFunction
SSRResponse
TemplateData
```

## Package formats

Both ESM and CommonJS are supported:

```js
import {
  renderTemplate
} from "ssr-library";
```

```js
const {
  renderTemplate
} = require("ssr-library");
```

The npm package includes generated TypeScript declarations for both consumers.

## Migrating from 1.x

Version 2 intentionally removes or changes several misleading or unsafe behaviors from 1.x.

### Node.js requirement

Version 2 requires Node.js 22 or newer.

### Virtual DOM APIs were removed

`diffDOM()` and `renderWithDiff()` no longer exist.

The previous implementation did not perform real virtual DOM reconciliation, so these APIs were removed rather than continuing to describe simple string replacement as virtual DOM diffing.

### Caching is explicit

`renderToHTML()` no longer automatically reads from or writes to a global cache.

Instead:

```js
renderToHTML(component, {
  cache,
  cacheKey: "your:key"
});
```

The cache is bounded and supports TTL expiration.

### Cache keys changed

Cache keys are now explicit strings controlled by the application.

Do not pass component instances and props as cache-key arguments as in older releases.

### Dynamic HTML is escaped

Template interpolation now escapes values by default.

If an application intentionally renders trusted markup, wrap that value with `rawHTML()`.

### Express is no longer a dependency

`ssrMiddleware()` remains compatible with Express-style middleware, but `ssr-library` does not install Express for you.

Install your web framework separately if your application needs one.

### TypeScript is now the source of truth

The package is authored in TypeScript and generates ESM, CommonJS, and declaration files during the build.

## Development

Install dependencies:

```bash
npm ci
```

Run the test suite:

```bash
npm test
```

Run tests with enforced coverage:

```bash
npm run test:coverage
```

Verify the package from actual downstream CommonJS, ESM, and TypeScript projects:

```bash
npm run test:consumer
```

Build the package:

```bash
npm run build
```

CI runs on Node.js 22, 24, and 26.

## License

MIT © Hanif Bahari
