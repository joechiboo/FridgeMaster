# FridgeMaster Frontend

## 安裝與設定

### 1. 安裝依賴
\`\`\`bash
npm install
\`\`\`

### 2. 設定環境變數
複製 `.env.local.example` 為 `.env.local`：
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

### 3. 啟動開發伺服器
\`\`\`bash
npm run dev
\`\`\`

應用程式將運行在 `http://localhost:3000`

## 可用指令

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm start` - 啟動生產伺服器
- `npm run lint` - 執行 ESLint

## 專案結構

\`\`\`
frontend/
├── app/                    # Next.js App Router
│   ├── login/             # 登入頁面
│   ├── signup/            # 註冊頁面
│   ├── dashboard/         # 主控台頁面
│   ├── layout.tsx         # 根佈局
│   ├── page.tsx           # 首頁
│   ├── providers.tsx      # React Query Provider
│   └── globals.css        # 全域樣式
│
├── lib/                   # 工具函式庫
│   ├── api.ts            # API 客戶端
│   └── store.ts          # Zustand 狀態管理
│
├── components/           # 共用元件（未來擴充）
└── public/              # 靜態資源
\`\`\`

## 技術細節

- **Next.js 14** - React 框架（使用 App Router）
- **TypeScript** - 型別安全
- **Tailwind CSS** - 樣式框架
- **React Query** - 伺服器狀態管理
- **Zustand** - 客戶端狀態管理
- **React Hook Form** - 表單處理
- **Axios** - HTTP 客戶端
