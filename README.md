# yy-labs
複数pocが所属するモノレポ、共通デプロイアクション等を記載予定


## 想定構成
githubactionの共通化、typescript系で使いまわせるものはpackagesへ<br>

```
yy-labs/  
├── {poc-name}/  
│   ├── apps/  
│   │   ├── frontend/  
│   │   └── backend/  
│   ├── docs/  
│   ├── .env.example  
│   └── README.md  
├── packages/  
│   └── config/  
├── .github/  
│   └── workflows/  
├── package.json      # bun workspaces  
└── README.md  
```
