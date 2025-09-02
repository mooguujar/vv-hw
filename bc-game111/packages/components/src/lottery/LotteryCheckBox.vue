<script setup lang="ts" name="LotteryCheckBox">
import { IconLotChecked } from '@tg/icons'

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue'])
function toggle() {
  emits('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="checkbox-icon" :class="{ checked: modelValue }" @click="toggle">
    <IconLotChecked class="text-[12rem] text-white" />
  </div>
</template>

<style scoped>
.checkbox-icon {
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checkbox-icon.checked {
  background-color: #f44336;
}
</style>
