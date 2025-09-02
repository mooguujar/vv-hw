<script setup lang="ts" name="LotteryTableTabs">
import { computed } from 'vue'

interface Props {
  tabs: { label: string, value: number }[]
  modelValue: number
  tabSize?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  tabSize: () => ['110rem', '35rem'],
})
const emits = defineEmits(['update:modelValue', 'change'])
function onClick(value: number) {
  emits('update:modelValue', value)
  emits('change', value)
}
const getStyles = computed(() => {
  return {
    width: props.tabSize[0],
    height: props.tabSize[1],
  }
})
</script>

<template>
  <div class="flex justify-between">
    <div v-for="item of tabs" :key="item.value" :style="getStyles" class="rounded-[6rem] center text-[14rem] font-[600]" :class="item.value === modelValue ? 'tab-bg-active' : 'tab-bg'" @click="onClick(item.value)">
      {{ item.label }}
    </div>
  </div>
</template>

<style>
:root {
  --lot-tab-active-text-color: #fff;
  --lot-tab-active-bg-color: linear-gradient(338deg, #f23038 14.55%, #ff7474 85.19%);
  --lot-tab-text-color: #0d2245;
  --lot-tab-bg-color: #ebebeb;
}
</style>

<style scoped lang="scss">
.tab-bg-active {
  background: var(--lot-tab-active-bg-color);
  color: var(--lot-tab-active-text-color);
}
.tab-bg {
  background: var(--lot-tab-bg-color);
  color: var(--lot-tab-text-color);
}
</style>
