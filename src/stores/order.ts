import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import type { MenuGroup, MenuItem } from '../types'

interface IndexedItem {
  name: string
  /** 有選項的品項才有，例如「大」「特酥」 */
  variant?: string
  price: number
  /** 菜單上的原始排序，讓明細順序永遠跟菜單一致 */
  order: number
}

/**
 * 訂單的鍵：無選項品項就是 id，有選項則是 id~變體代號。
 * ~ 跟 . _ 一樣是 URL unreserved 字元，不會被跳脫，
 * 而且不含 . 所以 decodeOrder 的 split('.') 仍然只會切出兩段。
 */
export const orderKey = (item: MenuItem, code?: string) =>
  code === undefined ? item.id : `${item.id}~${code}`

export const useOrderStore = defineStore('order', () => {
  const qty = reactive<Record<string, number>>({})
  const restoredFromLink = ref(false)

  // 菜單在建置期就內聯進 bundle，init 後不再變動，所以不需要是 reactive 的
  const itemMap: Record<string, IndexedItem> = {}

  const inc = (key: string) => {
    qty[key] = (qty[key] ?? 0) + 1
  }

  const dec = (key: string) => {
    const next = (qty[key] ?? 0) - 1
    // 歸零就整個刪掉，否則會編碼出 a1.0 這種無意義的片段
    if (next > 0) qty[key] = next
    else delete qty[key]
  }

  /** 一個品項底下所有選項的總數，用來決定卡片要不要highlight */
  const countOf = (item: MenuItem) => {
    if (!item.variants?.length) return qty[item.id] ?? 0
    return item.variants.reduce((s, v) => s + (qty[orderKey(item, v.code)] ?? 0), 0)
  }

  const orderLines = computed(() =>
    Object.keys(qty)
      .filter((key) => qty[key]! > 0 && itemMap[key])
      .sort((a, b) => itemMap[a]!.order - itemMap[b]!.order)
      .map((key) => {
        const entry = itemMap[key]!
        return {
          key,
          qty: qty[key]!,
          price: entry.price,
          // 明細與分享文字都用這個名稱，才看得出點的是哪個選項
          label: entry.variant ? `${entry.name}（${entry.variant}）` : entry.name,
        }
      }),
  )

  const total = computed(() => orderLines.value.reduce((s, l) => s + l.price * l.qty, 0))
  const totalCount = computed(() => orderLines.value.reduce((s, l) => s + l.qty, 0))

  // 訂單 ⇄ 網址：a1.2_b3.1（. 與 _ 都是 URL unreserved 字元，不會被跳脫）
  const encodeOrder = () => orderLines.value.map((l) => `${l.key}.${l.qty}`).join('_')

  const decodeOrder = (str: string) => {
    let applied = 0
    str.split('_').forEach((part) => {
      const seg = part.split('.')
      if (seg.length !== 2) return // 例如 a1.2.5 這種畸形字串一律拒絕
      const [key, n] = seg as [string, string]
      if (!itemMap[key] || !/^\d+$/.test(n)) return
      const num = parseInt(n, 10)
      if (num < 1 || num > 99) return
      qty[key] = num
      applied++
    })
    return applied
  }

  const orderUrl = (forShare = false) => {
    const params: string[] = []
    const code = encodeOrder()
    if (code) params.push('o=' + code)
    // LINE 內建瀏覽器看到 openExternalBrowser=1 會改用系統預設瀏覽器開啟。
    // 只加在分享出去的連結上，載入後 syncUrl 會把它從網址列清掉。
    if (forShare) params.push('openExternalBrowser=1')
    // pathname 已經帶著店家（/menu/3q/），所以分享連結天生就指回同一家店
    return location.origin + location.pathname + (params.length ? '?' + params.join('&') : '')
  }

  const syncUrl = () => history.replaceState(null, '', orderUrl())

  const reset = () => {
    Object.keys(qty).forEach((k) => delete qty[k])
  }

  /** 由 mountStore 在掛載前呼叫：建索引 → 還原分享連結 → 開始同步網址 */
  const init = (groups: MenuGroup[]) => {
    let order = 0
    groups.forEach((g) =>
      g.items.forEach((i) => {
        if (i.variants?.length) {
          i.variants.forEach((v) => {
            itemMap[orderKey(i, v.code)] = {
              name: i.name,
              variant: v.label,
              price: v.price,
              order: order++,
            }
          })
        } else {
          itemMap[i.id] = { name: i.name, price: i.price ?? 0, order: order++ }
        }
      }),
    )

    const code = new URLSearchParams(location.search).get('o')
    if (code && decodeOrder(code) > 0) restoredFromLink.value = true

    // 之後每次加減都同步網址，讓瀏覽器內建的分享／書籤也拿得到訂單
    watch(qty, syncUrl)
    syncUrl()
  }

  return {
    qty,
    restoredFromLink,
    init,
    inc,
    dec,
    countOf,
    reset,
    orderLines,
    total,
    totalCount,
    orderUrl,
  }
})
