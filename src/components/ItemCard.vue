<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '../stores/order'
import type { MenuItem } from '../types'

const props = defineProps<{ item: MenuItem }>()

const order = useOrderStore()
const count = computed(() => order.qty[props.item.id] ?? 0)
</script>

<template>
  <div
    class="flex items-center justify-between rounded-xl border bg-paper p-3 transition-shadow"
    :class="
      count > 0
        ? 'border-brand shadow-[0_2px_8px] shadow-brand/25'
        : 'border-line shadow-[0_1px_3px] shadow-black/5'
    "
  >
    <div>
      <div class="text-base font-bold">{{ item.name }}</div>
      <div class="mt-0.5 text-sm font-bold text-danger">${{ item.price }}</div>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="flex size-[34px] items-center justify-center rounded-full bg-neutral-200 text-xl font-extrabold text-neutral-400 transition active:scale-90 enabled:text-ink enabled:cursor-pointer disabled:cursor-not-allowed"
        :disabled="count === 0"
        :aria-label="`減少 ${item.name}`"
        @click="order.dec(item.id)"
      >
        −
      </button>
      <span class="w-[26px] text-center text-[17px] font-extrabold tabular-nums">{{ count }}</span>
      <button
        type="button"
        class="flex size-[34px] cursor-pointer items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white transition active:scale-90"
        :aria-label="`增加 ${item.name}`"
        @click="order.inc(item.id)"
      >
        ＋
      </button>
    </div>
  </div>
</template>
