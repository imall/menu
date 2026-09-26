<script setup lang="ts">
import ItemCard from './ItemCard.vue'
import type { MenuGroup } from '../types'

defineProps<{ group: MenuGroup }>()
</script>

<template>
  <section>
    <h2 class="mx-1 mt-[18px] mb-2 border-l-[5px] border-ok pl-2 text-lg font-extrabold text-ok">
      {{ group.title }}
      <span v-if="group.note" class="ml-1 text-xs font-normal text-neutral-500">{{
        group.note
      }}</span>
    </h2>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5">
      <ItemCard v-for="item in group.items" :key="item.id" :item="item" :spicy="group.spicy" />
    </div>
  </section>
</template>
