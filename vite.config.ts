import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import storesJson from './stores.json' with { type: 'json' }
import type { StoreMeta } from './src/types.js'

const root = fileURLToPath(new URL('.', import.meta.url))
const stores: StoreMeta[] = storesJson

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * 把 stores.json 的 title / OG / 主題色注入各店 index.html 的 <!--HEAD--> 佔位符。
 * 這樣店名與顏色只存在 stores.json 一處，不會跟各店 HTML 失去同步；
 * 主題色走內聯 <style> 而不是等 JS 執行才設定，避免載入瞬間閃過預設色。
 */
const storeHead = (): Plugin => ({
  name: 'store-head',
  transformIndexHtml: {
    order: 'pre',
    handler(html, ctx) {
      // 用來源檔的上層資料夾名當 slug，dev 與 build 都準（ctx.path 在兩者會不同）
      const slug = basename(dirname(ctx.filename))
      const store = stores.find((s) => s.slug === slug)
      if (!store) return html // 首頁 index.html 走這條，維持原樣

      const t = store.theme
      const title = `${store.name} — 線上點餐`
      return html.replace(
        '<!--HEAD-->',
        [
          `<title>${escapeHtml(title)}</title>`,
          `<meta name="description" content="${escapeHtml(store.tagline ?? '')}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:title" content="${escapeHtml(title)}" />`,
          `<meta property="og:description" content="${escapeHtml(store.tagline ?? '')}" />`,
          `<style>:root{--brand:${t.brand};--brand-to:${t.brandTo};--accent:${t.accent};--ok:${t.ok};--danger:${t.danger}}</style>`,
        ].join('\n  '),
      )
    },
  },
})

export default defineConfig({
  // GitHub Pages 專案頁的路徑前綴：https://imall.dev/menu/
  base: '/menu/',
  plugins: [vue(), tailwindcss(), storeHead()],
  build: {
    rollupOptions: {
      // MPA：每家店一個真實 HTML。輸出路徑沿用來源檔相對於專案根的路徑，
      // 所以店家資料夾必須放在根目錄（3q/ → /menu/3q/，而非 stores/3q/）。
      input: {
        home: resolve(root, 'index.html'),
        ...Object.fromEntries(stores.map((s) => [s.slug, resolve(root, s.slug, 'index.html')])),
      },
    },
  },
})
