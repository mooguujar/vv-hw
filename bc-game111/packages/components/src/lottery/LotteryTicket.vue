<script setup lang="ts" name="LotteryTicket">
interface Props {
  bgImg: string
  height?: string
}
const props = withDefaults(defineProps<Props>(), {
  height: '100rem',
})
</script>

<template>
  <div v-bg-image="bgImg" class="ticket" :style="{ height }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ticket {
  position: relative;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
