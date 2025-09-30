# FridgeMaster Backend

## 安裝與設定

### 1. 安裝依賴
\`\`\`bash
npm install
\`\`\`

### 2. 設定環境變數
複製 `.env.example` 為 `.env` 並填入您的設定：
\`\`\`bash
cp .env.example .env
\`\`\`

### 3. 設定資料庫
\`\`\`bash
# 產生 Prisma Client
npm run prisma:generate

# 執行資料庫遷移
npm run prisma:migrate

# 開啟 Prisma Studio (可選)
npm run prisma:studio
\`\`\`

### 4. 啟動開發伺服器
\`\`\`bash
npm run dev
\`\`\`

伺服器將運行在 `http://localhost:3001`

## 可用指令

- `npm run dev` - 啟動開發伺服器（含熱重載）
- `npm run build` - 建置生產版本
- `npm start` - 啟動生產伺服器
- `npm run prisma:generate` - 產生 Prisma Client
- `npm run prisma:migrate` - 執行資料庫遷移
- `npm run prisma:studio` - 開啟 Prisma Studio

## API 文件

詳細的 API 文件請參考主專案的 README.md
