<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  total?: number
  percentage?: number
  isSports?: boolean
}
defineOptions({
  name: 'SSAppPercentage',
})
const props = withDefaults(defineProps<Props>(), {
  total: 0,
  percentage: 0,
})

const { t } = useI18n()

const componentPercent = computed<number>(() => {
  return Number(((props.percentage / props.total) * 100).toFixed(2))
})
</script>

<template>
  <div class="w-full flex flex-col  items-center">
    <div class="w-[180rem] my-[11rem] h-[2rem] bg-[#b1bad3] overflow-hidden">
      <div class="h-full bg-[#1475e1]" :style="{ width: `${componentPercent}%` }" />
    </div>
    <span class="text-[14rem] text-[#b1bad3] leading-[20rem]">
      {{ t('正显示赛事比例', { total: props.total, percentage: props.percentage }) }}
    </span>
  </div>
</template>

<style lang='scss' scoped>
</style>
