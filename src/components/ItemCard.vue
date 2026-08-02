<script setup lang="ts">
import { computed } from 'vue'
import QtyStepper from './QtyStepper.vue'
import { orderKey, useOrderStore } from '../stores/order'
import type { MenuItem } from '../types'

const props = defineProps<{ item: MenuItem }>()

const order = useOrderStore()
// 有選項的品項，只要任一選項被點了就算 active
const count = computed(() => order.countOf(props.item))
</script>

<template>
  <div
    class="rounded-xl border bg-paper p-3 transition-shadow"
    :class="
      count > 0
        ? 'border-brand shadow-[0_2px_8px] shadow-brand/25'
        : 'border-line shadow-[0_1px_3px] shadow-black/5'
    "
  >
    <!-- 單一價格：名稱與數量同一列 -->
    <div v-if="!item.variants?.length" class="flex items-center justify-between gap-2">
      <div>
        <div class="text-base font-bold">{{ item.name }}</div>
        <div class="mt-0.5 text-sm font-bold text-danger">${{ item.price }}</div>
        <div v-if="item.note" class="mt-0.5 text-xs text-neutral-500">{{ item.note }}</div>
      </div>
      <QtyStepper :order-key="item.id" :label="item.name" />
    </div>

    <!--
      有選項：每個選項各自一列數量，這樣才點得出「2 杯中杯 + 1 杯大杯」。
      若做成選項鈕共用一個數量，同品項就只能點一種規格。
    -->
    <template v-else>
      <div class="text-base font-bold">{{ item.name }}</div>
      <div v-if="item.note" class="mt-0.5 text-xs text-neutral-500">{{ item.note }}</div>
      <div class="mt-1.5 flex flex-col gap-1.5">
        <div
          v-for="v in item.variants"
          :key="v.code"
          class="flex items-center justify-between gap-2 rounded-lg bg-black/3 px-2 py-1"
        >
          <div class="text-sm">
            <span class="text-neutral-600">{{ v.label }}</span>
            <span class="ml-1.5 font-bold text-danger">${{ v.price }}</span>
          </div>
          <QtyStepper :order-key="orderKey(item, v.code)" :label="`${item.name} ${v.label}`" small />
        </div>
      </div>
    </template>
  </div>
</template>
