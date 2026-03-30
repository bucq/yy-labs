# yy-labs ⚗️ 

チーム開発POCを管理するモノレポ

## 構成

```
yy-labs/
├── {poc-name}/              # 各POCのルート
│   ├── apps/
│   │   ├── frontend/        # TypeScript (React等)
│   │   └── backend/         # FastAPI / Firebase / Supabase
│   ├── docs/                # POC固有の設計メモ
│   ├── .env.example
│   └── README.md
├── packages/
│   └── config/
│       ├── eslint/          # 共通ESLint設定
│       └── tsconfig/        # 共通TSConfig
├── .github/
│   └── workflows/           # 共通CI (Reusable Workflows)
└── README.md
```

## セットアップ

クローン後に一度だけ実行：

```bash
bun install        # 依存関係のインストール
bun lefthook install  # gitフックの登録
```

## POCの追加手順

スクリプトで一括生成：

```bash
bun create-poc <template> <poc-name>

# テンプレート一覧
bun create-poc react my-poc        # Vite + React
bun create-poc nextjs my-poc       # Next.js
bun create-poc astro-hono my-poc   # Astro + Hono
```

以下が自動生成されます：
- `{poc-name}/` — アプリ雛形（tsconfig, eslint, package.json, ソースファイル）
- `.github/workflows/poc-{name}.yml` — CIワークフロー

生成後：

```bash
cd {poc-name}/apps/frontend && bun install
# astro-hono の場合
cd {poc-name}/apps/backend && bun install
```

## 共通設定の使い方

### TSConfig

```json
// {poc-name}/apps/frontend/tsconfig.json（React）
{
  "extends": "@yy-labs/tsconfig/react"
}
```

```json
// {poc-name}/apps/backend/tsconfig.json（Hono）
{
  "extends": "@yy-labs/tsconfig/base"
}
```

### ESLint

```js
// {poc-name}/apps/frontend/.eslintrc.js（React）
module.exports = {
  extends: ["@yy-labs/eslint-config/react"]
}
```

```js
// {poc-name}/apps/backend/.eslintrc.js（Hono）
module.exports = {
  extends: ["@yy-labs/eslint-config/base"]
}
```

## メンバー
- ...
