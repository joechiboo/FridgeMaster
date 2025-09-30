# 冰箱管理大師 - 產品需求與開發規格文件

---

# 一、產品需求文件（PRD）

## 產品名稱
冰箱管理大師 Web 版

## 1. 產品簡介
「冰箱管理大師」Web 版是一款食材管理平台，使用者可以透過電腦快速輸入與管理冰箱食材資訊。系統會在食材即將過期前主動提醒，並提供清晰的庫存檢視、分類與篩選工具，協助使用者減少浪費與規劃餐點。

## 2. 產品目標
- 提升輸入效率：鍵盤＋批量操作，讓紀錄更快速。
- 減少食材浪費：透過提醒功能避免遺忘食材。
- 提升可視化體驗：Web UI 提供表格、圖表，讓使用者快速掌握庫存狀況。
- 建立雲端基礎：為後續行動裝置版本共享同一資料庫打基礎。

## 3. 使用者需求 / 使用情境
- 需求 1：快速新增與批量輸入食材。
- 需求 2：可從桌機瀏覽器管理庫存與搜尋篩選。
- 需求 3：需要即將過期提醒（透過 Email 或瀏覽器通知）。
- 需求 4：能夠以表格或清單方式檢視庫存，支援排序與篩選。
- 需求 5：後續能與行動裝置版共用資料（帳號系統）。

情境範例：
- 家庭主婦：一次性輸入大量食材，透過表格檢視哪些快過期。
- 小餐館店長：用 Web 管理庫存，透過 Email 通知掌握哪些食材需要盡快使用。

## 4. 功能需求
### 核心功能（MVP）
1. 食材管理（新增/編輯/刪除，批量輸入）
2. 提醒通知（到期前 X 天 Email / Web 推播）
3. 庫存檢視（表格與清單模式，排序、篩選、搜尋）

### 次要功能
- 分類管理
- 匯出 CSV/Excel

### 未來功能
- 條碼掃描
- 食譜建議
- 多人共享帳號

## 5. 非功能需求
- 平台：桌機優化的 Web 應用（Chrome / Edge / Safari）
- 通知：Email 為主，Web 推播選配
- UI/UX：表格＋清單雙模式、批量輸入
- 資料同步：雲端 API，行動版可共用

## 6. UI 設計建議（Web 優化）
- 首頁：表格檢視，支援排序/篩選，過期高亮
- 新增/編輯頁：表單＋批量輸入/CSV 匯入
- 提醒設定頁：提醒天數設定，Email/推播選擇
- 報表頁（未來）：庫存趨勢圖、過期統計

## 7. 操作流程（Web MVP）
### 新增食材
[庫存清單] → [新增食材按鈕] → [填寫表單/批量輸入] → [儲存] → [清單更新]

### 到期提醒
[Cron Job 每日] → 掃描即將到期食材 → 發送 Email / 推播通知 → 使用者點擊回到清單

### 搜尋與篩選
[輸入關鍵字/分類] → [API 過濾] → [表格更新]

## 8. 里程碑與交付
- MVP（2 個月）：新增/刪除/編輯、表格檢視、Email 提醒
- Phase 2（4-6 個月）：批量輸入、匯出、Web 推播、分類管理
- Phase 3（1 年內）：食譜建議、App 串接、多用戶共享

---

# 二、開發規格文件（Development Specification）

## 1. 系統架構
### 前端
- Next.js (React) + TypeScript
- Tailwind CSS + Headless UI
- React Query
- TanStack Table

### 後端
- Node.js + Express / NestJS
- TypeScript
- PostgreSQL + Prisma
- JWT Auth + bcrypt
- node-cron（每日提醒）

### 部署
- 前端：Vercel
- 後端：Railway / Render
- DB：Supabase / Neon
- Email：SendGrid

## 2. 使用者流程
1. 註冊/登入
2. 建立冰箱
3. 新增食材（單筆或批量）
4. 系統每日提醒到期食材
5. 使用者透過清單檢視與管理

## 3. 資料模型（Prisma Schema）
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  fridges   Fridge[]
}

model Fridge {
  id        String   @id @default(uuid())
  name      String
  ownerId   String
  createdAt DateTime @default(now())
  items     Item[]
}

model Item {
  id         String   @id @default(uuid())
  fridgeId   String
  name       String
  quantity   Float
  unit       String
  boughtAt   DateTime
  expireAt   DateTime
  category   String?
  note       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Reminder {
  id          String   @id @default(uuid())
  itemId      String
  daysBefore  Int
  scheduledAt DateTime
  status      String
}
```

## 4. API 設計
- Auth：`POST /auth/signup`，`POST /auth/login`
- Fridge：`GET /fridges`，`POST /fridges`
- Item：`GET /fridges/:id/items`，`POST /fridges/:id/items`，`PATCH /items/:id`，`DELETE /items/:id`
- Reminder：`POST /items/:id/reminders`，`GET /items/:id/reminders`

## 5. 前端模組設計
- 登入/註冊頁
- 庫存清單頁（表格模式、篩選、搜尋、標籤）
- 新增食材 Modal（單筆、批量）
- 提醒設定頁

## 6. 權限管理
- 使用者僅可存取自己冰箱
- 冰箱擁有者可管理食材
- JWT 驗證所有 API

## 7. 通知系統
- node-cron 每日執行
- 條件：`expireAt - daysBefore <= today`
- 發送 SendGrid Email

## 8. 測試規格
- 單元測試：Jest
- E2E 測試：Playwright
- 測試案例：新增食材、提醒觸發、刪除食材

## 9. 部署流程
- GitHub Actions CI
- 前端 Vercel，自動化部署
- 後端 Railway/Render，自動化部署
- DB Migration：Prisma

## 10. 開發時程
- W1：架構、Auth、DB Schema
- W2：食材管理、清單檢視
- W3：提醒排程、通知、搜尋
- W4：測試、CI/CD、部署
