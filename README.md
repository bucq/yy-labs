# yy-labs 🧪

個人・チーム開発のPOCを管理するモノレポ

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

## POCの追加手順

1. `{poc-name}/` ディレクトリを作成
2. `apps/frontend/` と `apps/backend/` を追加
3. `.github/workflows/poc-template.yml` をコピーして `poc-{name}.yml` にリネーム
4. `{poc-name}` を実際のPOC名に置換

## 共通設定の使い方

### TSConfig
```json
// {poc-name}/apps/frontend/tsconfig.json
{
  "extends": "@yy-labs/tsconfig/react"
}
```

### ESLint
```js
// {poc-name}/apps/frontend/.eslintrc.js
module.exports = {
  extends: ["@yy-labs/eslint-config/react"]
}
```

## メンバー
- ...
