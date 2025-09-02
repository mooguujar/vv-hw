<script setup lang='ts'>
import { onMounted } from 'vue'

defineOptions({ name: 'AppGlobalOnMounted' })

onMounted(() => {
  window.updateServerTime()
})
</script>

<template>
  <div />
</template>

<style lang='scss' scoped>

</style>
