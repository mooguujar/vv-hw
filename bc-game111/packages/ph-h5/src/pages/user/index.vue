<script setup lang='ts'>
import AppHomeLayout from '~/components/AppHomeLayout.vue'

defineOptions({ name: 'AppUser' })
</script>

<template>
  <AppHomeLayout :show-header="false">
    <router-view />
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
