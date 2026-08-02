<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StoreHeader from './components/StoreHeader.vue'
import MenuGroup from './components/MenuGroup.vue'
import OrderBar from './components/OrderBar.vue'
import OrderModal from './components/OrderModal.vue'
import ToastHost from './components/ToastHost.vue'
import { useOrderStore } from './stores/order'
import { useStoreMenu } from './storeMenu'
import { useToast } from './composables/useToast'

const menu = useStoreMenu()
const order = useOrderStore()
const { show } = useToast()

const showModal = ref(false)

onMounted(() => {
  if (order.restoredFromLink) show('已載入分享的訂單')
})
</script>

<template>
  <StoreHeader />

  <main class="mx-auto max-w-[760px] px-3 pt-3 pb-[120px]">
    <MenuGroup v-for="group in menu.groups" :key="group.title" :group="group" />
  </main>

  <OrderBar @open="showModal = true" />
  <OrderModal v-if="showModal" @close="showModal = false" />
  <ToastHost />
</template>
