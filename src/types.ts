/** 同一品項的價格變化，例如飲料的中／大／特大、蛋餅的原味／特酥 */
export interface Variant {
  /** 會進網址的短代號，同一品項內唯一，不可含 . 或 _ */
  code: string
  label: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  /** 單一價格品項用 price，多價格品項用 variants，兩者擇一 */
  price?: number
  variants?: Variant[]
  /** 小字補充，例如「冬季限定 12月~2月」 */
  note?: string
}

export interface MenuGroup {
  title: string
  /** 分類層級的說明，例如「皆加蛋」 */
  note?: string
  /** 此分類的單一價格品項可勾選「加辣」，加辣份數另計一行並標註備註 */
  spicy?: boolean
  items: MenuItem[]
}

/** label 是畫面上顯示的號碼，tel 是撥號用的 E.164 格式 */
export interface Phone {
  label: string
  tel: string
}

/** 各店 menu.json 的形狀 */
export interface StoreMenu {
  /** 沒提供訂購電話的店家可以整個省略 */
  phones?: Phone[]
  /** 顯示在菜單最上方的全店公告，例如升級套餐規則 */
  notes?: string[]
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
