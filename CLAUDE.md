# CLAUDE.md

## プロジェクト概要

POCを管理するモノレポ。各POCは `{poc-name}/apps/frontend` と `apps/backend` で構成される。

## 技術スタック

- **パッケージマネージャー**: Bun
- **フロントエンド**: Vite + React / Next.js / Astro
- **バックエンド**: Hono（TypeScript）/ FastAPI（Python）
- **Lint/Format**: Biome（TypeScript）、Ruff（Python）
- **型チェック**: tsc（TypeScript）、mypy（Python）
- **Gitフック**: lefthook
- **CI**: GitHub Actions（Reusable Workflows）

## ディレクトリ構成

```
yy-labs/
├── {poc-name}/
│   ├── apps/
│   │   ├── frontend/        # フロントエンド
│   │   └── backend/         # バックエンド（任意）
│   ├── docs/
│   ├── .env.example
│   └── README.md
├── packages/config/
│   └── tsconfig/            # 共通TSConfig（base / react）
├── scripts/
│   └── create-poc.ts        # POC生成スクリプト
├── .github/workflows/       # Reusable Workflows
└── biome.json               # 共通Biome設定
```

## POC追加

スクリプトで生成する。手動でディレクトリを作らない。

```bash
bun create-poc react <poc-name>        # Vite + React
bun create-poc nextjs <poc-name>       # Next.js
bun create-poc astro-hono <poc-name>   # Astro + Hono
```

## CI

`.github/workflows/_frontend-ci.yml` などのReusable Workflowsを各POCのワークフローから呼び出す構成。
新しいPOC用ワークフローは `create-poc` スクリプトが自動生成するため手動作成不要。

## コーディングルール

`biome check` でエラーが出ないコードを書く。主なルール：

- Node.jsビルトインは `node:` プレフィックスを使う（`node:fs`, `node:path` など）
- 文字列連結ではなくテンプレートリテラルを使う
- インデント: スペース2つ
- 文字列: ダブルクォート
- 末尾カンマ: ES5スタイル（オブジェクト・配列の末尾にカンマあり）
- 1行の最大文字数: 100文字
- importは自動整理される前提で記述する
