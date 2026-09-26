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

// header 是 sticky，捲動時要扣掉它的高度，分類標題才不會被蓋住
const jumpTo = (i: number, event: MouseEvent) => {
  const el = document.getElementById(`group-${i}`)
  const header = (event.currentTarget as HTMLElement).closest('header')
  if (!el || !header) return
  const top = el.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8
  window.scrollTo({ top, behavior: 'smooth' })
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
    <div v-if="menu.phones?.length" class="mt-1 text-sm opacity-95">
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

    <nav
      v-if="menu.groups.length > 1"
      class="-mx-4 -mb-[18px] mt-3 flex gap-2 overflow-x-auto bg-black/10 px-4 py-2 whitespace-nowrap [scrollbar-width:none]"
    >
      <button
        v-for="(group, i) in menu.groups"
        :key="group.title"
        type="button"
        class="shrink-0 rounded-full bg-white/20 px-3 py-1 text-[13px] font-bold text-white active:bg-white/40"
        @click="jumpTo(i, $event)"
      >
        {{ group.title }}
      </button>
    </nav>
  </header>
</template>
