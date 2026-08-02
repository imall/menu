<script setup lang="ts">
import { useOrderStore } from '../stores/order'

const order = useOrderStore()
defineEmits<{ open: [] }>()
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-white px-4 py-3 shadow-[0_-2px_12px] shadow-black/8"
  >
    <div class="text-[15px]">
      合計：<b class="text-2xl text-danger">${{ order.total }}</b>
      <div class="text-[13px] text-neutral-500">已選 {{ order.totalCount }} 件</div>
    </div>
    <button
      type="button"
      class="cursor-pointer rounded-[30px] bg-ok px-7 py-3 text-[17px] font-extrabold text-white shadow-[0_3px_10px] shadow-ok/40 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:shadow-none"
      :disabled="order.totalCount === 0"
      @click="$emit('open')"
    >
      完成
    </button>
  </div>
</template>
