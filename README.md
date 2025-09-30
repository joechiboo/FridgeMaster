# 冰箱管理大師 FridgeMaster

一個食材管理平台，幫助您追蹤冰箱中的食材，減少浪費。

> **目前狀態**: 純前端 Demo 版本，使用 localStorage 作為資料儲存，無需後端即可體驗完整功能。

## 功能特點

- 👤 使用者註冊與登入（Demo 模式）
- 🗄️ 多冰箱管理
- 📝 食材新增、刪除
- 🔍 食材搜尋與分類篩選
- ⏰ 到期日期提醒（視覺化顏色提示）
- 📊 直觀的表格介面
- 💾 資料存儲在瀏覽器 localStorage

## 技術架構

### 前端（目前版本）
- **框架**: Next.js 14 (App Router) + TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: Zustand + React Query
- **表單**: React Hook Form
- **資料儲存**: localStorage (Mock API)

### 後端（規劃中，已實作但未整合）
- **框架**: NestJS + TypeScript
- **資料庫**: PostgreSQL + Prisma ORM
- **認證**: JWT + bcrypt
- **API**: RESTful API

## 快速開始

### 前置需求
- Node.js 18+
- npm 或 yarn

### 安裝與運行

```bash
# Clone 專案
git clone https://github.com/joechiboo/FridgeMaster.git
cd FridgeMaster

# 進入前端資料夾
cd frontend

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

前端將運行在 `http://localhost:3000`

### 使用 Demo

1. 開啟瀏覽器訪問 `http://localhost:3000`
2. 點擊「登入」或「註冊」
3. **任意輸入帳號密碼即可進入系統**（Demo 模式）
4. 系統會自動產生示範資料（2個冰箱，6個食材）
5. 開始體驗食材管理功能！

## 專案結構

```
FridgeMaster/
├── backend/              # 後端 NestJS（已實作但未整合）
│   ├── prisma/          # Prisma schema & migrations
│   └── src/             # 後端原始碼
│
└── frontend/            # 前端 Next.js（目前運行版本）
    ├── app/
    │   ├── login/       # 登入頁
    │   ├── signup/      # 註冊頁
    │   └── dashboard/   # 主控台
    └── lib/
        ├── mockData.ts  # Mock API 與資料
        └── store.ts     # 狀態管理
```

## 功能說明

### 🏠 首頁
- 歡迎頁面，提供登入/註冊入口

### 🔐 登入/註冊
- Demo 模式：任意輸入即可進入
- 資料儲存在瀏覽器 localStorage

### 📊 主控台
- **冰箱管理**: 切換不同冰箱、新增冰箱
- **食材清單**: 表格顯示所有食材
- **顏色提示**:
  - 🔴 紅色：已過期
  - 🟠 橘色：1-3天內到期
  - 🟡 黃色：4-7天內到期
  - ⚪ 白色：7天以上
- **搜尋**: 依名稱或備註搜尋
- **篩選**: 依分類篩選
- **新增食材**: 填寫表單新增

## 示範資料

系統預設包含：
- 2 個冰箱（家用冰箱、辦公室冰箱）
- 6 個食材（包含不同到期狀態的範例）

## 資料持久化

- 所有資料儲存在瀏覽器 localStorage
- 關閉瀏覽器後資料仍會保留
- 可透過「登出」清除所有資料

## 開發路線圖

### ✅ 已完成（前端 Demo）
- [x] 基礎認證系統（Demo 模式）
- [x] 冰箱管理
- [x] 食材 CRUD
- [x] 搜尋與篩選
- [x] 到期日期視覺化

### 🔄 進行中
- [ ] 整合後端 API
- [ ] 真實的使用者認證

### 📋 規劃中
- [ ] 編輯食材功能
- [ ] 批量匯入
- [ ] CSV 匯出
- [ ] Email 提醒
- [ ] 統計圖表
- [ ] 行動裝置 App

## 開發相關

### 可用指令（前端）
```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本
npm start        # 啟動生產伺服器
npm run lint     # 執行 ESLint
```

### 切換到後端整合版本

後端程式碼已經完整實作，若要整合真實後端 API：

1. 設定 PostgreSQL 資料庫
2. 參考 `backend/README.md` 啟動後端
3. 修改前端 `lib/api.ts` 替換 mockApi
4. 更新環境變數指向後端 URL

詳細說明請參考 `backend/README.md`

## 📚 文件

- **[部署指南 (docs/DEPLOY.md)](docs/DEPLOY.md)** - GitHub Pages 完整部署教學與疑難排解
- **[快速部署 (DEPLOYMENT.md)](DEPLOYMENT.md)** - 簡易部署步驟

## 貢獻

歡迎提出 Issue 或 Pull Request！

## 授權

MIT License
