<script name="LotteryEmpty" setup lang="ts">
import LotteryImage from './LotteryImage.vue'

interface Props {
  picClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  picClass: 'w-[150.5rem] h-[140rem]',
})
</script>

<template>
  <div class="size-full flex flex-col items-center justify-center">
    <LotteryImage url="/lottery/png/empty.png" :class="picClass" />
    <div>no data</div>
  </div>
</template>
