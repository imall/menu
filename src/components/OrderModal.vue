<script setup lang="ts">
import { useOrderStore } from '../stores/order'
import { useShare } from '../composables/useShare'

const order = useOrderStore()
// fallbackText 隨這個元件的 v-if 卸載一起消失，等同原本關閉視窗時的清空行為
const { fallbackText, shareOrder, copyLink } = useShare()

const emit = defineEmits<{ close: [] }>()

const resetAll = () => {
  order.reset()
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
    @click.self="emit('close')"
  >
    <div class="flex max-h-[85vh] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl bg-white">
      <h2 class="bg-brand p-4 text-center text-xl text-white">訂單明細</h2>

      <div class="overflow-y-auto px-4 py-2">
        <div
          v-for="line in order.orderLines"
          :key="line.id"
          class="flex justify-between border-b border-dashed border-line py-2.5"
        >
          <div>
            <span class="font-semibold">{{ line.name }}</span>
            <span class="ml-1.5 text-[13px] text-neutral-500"
              >${{ line.price }} × {{ line.qty }}</span
            >
          </div>
          <div class="font-bold text-danger">${{ line.price * line.qty }}</div>
        </div>
        <div v-if="order.orderLines.length === 0" class="py-[30px] text-center text-neutral-400">
          尚未選擇任何品項
        </div>
      </div>

      <div class="flex items-center justify-between border-t-2 border-ink px-4 py-3.5 text-lg">
        <span>總金額</span>
        <b class="text-[26px] text-danger">${{ order.total }}</b>
      </div>

      <div class="flex gap-2.5 px-4 pb-2.5">
        <button
          type="button"
          class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[28px] border-2 border-brand bg-brand px-2 py-3 text-base font-extrabold whitespace-nowrap text-white shadow-[0_3px_10px] shadow-brand/35 transition active:scale-[.97] hover:bg-brand/85"
          @click="shareOrder"
        >
          <svg
            class="size-[17px] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          </svg>
          分享訂單
        </button>
        <button
          type="button"
          class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[28px] border-2 border-brand bg-brand/10 px-2 py-3 text-base font-extrabold whitespace-nowrap text-brand transition active:scale-[.97] hover:bg-brand/20"
          @click="copyLink"
        >
          <svg
            class="size-[17px] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
          複製連結
        </button>
      </div>

      <div v-if="fallbackText" class="px-4 pb-3">
        <div class="mb-1.5 text-[13px] text-neutral-500">長按下方文字全選複製：</div>
        <textarea
          class="w-full resize-none rounded-[10px] border border-line bg-neutral-50 p-2.5 font-sans text-[13px] leading-relaxed text-ink"
          readonly
          rows="9"
          :value="fallbackText"
          @focus="($event.target as HTMLTextAreaElement).select()"
        />
      </div>

      <div class="flex gap-2.5 px-4 pb-4">
        <button
          type="button"
          class="flex-1 cursor-pointer rounded-[28px] bg-neutral-200 py-3 text-base font-bold text-ink"
          @click="emit('close')"
        >
          繼續點餐
        </button>
        <button
          type="button"
          class="flex-1 cursor-pointer rounded-[28px] bg-danger py-3 text-base font-bold text-white"
          @click="resetAll"
        >
          清空訂單
        </button>
      </div>
    </div>
  </div>
</template>
