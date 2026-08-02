<script setup lang="ts">
import { useOrderStore } from '../stores/order'
import { parseLogo, useStoreMeta } from '../storeMeta'
import type { StoreMeta } from '../types'
import { useStoreMenu } from '../storeMenu'
import storesJson from '../../stores.json'

const meta = useStoreMeta()
const menu = useStoreMenu()
const order = useOrderStore()

const logoParts = parseLogo(meta.logo)
const stores: StoreMeta[] = storesJson
const hasOtherStores = stores.filter((s) => !s.hidden).length > 1
const homeUrl = import.meta.env.BASE_URL

// 各店品項代號不同，訂單無法跨店帶過去，所以離開前先問一聲
const goHome = (event: MouseEvent) => {
  if (order.totalCount > 0 && !confirm('切換店家會清空目前的訂單，確定要離開嗎？')) {
    event.preventDefault()
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-5 bg-linear-135 from-brand to-brand-to px-4 py-[18px] text-center text-white shadow-[0_2px_10px] shadow-black/15"
  >
    <a
      v-if="hasOtherStores"
      :href="homeUrl"
      class="absolute top-3 right-3 rounded-full border border-white/50 px-3 py-1 text-[13px] font-bold text-white active:opacity-70"
      @click="goHome"
    >
      其他店家
    </a>

    <div class="text-3xl font-black tracking-[2px]">
      <span v-for="(part, i) in logoParts" :key="i" :class="{ 'text-accent': part.accent }">{{
        part.text
      }}</span>
    </div>

    <!-- 有些店家沒提供訂購電話，整行連標題一起省掉 -->
    <div v-if="menu.phones.length" class="mt-1 text-sm opacity-95">
      訂購電話
      <template v-for="(phone, i) in menu.phones" :key="phone.tel">
        <span v-if="i > 0">｜</span>
        <a
          class="border-b border-dashed border-white/70 pb-px font-bold whitespace-nowrap text-white active:opacity-70"
          :href="`tel:${phone.tel}`"
          >{{ phone.label }}</a
        >
      </template>
    </div>
  </header>
</template>
