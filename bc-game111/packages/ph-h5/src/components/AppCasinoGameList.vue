<script setup lang='ts'>
import AppCasinoGameItem from '~/components/AppCasinoGameItem.vue'

interface Props {
  list: any[]
  isProvider?: boolean
}

defineOptions({ name: 'AppCasinoGameList' })
defineProps<Props>()
</script>

<template>
  <div class="grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)] grid-cols-3">
    <AppCasinoGameItem v-for="item in list" :key="item.name" :data="item" />
  </div>
</template>

<style lang='scss' scoped>

</style>
