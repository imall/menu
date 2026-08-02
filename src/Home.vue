<script setup lang="ts">
import { parseLogo } from './storeMeta'
import type { StoreMeta } from './types'
import storesJson from '../stores.json'

const stores: StoreMeta[] = storesJson
const visible = stores.filter((s) => !s.hidden)
const base = import.meta.env.BASE_URL
</script>

<template>
  <main class="mx-auto max-w-[760px] px-4 py-10">
    <h1 class="text-center text-2xl font-black tracking-wide">線上點餐</h1>
    <p class="mt-2 mb-8 text-center text-sm text-neutral-500">選擇店家開始點餐</p>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      <!--
        每張卡片自己覆寫 --brand 等變數，卡片內的 bg-brand / text-accent
        就會跟著該店的主題色走，不需要任何額外的 class。
      -->
      <a
        v-for="store in visible"
        :key="store.slug"
        :href="`${base}${store.slug}/`"
        :style="{
          '--brand': store.theme.brand,
          '--brand-to': store.theme.brandTo,
          '--accent': store.theme.accent,
        }"
        class="block overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_1px_3px] shadow-black/5 transition active:scale-[.98] hover:shadow-[0_4px_14px] hover:shadow-black/10"
      >
        <div class="bg-linear-135 from-brand to-brand-to px-4 py-6 text-center text-white">
          <div class="text-2xl font-black tracking-[1px]">
            <span v-for="(part, i) in parseLogo(store.logo)" :key="i" :class="{ 'text-accent': part.accent }">{{
              part.text
            }}</span>
          </div>
        </div>
        <div class="px-4 py-3 text-center text-sm text-neutral-600">
          {{ store.tagline ?? '立即點餐' }}
        </div>
      </a>
    </div>

    <p v-if="visible.length === 0" class="py-16 text-center text-neutral-400">目前沒有開放的店家</p>
  </main>
</template>
