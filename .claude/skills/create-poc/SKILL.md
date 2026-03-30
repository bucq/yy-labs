---
name: create-poc
description: Scaffold a new POC (proof-of-concept) project in the yy-labs monorepo using the `bun create-poc` command. Use this skill whenever the user wants to add a new POC, experiment, or sub-project to yy-labs — even if they just say things like "start a new project", "add a poc", "create a new app", "scaffold something", or mention wanting to try a framework inside yy-labs. Don't wait for the user to spell out "create-poc" — proactively use this skill any time a new yy-labs project is being kicked off.
---

# create-poc

Scaffold a new POC project inside the yy-labs monorepo.

## What this skill does

Runs `bun create-poc <template> <poc-name>` from the yy-labs root directory (`c:\Users\yu820\work\project\yy-labs`). This generates the full directory structure, config files, and a GitHub Actions CI workflow for the new POC.

## Available templates

| Template     | Stack                                      |
|--------------|--------------------------------------------|
| `react`      | Vite + React (frontend only)               |
| `nextjs`     | Next.js (frontend only)                    |
| `astro-hono` | Astro frontend + Hono backend              |

## Process

### Step 1: Gather required inputs

You need two pieces of information before running the command:

1. **Template** — one of: `react`, `nextjs`, `astro-hono`
2. **POC name** — a kebab-case identifier for the project (e.g. `my-experiment`, `auth-demo`)

If either is missing from the user's message, ask for them before proceeding. Be concise — a single question covering both is fine if both are missing.

**Example prompt when both are missing:**
> Which template would you like to use (`react`, `nextjs`, or `astro-hono`), and what should the POC be called?

### Step 2: Run the scaffold command

Once you have both inputs, run the following from the yy-labs working directory:

```bash
cd "c:\Users\yu820\work\project\yy-labs" && bun create-poc <template> <poc-name>
```

The script will:
- Create `<poc-name>/` with the full app structure
- Generate `.github/workflows/poc-<poc-name>.yml` for CI

### Step 3: Show next steps

After a successful run, tell the user what to do next. Tailor the message to the template:

**For `react` and `nextjs`:**
```
Next steps:
  cd <poc-name>/apps/frontend
  bun install
```

**For `astro-hono`:**
```
Next steps:
  cd <poc-name>/apps/frontend && bun install
  cd <poc-name>/apps/backend && bun install
```

Also mention that a CI workflow was created at `.github/workflows/poc-<poc-name>.yml`.

## Error handling

- If the directory already exists, the script exits with an error. Let the user know and suggest they choose a different name.
- If the template name is invalid, show the list of valid templates and ask the user to pick one.
