# GitHub Pages 部署指南

本文件說明如何將 FridgeMaster 部署到 GitHub Pages。

## 📋 目錄

- [前置需求](#前置需求)
- [首次部署](#首次部署)
- [自動部署流程](#自動部署流程)
- [本地測試](#本地測試)
- [疑難排解](#疑難排解)
- [自訂網域](#自訂網域)

---

## 前置需求

- ✅ GitHub 帳號
- ✅ Git 已安裝
- ✅ Node.js 18+ 已安裝
- ✅ 程式碼已推送到 GitHub repository

---

## 首次部署

### 步驟 1: 啟用 GitHub Pages

1. 前往你的 GitHub repository：
   ```
   https://github.com/joechiboo/FridgeMaster
   ```

2. 點擊上方的 **Settings**（設定）

3. 左側選單找到 **Pages**

4. 在 **Build and deployment** 區域：
   - **Source**: 選擇 `GitHub Actions`
   - 不需要選擇分支（GitHub Actions 會自動處理）

5. 點擊 **Save**（儲存）

### 步驟 2: 觸發部署

部署會在以下情況自動觸發：
- 推送 commit 到 `main` 分支
- 手動觸發（在 Actions 頁面）

**手動觸發部署：**
1. 前往 Actions 頁面：
   ```
   https://github.com/joechiboo/FridgeMaster/actions
   ```

2. 點擊左側的 **Deploy to GitHub Pages**

3. 點擊右側的 **Run workflow** 按鈕

4. 選擇 `main` 分支

5. 點擊 **Run workflow** 確認

### 步驟 3: 等待部署完成

1. 在 Actions 頁面會看到部署進度

2. 部署流程包含兩個階段：
   - **build** (建置)：編譯 Next.js 應用程式
   - **deploy** (部署)：上傳到 GitHub Pages

3. 通常需要 **2-5 分鐘**

4. 成功後會顯示 ✅ 綠色勾勾

### 步驟 4: 訪問網站

部署完成後，訪問：
```
https://joechiboo.github.io/FridgeMaster/
```

---

## 自動部署流程

### 工作流程說明

每次推送到 `main` 分支時，會自動執行以下步驟：

```yaml
1. Checkout code (取得程式碼)
   ↓
2. Setup Node.js 18 (設定 Node.js 環境)
   ↓
3. Install dependencies (安裝依賴)
   ↓
4. Build Next.js (建置靜態網站)
   ↓
5. Upload artifact (上傳建置結果)
   ↓
6. Deploy to GitHub Pages (部署到 GitHub Pages)
```

### 查看部署歷史

1. 前往 Actions 頁面
2. 可以看到所有部署記錄
3. 點擊任一部署查看詳細 log

### 部署失敗通知

如果部署失敗：
- GitHub 會發送 Email 通知
- Actions 頁面會顯示紅色 ❌
- 點擊查看錯誤訊息

---

## 本地測試

在推送前，建議先本地測試建置：

### 測試建置流程

```bash
# 進入前端資料夾
cd frontend

# 安裝依賴
npm install

# 執行建置（靜態輸出）
npm run build

# 建置完成後會產生 out/ 資料夾
ls -la out/
```

### 本地預覽建置結果

```bash
# 使用 npx 執行靜態伺服器
npx serve out

# 或使用 Python
cd out
python -m http.server 8000

# 訪問 http://localhost:8000
```

### 檢查項目

✅ 建置無錯誤
✅ `out/` 資料夾存在
✅ `out/` 包含 HTML、CSS、JS 檔案
✅ 本地預覽正常運作
✅ 路徑正確（包含 `/FridgeMaster` 前綴）

---

## 疑難排解

### 問題 1: 部署後頁面空白

**可能原因：** 路徑設定錯誤

**解決方法：**

檢查 `frontend/next.config.js`：
```javascript
basePath: '/FridgeMaster',  // 確認這個設定正確
assetPrefix: '/FridgeMaster/',  // 結尾要有 /
```

### 問題 2: 樣式沒有載入

**可能原因：** Asset 路徑錯誤

**解決方法：**

1. 檢查瀏覽器 Console 的錯誤訊息
2. 確認 `assetPrefix` 設定
3. 清除瀏覽器快取重新載入

### 問題 3: GitHub Actions 建置失敗

**常見錯誤：**

**錯誤 A: `npm ci` 失敗**
```bash
解決：確認 package-lock.json 存在並已提交
```

**錯誤 B: TypeScript 編譯錯誤**
```bash
解決：本地執行 npm run build 修正錯誤
```

**錯誤 C: 權限問題**
```bash
解決：檢查 Repository Settings > Actions > General
確認 "Workflow permissions" 設定為 "Read and write permissions"
```

### 問題 4: 404 錯誤

**情況 A: 訪問網站時 404**
- 確認 GitHub Pages 已啟用
- 確認使用正確的 URL
- 等待幾分鐘（DNS 傳播）

**情況 B: 內部路由 404**
- 這是正常的（靜態輸出限制）
- Next.js 的客戶端路由會處理

### 問題 5: 更新沒有生效

**解決步驟：**
1. 確認 commit 已推送成功
2. 檢查 Actions 是否執行
3. 清除瀏覽器快取（Ctrl+Shift+R）
4. 等待 CDN 更新（可能需要幾分鐘）

---

## 進階設定

### 使用自訂網域

#### 步驟 1: 設定 DNS

在你的網域服務商設定：

**使用 A Record (根網域):**
```
Type: A
Host: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

**使用 CNAME (子網域):**
```
Type: CNAME
Host: www
Value: joechiboo.github.io
```

#### 步驟 2: GitHub 設定

1. 前往 Repository Settings > Pages
2. 在 **Custom domain** 輸入你的網域
3. 點擊 Save
4. 等待 DNS 檢查通過
5. 勾選 **Enforce HTTPS**

#### 步驟 3: 更新專案設定

建立 `frontend/public/CNAME`:
```
yourdomain.com
```

更新 `frontend/next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // 移除 basePath 和 assetPrefix（使用自訂網域時）
}
```

### 環境變數設定

如需在建置時使用環境變數：

#### 在 GitHub 設定 Secrets

1. 前往 Repository Settings > Secrets and variables > Actions
2. 點擊 **New repository secret**
3. 新增需要的變數

#### 在 workflow 中使用

編輯 `.github/workflows/deploy.yml`:
```yaml
- name: Build with Next.js
  run: npm run build
  working-directory: ./frontend
  env:
    NODE_ENV: production
    NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
```

---

## 更新部署

### 日常更新流程

```bash
# 1. 修改程式碼
vim frontend/app/page.tsx

# 2. 測試（可選）
cd frontend && npm run build

# 3. 提交變更
git add .
git commit -m "feat: 新增功能說明"

# 4. 推送到 GitHub
git push origin main

# 5. 自動部署會開始執行
```

### 回滾到先前版本

```bash
# 1. 查看 commit 歷史
git log --oneline

# 2. 回滾到特定 commit
git revert <commit-hash>

# 3. 推送
git push origin main
```

---

## 監控與維護

### 部署狀態徽章

在 README.md 加入部署狀態：

```markdown
[![Deploy to GitHub Pages](https://github.com/joechiboo/FridgeMaster/actions/workflows/deploy.yml/badge.svg)](https://github.com/joechiboo/FridgeMaster/actions/workflows/deploy.yml)
```

### 定期檢查

- ✅ 每週檢查部署狀態
- ✅ 更新依賴套件
- ✅ 檢查 GitHub Actions 使用量

---

## 相關連結

- **GitHub Repository**: https://github.com/joechiboo/FridgeMaster
- **GitHub Actions**: https://github.com/joechiboo/FridgeMaster/actions
- **Settings**: https://github.com/joechiboo/FridgeMaster/settings
- **GitHub Pages**: https://github.com/joechiboo/FridgeMaster/settings/pages
- **部署網站**: https://joechiboo.github.io/FridgeMaster/

---

## 技術細節

### Next.js 靜態輸出

**設定檔:** `frontend/next.config.js`

```javascript
{
  output: 'export',           // 啟用靜態輸出
  basePath: '/FridgeMaster',  // GitHub Pages 子路徑
  images: {
    unoptimized: true,        // 靜態輸出需要
  }
}
```

### GitHub Actions Workflow

**位置:** `.github/workflows/deploy.yml`

**觸發條件:**
- Push to `main` branch
- 手動觸發 (workflow_dispatch)

**權限需求:**
- `contents: read` - 讀取 repository
- `pages: write` - 寫入 GitHub Pages
- `id-token: write` - 部署認證

---

## 成本與限制

### GitHub Pages 限制

- ✅ **免費使用**
- ✅ 儲存空間：1 GB
- ✅ 頻寬：每月 100 GB
- ✅ 建置次數：每小時 10 次

### GitHub Actions 限制

- ✅ **Public Repository 免費無限制**
- Private Repository: 每月 2,000 分鐘

---

## 常見問題 FAQ

**Q: 部署需要多久？**
A: 通常 2-5 分鐘，視專案大小而定。

**Q: 可以部署到其他平台嗎？**
A: 可以！查看 README.md 中關於 Vercel 的說明。

**Q: 如何查看即時 log？**
A: 在 GitHub Actions 執行中點擊任務可以看到即時輸出。

**Q: 支援 API 呼叫嗎？**
A: 靜態網站可以呼叫外部 API，但本專案使用 localStorage 作為 mock 資料。

**Q: 可以使用環境變數嗎？**
A: 可以使用 `NEXT_PUBLIC_` 開頭的環境變數，會在建置時嵌入。

---

## 支援

遇到問題？

1. 📖 查看本文件的[疑難排解](#疑難排解)章節
2. 🔍 搜尋 [GitHub Issues](https://github.com/joechiboo/FridgeMaster/issues)
3. 💬 開啟新的 Issue 描述問題
4. 📧 聯繫專案維護者

---

**最後更新:** 2025-10-01
**版本:** 1.0.0
