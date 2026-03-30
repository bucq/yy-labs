#!/usr/bin/env bun
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

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
  JSON.stringify({ extends: `@yy-labs/tsconfig/${ext}` }, null, 2) + "\n";

const frontendEslint = (ext: "react" | "base") =>
  `/** @type {import("eslint").Linter.Config} */\nmodule.exports = {\n  extends: ["@yy-labs/eslint-config/${ext}"],\n};\n`;

if (template === "react") {
  write(
    "apps/frontend/package.json",
    JSON.stringify(
      {
        name: `@yy-labs/${pocName}-frontend`,
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          lint: "eslint .",
          typecheck: "tsc --noEmit",
        },
        dependencies: { react: "^18.3.0", "react-dom": "^18.3.0" },
        devDependencies: {
          "@vitejs/plugin-react": "^4.3.0",
          vite: "^5.4.0",
        },
      },
      null,
      2
    ) + "\n"
  );
  write("apps/frontend/tsconfig.json", frontendTsconfig("react"));
  write("apps/frontend/.eslintrc.js", frontendEslint("react"));
  write(
    "apps/frontend/vite.config.ts",
    `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n});\n`
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
    JSON.stringify(
      {
        name: `@yy-labs/${pocName}-frontend`,
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
          typecheck: "tsc --noEmit",
        },
        dependencies: { next: "^14.2.0", react: "^18.3.0", "react-dom": "^18.3.0" },
        devDependencies: { "@types/react": "^18.3.0", "@types/react-dom": "^18.3.0" },
      },
      null,
      2
    ) + "\n"
  );
  write("apps/frontend/tsconfig.json", frontendTsconfig("react"));
  write("apps/frontend/.eslintrc.js", frontendEslint("react"));
  write(
    "apps/frontend/next.config.ts",
    `import type { NextConfig } from "next";\n\nconst config: NextConfig = {};\n\nexport default config;\n`
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
    JSON.stringify(
      {
        name: `@yy-labs/${pocName}-frontend`,
        private: true,
        scripts: {
          dev: "astro dev",
          build: "astro build",
          lint: "eslint .",
          typecheck: "tsc --noEmit",
        },
        dependencies: { astro: "^4.15.0" },
      },
      null,
      2
    ) + "\n"
  );
  write("apps/frontend/tsconfig.json", frontendTsconfig("base"));
  write("apps/frontend/.eslintrc.js", frontendEslint("base"));
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
    JSON.stringify(
      {
        name: `@yy-labs/${pocName}-backend`,
        private: true,
        scripts: {
          dev: "bun run --watch src/index.ts",
          build: "bun build src/index.ts --outdir dist",
          lint: "eslint .",
          typecheck: "tsc --noEmit",
        },
        dependencies: { hono: "^4.6.0" },
      },
      null,
      2
    ) + "\n"
  );
  write("apps/backend/tsconfig.json", frontendTsconfig("base"));
  write("apps/backend/.eslintrc.js", frontendEslint("base"));
  write(
    "apps/backend/src/index.ts",
    `import { Hono } from "hono";\n\nconst app = new Hono();\n\napp.get("/", (c) => c.json({ message: "Hello from ${pocName}" }));\n\nexport default app;\n`
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
