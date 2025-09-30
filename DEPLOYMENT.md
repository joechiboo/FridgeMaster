# 部署指南

本專案已設定為自動部署到 GitHub Pages。

## 部署步驟

### 1. 推送程式碼到 GitHub

```bash
# 如果還沒初始化 git
git init
git add .
git commit -m "Initial commit: FridgeMaster frontend demo"

# 推送到遠端
git remote add origin https://github.com/joechiboo/FridgeMaster.git
git branch -M main
git push -u origin main
```

### 2. 啟用 GitHub Pages

1. 前往你的 GitHub repository: https://github.com/joechiboo/FridgeMaster
2. 點擊 **Settings** (設定)
3. 左側選單點擊 **Pages**
4. 在 **Source** 下選擇 **GitHub Actions**
5. 儲存設定

### 3. 自動部署

推送程式碼後，GitHub Actions 會自動：
1. 安裝依賴
2. 建置 Next.js 靜態網站
3. 部署到 GitHub Pages

你可以在 **Actions** 分頁查看部署進度。

### 4. 訪問網站

部署完成後，網站會在：
```
https://joechiboo.github.io/FridgeMaster/
```

## 本地測試建置

在推送前，可以先本地測試：

```bash
cd frontend

# 安裝依賴
npm install

# 建置
npm run build

# 檢查 out 資料夾
ls -la out/
```

## 設定說明

### next.config.js
- `output: 'export'` - 輸出靜態網站
- `basePath: '/FridgeMaster'` - GitHub Pages 路徑
- `images.unoptimized: true` - 靜態輸出需要

### GitHub Actions (.github/workflows/deploy.yml)
- 監聽 main 分支的 push
- 自動建置並部署
- 使用 Node.js 18

### .nojekyll
- 告訴 GitHub Pages 不使用 Jekyll
- 允許 `_next` 等開頭的資料夾

## 常見問題

### Q: 部署後頁面是空白的？
A: 檢查瀏覽器 Console，可能是路徑問題。確認 `basePath` 設定正確。

### Q: 樣式跑掉了？
A: 確認 `assetPrefix` 設定正確，包含結尾的 `/`。

### Q: 如何觸發重新部署？
A: 推送任何 commit 到 main 分支即可，或在 GitHub Actions 頁面手動觸發。

### Q: 想用自訂網域？
A: 在 GitHub Pages 設定中新增 Custom domain，並在 `frontend/public/` 加入 CNAME 檔案。

## 更新網站

只需要：
```bash
git add .
git commit -m "Update: 描述你的更新"
git push
```

GitHub Actions 會自動重新部署！
