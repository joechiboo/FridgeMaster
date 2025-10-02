# 冰箱管理大師 - 完整產品需求與開發規格文件（最新完整版）

---

## 一、產品概述
**產品名稱**：冰箱管理大師（Web 版為主，後續可延伸行動版）  

**目標**：  
- 減少食材浪費（到期提醒、庫存清晰呈現）。  
- 提升輸入與使用效率（批量輸入、快捷增減、食譜驅動消耗）。  
- 建立標準化資料庫（食材主檔 + 食譜模板），為跨裝置與多人共享打基礎。  
- 提供歷程與成本分析，利於追蹤與決策。  

**主要使用者情境**：  
- 家庭：管理日常冰箱庫存，避免食材過期。  
- 小餐館：管理大量食材，規劃採購與使用，支援報表與提醒。  

---

## 二、頁面資訊架構（IA）
### 1. 冰箱頁面（Fridge）
- **庫存**：清單/表格檢視、排序、篩選、搜尋、到期標記。  
- **採購**：購物清單管理（快速輸入、步進器增減、批量入庫）。  
- **使用**：直接消耗（+/-）、或依食譜消耗（Recipe Runner 扣減庫存）。  
- **歷程**：顯示操作紀錄（入庫、消耗、提醒、設定變更等）。  
- **報表/分析**：庫存成本、消耗成本分析。  

### 2. 食材資料庫（Ingredient Catalog）
- 標準名稱、常用單位、最小步進值、分類、保存期限建議。  
- 可建立別名、圖片、條碼綁定。  
- 用於輸入時的自動補全與預設帶入。  

### 3. 食譜（Recipes）
- 每份食譜定義所需食材、數量、單位，支援份量縮放。  
- 使用時可自動扣減庫存（FEFO 原則），不足部分自動轉入購物清單。  

---

## 三、功能需求
### 1. 庫存管理
- 新增/編輯/刪除食材  
- 批次入庫（購買日、到期日、單價可批量或逐項設定）  
- 表格/清單模式，支援排序（到期日、名稱）、篩選（分類/狀態）、搜尋  
- 數量調整：步進器 [-]/[+]，支援最小單位  

### 2. 採購清單
- 快速輸入（自然語法：`蘋果 x6, 牛奶 2L`）  
- 每列可勾選「已買」、增減數量、刪除  
- 核對/結帳 → 批次入庫轉成庫存批次  
- 未購買部分自動保留  

### 3. 食材使用
- **直接使用**：在庫存清單直接 [-]/[+] 扣減數量。  
- **食譜使用**：Recipe Runner，自動帶入食材與用量 → 扣減庫存（不足部分轉入購物清單）。  

### 4. 提醒通知
- 到期日前 X 天發送 Email 或 Web 推播  
- 提醒時間：使用者時區上午 9:00  
- 狀態標籤：今日、明日、已過期  

### 5. 食材資料庫
- 食材主檔（標準名稱、單位、保存天數、分類）  
- 自動補全與單位建議  
- 預設保存天數 → 入庫時自動生成到期日建議  

### 6. 食譜模組
- 食譜主檔：名稱、封面、步驟、標籤  
- 食譜項目：食材、數量、單位、是否必需  
- 支援份量縮放，庫存不足自動顯示差額  

### 7. 使用歷程
- 每一台冰箱的完整操作紀錄：入庫、更新、消耗、食譜使用、提醒發送、設定變更。  
- 可依時間、使用者、事件類型查詢，支援匯出。  

### 8. 成本分析
- 入庫時記錄單位成本（unit_cost）。  
- 計算消耗成本（依批次扣減，qty × unit_cost）。  
- 查詢庫存帳面成本（剩餘量 × 單位成本）。  
- 提供消耗成本報表（依品項/分類/食譜/期間彙總）。  
- 缺值標記與補登成本。  

---

## 四、資料模型（核心）
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
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

model ItemBatch {
  id         String   @id @default(uuid())
  itemId     String
  quantity   Float
  boughtAt   DateTime
  expireAt   DateTime
  unitCost   Float?
}

model ShoppingList {
  id        String   @id @default(uuid())
  userId    String
  name      String
  createdAt DateTime @default(now())
}

model ShoppingListItem {
  id        String   @id @default(uuid())
  listId    String
  name      String
  qty       Float
  unit      String
  status    String   // pending | purchased | removed
}

model Recipe {
  id        String   @id @default(uuid())
  name      String
  servings  Int
  createdAt DateTime @default(now())
}

model RecipeItem {
  id        String   @id @default(uuid())
  recipeId  String
  name      String
  qty       Float
  unit      String
  optional  Boolean @default(false)
}

