export interface MenuItem {
  id: string
  name: string
  price: number
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

/** label 是畫面上顯示的號碼，tel 是撥號用的 E.164 格式 */
export interface Phone {
  label: string
  tel: string
}

/** 各店 menu.json 的形狀 */
export interface StoreMenu {
  phones: Phone[]
  groups: MenuGroup[]
}

export interface StoreTheme {
  brand: string
  brandTo: string
  accent: string
  ok: string
  danger: string
}

/** stores.json 的單筆，是店家顯示資訊與主題色的唯一來源 */
export interface StoreMeta {
  slug: string
  name: string
  /** 例："3{Q} 脆皮雞排" —— 大括號內的字會套用 accent 色 */
  logo: string
  tagline?: string
  /** 分享文字開頭的圖示，例：🍗 */
  emoji: string
  theme: StoreTheme
  /** 不列在首頁，但網址仍可直接訪問 */
  hidden?: boolean
}
