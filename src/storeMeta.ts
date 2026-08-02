import { inject, type InjectionKey } from 'vue'
import type { StoreMeta } from './types'

export const storeMetaKey: InjectionKey<StoreMeta> = Symbol('storeMeta')

export const useStoreMeta = (): StoreMeta => {
  const meta = inject(storeMetaKey)
  if (!meta) throw new Error('找不到 storeMeta，請確認頁面是由 mountStore() 掛載')
  return meta
}

/** "3{Q} 脆皮雞排" → [{ text: "3" }, { text: "Q", accent: true }, { text: " 脆皮雞排" }] */
export const parseLogo = (logo: string) =>
  logo
    .split(/[{}]/)
    .filter((part) => part !== '')
    .map((text, i) => ({ text, accent: i % 2 === 1 }))
