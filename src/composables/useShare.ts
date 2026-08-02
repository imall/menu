import { ref } from 'vue'
import { useOrderStore } from '../stores/order'
import { useStoreMeta } from '../storeMeta'
import { useToast } from './useToast'

export const useShare = () => {
  const order = useOrderStore()
  const meta = useStoreMeta()
  const { show } = useToast()

  /** 非 HTTPS 或舊瀏覽器複製失敗時，改成讓使用者自己長按全選的文字 */
  const fallbackText = ref('')

  const shareText = () => {
    const lines = order.orderLines.map(
      (l) => `${l.name} $${l.price} × ${l.qty} = $${l.price * l.qty}`,
    )
    return [
      `${meta.emoji} ${meta.name} 訂單`,
      ...lines,
      `合計 $${order.total}`,
      '',
      '點連結可看明細／繼續加點：',
      order.orderUrl(true),
    ].join('\n')
  }

  const copyToClipboard = async (text: string, okMsg: string) => {
    try {
      await navigator.clipboard.writeText(text)
      show(okMsg)
    } catch {
      fallbackText.value = text
    }
  }

  const shareOrder = async () => {
    const text = shareText()
    // 連結寫在 text 內而不另傳 url：部分 App 收到兩者時只會取其一
    if (navigator.share) {
      try {
        await navigator.share({ title: `${meta.name} 訂單`, text })
        return
      } catch (err) {
        // 使用者自己取消，不是錯誤，也不該退回複製
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }
    await copyToClipboard(text, '已複製訂單，可直接貼上')
  }

  // 桌面的系統分享面板沒有「複製連結」也沒有 LINE，所以獨立給一顆
  const copyLink = () => copyToClipboard(order.orderUrl(true), '已複製連結')

  return { fallbackText, shareOrder, copyLink }
}
