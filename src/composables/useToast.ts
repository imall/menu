import { readonly, ref } from 'vue'

// 一個頁面只有一個 app 實例，所以 toast 用模組層級的單例共享即可
const message = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

export const useToast = () => {
  const show = (msg: string) => {
    message.value = msg
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      message.value = ''
    }, 2200)
  }

  return { message: readonly(message), show }
}
