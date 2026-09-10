import assert from "node:assert/strict";
import {
  spawnSync
} from "node:child_process";
import {
  mkdtemp,
  mkdir,
  rm,
  writeFile
} from "node:fs/promises";
import {
  createRequire
} from "node:module";
import {
  tmpdir
} from "node:os";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";

const require = createRequire(import.meta.url);

const projectRoot = path.resolve(
  path.dirname(
    fileURLToPath(import.meta.url)
  ),
  ".."
);

const npm =
  process.platform === "win32"
    ? "npm.cmd"
    : "npm";

function run(
  command,
  args,
  cwd
) {
  const result = spawnSync(
    command,
    args,
    {
      cwd,
      encoding: "utf8",
      env: process.env
    }
  );

  if (result.status !== 0) {
    if (result.stdout) {
      console.error(result.stdout);
    }

    if (result.stderr) {
      console.error(result.stderr);
    }

    throw new Error(
      `${command} ${args.join(" ")} failed`
    );
  }

  return result.stdout;
}

function parsePackOutput(output) {
  const start = output.indexOf("[");
  const end = output.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error(
      "Could not parse npm pack output."
    );
  }

  return JSON.parse(
    output.slice(start, end + 1)
  );
}

const temporaryRoot =
  await mkdtemp(
    path.join(
      tmpdir(),
      "ssr-library-consumer-"
    )
  );

try {
  const packOutput = run(
    npm,
    [
      "pack",
      "--ignore-scripts",
      "--json",
      "--pack-destination",
      temporaryRoot
    ],
    projectRoot
  );

  const packResult =
    parsePackOutput(packOutput);

  assert.equal(
    packResult.length,
    1
  );

  const tarball = path.join(
    temporaryRoot,
    packResult[0].filename
  );

  const consumerDirectory =
    path.join(
      temporaryRoot,
      "consumer"
    );

  await mkdir(
    consumerDirectory,
    { recursive: true }
  );

  await writeFile(
    path.join(
      consumerDirectory,
      "package.json"
    ),
    JSON.stringify(
      {
        private: true,
        type: "module"
      },
      null,
      2
    )
  );

  run(
    npm,
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      tarball
    ],
    consumerDirectory
  );

  await writeFile(
    path.join(
      consumerDirectory,
      "consumer.cjs"
    ),
    `
const assert = require("node:assert/strict");
const library = require("ssr-library");

assert.equal(
  library.renderTemplate(
    "<p>{{value}}</p>",
    { value: "<unsafe>" }
  ),
  "<p>&lt;unsafe&gt;</p>"
);

assert.equal(
  typeof library.createCache,
  "function"
);

assert.equal(
  typeof library.ssrMiddleware,
  "function"
);
`
  );

  run(
    process.execPath,
    ["consumer.cjs"],
    consumerDirectory
  );

  await writeFile(
    path.join(
      consumerDirectory,
      "consumer.mjs"
    ),
    `
import assert from "node:assert/strict";

import {
  createCache,
  renderTemplate,
  ssrMiddleware
} from "ssr-library";

assert.equal(
  renderTemplate(
    "<p>{{value}}</p>",
    { value: "<unsafe>" }
  ),
  "<p>&lt;unsafe&gt;</p>"
);

assert.equal(
  typeof createCache,
  "function"
);

assert.equal(
  typeof ssrMiddleware,
  "function"
);
`
  );

  run(
    process.execPath,
    ["consumer.mjs"],
    consumerDirectory
  );

  await writeFile(
    path.join(
      consumerDirectory,
      "consumer.ts"
    ),
    `
import {
  BaseComponent,
  createCache,
  rawHTML,
  renderTemplate,
  renderToHTML,
  type RawHTML
} from "ssr-library";

class Greeting extends BaseComponent<{
  name: string;
}> {
  render(): string {
    return this.renderTemplate(
      "<p>{{name}}</p>"
    );
  }
}

const component =
  new Greeting({
    name: "Hanif"
  });

const html: string =
  renderToHTML(component);

const cache =
  createCache({
    maxEntries: 10,
    ttl: 1000
  });

const trusted: RawHTML =
  rawHTML("<strong>Trusted</strong>");

const templated: string =
  renderTemplate(
    "<div>{{content}}</div>",
    {
      content: trusted
    }
  );

void html;
void cache;
void templated;
`
  );

  const typescriptEntry =
    require.resolve("typescript");

  const tsc = path.resolve(
    path.dirname(typescriptEntry),
    "../bin/tsc"
  );

  run(
    process.execPath,
    [
      tsc,
      "--noEmit",
      "--strict",
      "--skipLibCheck",
      "--target",
      "ES2022",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "consumer.ts"
    ],
    consumerDirectory
  );

  console.log(
    "Consumer package test passed for CommonJS, ESM, and TypeScript."
  );
} finally {
  await rm(
    temporaryRoot,
    {
      recursive: true,
      force: true
    }
  );
}
