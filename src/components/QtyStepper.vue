<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '../stores/order'

const props = withDefaults(
  defineProps<{ orderKey: string; label: string; small?: boolean }>(),
  { small: false },
)

const order = useOrderStore()
const count = computed(() => order.qty[props.orderKey] ?? 0)
</script>

<template>
  <div class="flex shrink-0 items-center gap-2">
    <button
      type="button"
      class="flex items-center justify-center rounded-full bg-neutral-200 font-extrabold text-neutral-400 transition active:scale-90 enabled:cursor-pointer enabled:text-ink disabled:cursor-not-allowed"
      :class="small ? 'size-7 text-lg' : 'size-[34px] text-xl'"
      :disabled="count === 0"
      :aria-label="`減少 ${label}`"
      @click="order.dec(orderKey)"
    >
      −
    </button>
    <span
      class="text-center font-extrabold tabular-nums"
      :class="small ? 'w-5 text-[15px]' : 'w-[26px] text-[17px]'"
      >{{ count }}</span
    >
    <button
      type="button"
      class="flex cursor-pointer items-center justify-center rounded-full bg-brand font-extrabold text-white transition active:scale-90"
      :class="small ? 'size-7 text-lg' : 'size-[34px] text-xl'"
      :aria-label="`增加 ${label}`"
      @click="order.inc(orderKey)"
    >
      ＋
    </button>
  </div>
</template>
