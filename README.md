# menu — 多商家線上點餐

靜態點餐頁，每家店有自己的網址、菜單與主題色。客人選好品項後把訂單編進網址分享出去，收到連結的人可以看明細、繼續加點。沒有後端，訂單只存在網址裡。

線上網址：<https://imall.dev/menu/>

## 開發

```bash
pnpm install
pnpm dev        # http://localhost:5173/menu/
pnpm build      # 型別檢查 + 建置到 dist/
pnpm preview    # 預覽建置結果
```

> 本機的 `npm` 已損壞（nvm 安裝缺 `@npmcli/config`），請一律使用 `pnpm`。

## 新增一家店

1. 在根目錄建一個以 slug 命名的資料夾（例如 `ricebox/`），放三個檔案：

   ```
   ricebox/
   ├─ index.html   # 直接複製 3q/index.html，內容不用改
   ├─ main.ts      # mountStore('ricebox', menu)
   └─ menu.json    # 電話 + 菜單
   ```

2. 在 `stores.json` 加一筆，`slug` 要跟資料夾同名。店名、標語、主題色都寫在這裡。
3. `git push` — GitHub Actions 會自動重建並發布。

注意事項：

- **slug 不可與 `src`、`dist`、`public`、`node_modules`、`.github` 撞名**，因為店家資料夾直接放在根目錄（這樣網址才會是 `/menu/ricebox/` 而不是 `/menu/stores/ricebox/`）。
- 品項 `id` 只需在同一家店內唯一，不同店可以重複。
- **已上線的品項 id 不要改動**，否則之前分享出去的訂單連結會對不上。
- `logo` 用大括號標記要套 accent 色的字，例如 `"3{Q} 脆皮雞排"`。
- `menu.json` 的欄位由 TypeScript 依 `src/types.ts` 的 `StoreMenu` 驗證，寫錯會在 `pnpm build` 就報錯。

## 架構

多頁建置（MPA），不用 vue-router：`vite.config.ts` 讀 `stores.json` 產生每家店的 HTML 進入點，所以 `/menu/3q/` 是一個真實檔案、回 200，社群分享預覽也抓得到店名。GitHub Pages 沒有 rewrite 能力，SPA 路由只能靠 404.html fallback，這裡刻意避開。

- `stores.json` — 店家清單、主題色、顯示資訊的唯一來源，同時餵給建置設定與首頁。
- `vite.config.ts` 的 `storeHead` plugin — 把 title / OG / 主題色 `<style>` 注入各店 `index.html` 的 `<!--HEAD-->`，避免店名顏色兩地不同步。主題色走內聯 `<style>` 是為了不在載入瞬間閃過預設色。
- `src/style.css` — 預設主題放在 `@layer base` 裡。無層級樣式優先於任何 layer，各店內聯的 `<style>` 才蓋得掉，不受 `<link>` 載入順序影響。
- `src/stores/order.ts` — 訂單狀態與 `?o=a1.2_b3.1` 的編解碼。分享連結用 `location.pathname` 組成，所以天生指回同一家店。
- 各店 `menu.json` 在建置期就內聯進 bundle，執行期不再 fetch。

## 部署

推上 `main` 由 `.github/workflows/deploy.yml` 自動建置發布。Pages 來源必須設為 **GitHub Actions**（不是 Deploy from a branch）。Custom domain 欄位留空，專案頁會自動沿用 `imall.github.io` 的 `imall.dev`。
