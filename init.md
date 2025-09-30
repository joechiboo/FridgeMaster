product_name: "冰箱管理大師"

overview:
  description: "一款幫助用戶有效管理冰箱食材的工具，透過紀錄食材買入時間與保存期限，並提醒即將過期的食材。"
  goals:
    - "減少食材浪費"
    - "清楚顯示冰箱庫存"
    - "建立習慣化的食材管理流程"

user_needs:
  - id: 1
    need: "快速紀錄買入的食材與保存期限"
  - id: 2
    need: "提醒哪些食材快要過期"
  - id: 3
    need: "檢視當前冰箱有哪些食材"

use_cases:
  - persona: "小家庭媽媽"
    scenario: "每週採買食材，希望系統提醒過期狀況"
  - persona: "上班族"
    scenario: "常忘記冰箱裡有什麼，透過庫存檢視快速決定晚餐"

features:
  core:
    - name: "食材紀錄"
      details: "輸入名稱、數量、購買日期、保存期限"
    - name: "到期提醒"
      details: "在保存期限前 X 天推播通知"
  secondary:
    - name: "庫存檢視"
      details: "清單或分類方式顯示食材，支援篩選/排序"
  future:
    - "食譜建議"
    - "條碼掃描"
    - "多人共享"

non_functional:
  platform: ["iOS", "Android"]
  notifications: ["App 推播"]
  usability: "簡單輸入、盡量減少手動操作"
  security: "本地資料保存或雲端同步"

competitors:
  - description: "部分國外 App 缺乏中文化與在地食材分類"

milestones:
  - phase: "MVP"
    timeline: "2 個月內"
    deliverables:
      - "食材紀錄"
      - "到期提醒"
      - "基礎庫存檢視"
  - phase: "Phase 2"
    timeline: "4-6 個月"
    deliverables:
      - "庫存篩選/排序"
      - "UI/UX 改善"
  - phase: "Phase 3"
    timeline: "1 年內"
    deliverables:
      - "食譜建議"
      - "條碼掃描"
      - "多用戶共享"