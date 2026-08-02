import { inject, type InjectionKey } from 'vue'
import type { StoreMenu } from './types'

export const storeMenuKey: InjectionKey<StoreMenu> = Symbol('storeMenu')

export const useStoreMenu = (): StoreMenu => {
  const menu = inject(storeMenuKey)
  if (!menu) throw new Error('找不到 storeMenu，請確認頁面是由 mountStore() 掛載')
  return menu
}
