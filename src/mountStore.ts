import { createApp } from 'vue'
import { createPinia } from 'pinia'
import StoreApp from './StoreApp.vue'
import { storeMetaKey } from './storeMeta'
import { storeMenuKey } from './storeMenu'
import { useOrderStore } from './stores/order'
import type { StoreMenu, StoreMeta } from './types'
import storesJson from '../stores.json'
import './style.css'

const stores: StoreMeta[] = storesJson

/**
 * 各店 main.ts 的唯一進入點。
 * menu 參數會被 TypeScript 拿 StoreMenu 型別去驗證 menu.json 的字面值，
 * 所以新增店家時欄位寫錯會在建置階段就被擋下來。
 */
export const mountStore = (slug: string, menu: StoreMenu) => {
  const meta = stores.find((s) => s.slug === slug)
  if (!meta) throw new Error(`stores.json 裡找不到 slug「${slug}」`)

  const app = createApp(StoreApp)
  app.use(createPinia())
  app.provide(storeMetaKey, meta)
  app.provide(storeMenuKey, menu)

  // 掛載前先建索引並還原 ?o= 分享連結，畫面第一幀就是正確的數量
  useOrderStore().init(menu.groups)

  app.mount('#app')
}