model ActivityLog {
  id         String   @id @default(uuid())
  fridgeId   String
  userId     String?
  type       String
  occurredAt DateTime   @default(now())
  payload    Json
  note       String?
}

model ConsumptionCostSnapshot {
  id          String   @id @default(uuid())
  usageLogId  String
  fridgeId    String
  itemId      String
  batchId     String
  qty         Float
  unit        String
  unitCost    Float?
  totalCost   Float?
  occurredAt  DateTime
}
```

---

## 五、API 設計（精選）
### Auth
- `POST /auth/signup`、`POST /auth/login`

### Fridge & Items
- `GET /fridges/:id/items`  
- `POST /fridges/:id/items`（新增庫存）  
- `PATCH /items/:id`（更新）  
- `DELETE /items/:id`（刪除）  
- `POST /items/:id/consume`（消耗，FEFO 原則）  

### Shopping
- `POST /shopping-lists/:id/items`（快速新增，支援自然語法）  
- `POST /shopping-list-items/:id/increment` / `decrement`  
- `POST /shopping-lists/:id/check-in`（結帳入庫）  

### Recipes
- `GET /recipes`（查詢）  
- `GET /recipes/:id`（細節）  
- `POST /fridges/:id/consume-by-recipe`（依食譜消耗）  

### Reminders
- `GET /items/:id/reminders`  
- `POST /items/:id/reminders`  

### Activity & Cost
- `GET /fridges/:id/activity?from=&to=&type=&user_id=`  
- `GET /reports/cost/consumption?fridge_id=&from=&to=&group_by=`  
- `GET /reports/cost/inventory?fridge_id=&as_of=`  
- `GET /reports/cost/item/:item_id?from=&to=`  

---

## 六、操作流程
### 採購
1. 建立購物清單，快速輸入食材。  
2. 到店購買 → 勾選已買 → 結帳入庫。  
3. 系統轉成庫存批次，帶入購買日/到期日。  

### 使用
1. **直接消耗**：庫存清單中 [-]/[+]。  
2. **食譜使用**：選擇食譜 → 帶入食材數量 → FEFO 扣減 → 不足部分加入購物清單。  

### 歷程
- 每次入庫、更新、消耗、提醒、設定 → 記錄到 ActivityLog。  

### 成本
- 入庫時寫入批次成本 → 消耗時扣減對應成本 → 可查報表或計算帳面庫存成本。  

---

## 七、UI 設計建議
- **冰箱頁面**  
  - 庫存：表格清單，標籤顯示到期狀態。  
  - 採購：快速輸入框＋清單增減，勾選「已買」→ 入庫。  
  - 使用：Recipe Runner（份量選擇、庫存比對、不足標記）。  
  - 歷程：Timeline，卡片顯示事件明細。  
  - 報表：圖表＋表格顯示消耗與庫存成本。  

- **食材資料庫**  
  - 可管理標準食材，支援別名、單位、保存天數。  
  - 搜索自動補全，輸入效率高。  

- **食譜**  
  - 食譜清單、食譜細節頁。  
  - 使用時顯示食材庫存狀況，顯示不足項目。  

---

## 八、提醒與排程
- 每日 09:00（使用者時區）檢查庫存到期日。  
- 提醒方式：Email（必備）、Web 推播（選配）。  
- 過期狀態自動標記在庫存清單。  

---

## 九、開發時程建議（MVP）
- W1：架構搭建、Auth、DB Schema。  
- W2：庫存管理（新增/編輯/刪除）、清單檢視。  
- W3：購物清單與入庫、提醒排程。  
- W4：食譜模組（基礎）、直接消耗、歷程。  

---

## 十、範例場景
### 採購
輸入：`蘋果 x6, 蛋糕 x1, 牛奶 2L`  
入庫後庫存：  
- 蘋果 6 顆，到期 10/09  
- 蛋糕 1 個，到期 10/03  
- 牛奶 2 L，到期 10/05  

### 食譜使用（蘋果牛奶冰沙，2 人份）
- 食譜：蘋果 2 顆、牛奶 0.5 L、冰塊 10 顆（可選）  
- 扣減後：蘋果剩 4 顆、牛奶剩 1.5 L、冰塊不足 → 自動加入採購清單。  

### 歷程查詢
- 顯示：「2025-10-02 09:15：紀伯寧 使用食譜『蘋果牛奶冰沙』 → 扣減 蘋果 2 顆（批次#A），牛奶 0.5 L（批次#C）」  

### 成本分析
- 消耗報表顯示：  
  - 蘋果：用量 2 顆，總成本 40 元，平均單價 20 元/顆  
  - 牛奶：用量 0.5 L，總成本 25 元，平均單價 50 元/L  
- 庫存帳面成本：目前庫存總值 1,200 元  

---
