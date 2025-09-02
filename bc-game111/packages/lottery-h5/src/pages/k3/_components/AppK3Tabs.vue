<script lang="ts" setup name="LotteryKindTabs">
export interface Tabs {
  label: string
  value: any
}
interface Props {
  tabs: Tabs[]
  modelValue: any
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'change'])

function onChange(value: any) {
  emits('change', value)
  emits('update:modelValue', value)
}
</script>

<template>
  <div class="center gap-[1.67rem]">
    <div v-for="item of tabs" :key="item.value" :class="{ active: modelValue === item.value }" class="item center flex-1" @click="onChange(item.value)">
      <span class="">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  border-radius: 5rem 5rem 0 0;
  background: #f6f6f6;
  color: #6d7693;
  font-size: 11rem;
  height: 40rem;
  &.active {
    background: #f23038;
    color: #fff;
  }
}
</style>
