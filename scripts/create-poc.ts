#!/usr/bin/env bun
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEMPLATES = ["react", "astro-hono", "nextjs"] as const;
type Template = (typeof TEMPLATES)[number];

const [template, pocName] = Bun.argv.slice(2);

if (!template || !pocName) {
  console.error("Usage: bun scripts/create-poc.ts <template> <poc-name>");
  console.error(`Templates: ${TEMPLATES.join(", ")}`);
  process.exit(1);
}

if (!TEMPLATES.includes(template as Template)) {
  console.error(`Invalid template: ${template}`);
  console.error(`Available: ${TEMPLATES.join(", ")}`);
  process.exit(1);
}

const root = join(import.meta.dir, "..");
const pocDir = join(root, pocName);

if (existsSync(pocDir)) {
  console.error(`Already exists: ${pocName}/`);
  process.exit(1);
}

function write(path: string, content: string) {
  mkdirSync(join(pocDir, path, ".."), { recursive: true });
  writeFileSync(join(pocDir, path), content);
}

// --- 共通 ---
write("README.md", `# ${pocName}\n`);
write(".env.example", "");

// --- frontend ---
const frontendTsconfig = (ext: "react" | "base") =>
  `${JSON.stringify({ extends: `@yy-labs/tsconfig/${ext}` }, null, 2)}\n`;

if (template === "react") {
  write(
    "apps/frontend/package.json",
    `${JSON.stringify(
      {
        name: `@yy-labs/${pocName}-frontend`,
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          check: "biome check .",
          typecheck: "tsc --noEmit",
          test: "vitest run --passWithNoTests",
        },
        dependencies: { react: "^18.3.0", "react-dom": "^18.3.0" },
        devDependencies: {
          "@vitejs/plugin-react": "^4.3.0",
          vite: "^5.4.0",
          vitest: "^2.0.0",
          "@vitest/coverage-v8": "^2.0.0",
          jsdom: "^25.0.0",
          "@testing-library/react": "^16.0.0",
          "@testing-library/jest-dom": "^6.0.0",
        },
      },
      null,
      2
    )}\n`
  );
  write("apps/frontend/tsconfig.json", frontendTsconfig("react"));
  write(
    "apps/frontend/vite.config.ts",
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
`
  );
  write("apps/frontend/src/test/setup.ts", `import "@testing-library/jest-dom";\n`);
  write(
    "apps/frontend/src/App.test.tsx",
    `import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders", () => {
    render(<App />);
    expect(screen.getByText("${pocName}")).toBeInTheDocument();
  });
});
`
  );
  write(
    "apps/frontend/src/main.tsx",
    `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\n\ncreateRoot(document.getElementById("root")!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`
  );
  write(
    "apps/frontend/src/App.tsx",
    `export default function App() {\n  return <h1>${pocName}</h1>;\n}\n`
  );
  write(
    "apps/frontend/index.html",
    `<!doctype html>\n<html lang="ja">\n  <head>\n    <meta charset="UTF-8" />\n    <title>${pocName}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`
  );
}

if (template === "nextjs") {
  write(
    "apps/frontend/package.json",
    `${JSON.stringify(
      {
        name: `@yy-labs/${pocName}-frontend`,
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          check: "biome check .",
          typecheck: "tsc --noEmit",
          test: "vitest run --passWithNoTests",
        },
        dependencies: { next: "^14.2.0", react: "^18.3.0", "react-dom": "^18.3.0" },
        devDependencies: {
          "@types/react": "^18.3.0",
          "@types/react-dom": "^18.3.0",
          vitest: "^2.0.0",
          "@vitest/coverage-v8": "^2.0.0",
          jsdom: "^25.0.0",
          "@testing-library/react": "^16.0.0",
          "@testing-library/jest-dom": "^6.0.0",
        },
      },
      null,
      2
    )}\n`
  );
  write("apps/frontend/tsconfig.json", frontendTsconfig("react"));
  write(
    "apps/frontend/next.config.ts",
    `import type { NextConfig } from "next";\n\nconst config: NextConfig = {};\n\nexport default config;\n`
  );
  write(
    "apps/frontend/vitest.config.ts",
    `import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
