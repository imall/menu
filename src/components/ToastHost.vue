<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { message } = useToast()
</script>

<template>
  <div
    v-if="message"
    class="animate-toast-in fixed bottom-[90px] left-1/2 z-40 -translate-x-1/2 rounded-3xl bg-black/80 px-[22px] py-[11px] text-[15px] font-semibold whitespace-nowrap text-white"
    role="status"
  >
    {{ message }}
  </div>
</template>