`
  );
  write("apps/frontend/src/test/setup.ts", `import "@testing-library/jest-dom";\n`);
  write(
    "apps/frontend/src/app/page.test.tsx",
    `import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("Page", () => {
  it("renders", () => {
    render(<Page />);
    expect(screen.getByText("${pocName}")).toBeInTheDocument();
  });
});
`
  );
  write(
    "apps/frontend/src/app/page.tsx",
    `export default function Page() {\n  return <h1>${pocName}</h1>;\n}\n`
  );
  write(
    "apps/frontend/src/app/layout.tsx",
    `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="ja">\n      <body>{children}</body>\n    </html>\n  );\n}\n`
  );
}

if (template === "astro-hono") {
  write(
    "apps/frontend/package.json",
    `${JSON.stringify(
      {
        name: `@yy-labs/${pocName}-frontend`,
        private: true,
        scripts: {
          dev: "astro dev",
          build: "astro build",
          check: "biome check .",
          typecheck: "tsc --noEmit",
        },
        dependencies: { astro: "^4.15.0" },
      },
      null,
      2
    )}\n`
  );
  write("apps/frontend/tsconfig.json", frontendTsconfig("base"));
  write(
    "apps/frontend/astro.config.ts",
    `import { defineConfig } from "astro/config";\n\nexport default defineConfig({});\n`
  );
  write(
    "apps/frontend/src/pages/index.astro",
    `---\n---\n<html lang="ja">\n  <head><title>${pocName}</title></head>\n  <body><h1>${pocName}</h1></body>\n</html>\n`
  );

  // backend (Hono)
  write(
    "apps/backend/package.json",
    `${JSON.stringify(
      {
        name: `@yy-labs/${pocName}-backend`,
        private: true,
        scripts: {
          dev: "bun run --watch src/index.ts",
          build: "bun build src/index.ts --outdir dist",
          check: "biome check .",
          typecheck: "tsc --noEmit",
          test: "vitest run --passWithNoTests",
        },
        dependencies: { hono: "^4.6.0" },
        devDependencies: {
          vitest: "^2.0.0",
          "@vitest/coverage-v8": "^2.0.0",
        },
      },
      null,
      2
    )}\n`
  );
  write("apps/backend/tsconfig.json", frontendTsconfig("base"));
  write(
    "apps/backend/src/index.ts",
    `import { Hono } from "hono";\n\nconst app = new Hono();\n\napp.get("/", (c) => c.json({ message: "Hello from ${pocName}" }));\n\nexport default app;\n`
  );
  write(
    "apps/backend/src/index.test.ts",
    `import { describe, expect, it } from "vitest";
import app from "./index";

describe("GET /", () => {
  it("returns hello message", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello from ${pocName}" });
  });
});
`
  );
}

// --- CI workflow ---
const ciWorkflows: Record<Template, string> = {
  react: `name: ${pocName}

on:
  push:
    paths:
      - "${pocName}/**"
  pull_request:
    paths:
      - "${pocName}/**"

jobs:
  frontend:
    uses: ./.github/workflows/_frontend-ci.yml
    with:
      working-directory: "${pocName}/apps/frontend"
`,
  nextjs: `name: ${pocName}

on:
  push:
    paths:
      - "${pocName}/**"
  pull_request:
    paths:
      - "${pocName}/**"

jobs:
  frontend:
    uses: ./.github/workflows/_frontend-nextjs-ci.yml
    with:
      working-directory: "${pocName}/apps/frontend"
`,
  "astro-hono": `name: ${pocName}

on:
  push:
    paths:
      - "${pocName}/**"
  pull_request:
    paths:
      - "${pocName}/**"

jobs:
  frontend:
    uses: ./.github/workflows/_frontend-ci.yml
    with:
      working-directory: "${pocName}/apps/frontend"

  backend:
    uses: ./.github/workflows/_backend-hono-ci.yml
    with:
      working-directory: "${pocName}/apps/backend"
`,
};

writeFileSync(
  join(root, ".github", "workflows", `poc-${pocName}.yml`),
  ciWorkflows[template as Template]
);

console.log(`✓ Created ${pocName}/ (${template})`);
console.log(`✓ Created .github/workflows/poc-${pocName}.yml`);
console.log(`\nNext: cd ${pocName}/apps/frontend && bun install`);
