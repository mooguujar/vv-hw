<script setup lang='ts'>
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  list: {
    label: string
    value: string | number
  }[]
}
defineOptions({ name: 'AppFiveDOptionTabs' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])
const _list = computed(() => props.list.map((a) => {
  return {
    ...a,
    active: a.value === props.modelValue,
  }
}))

function onClick(v: string | number) {
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <div class="wrap">
    <div
      v-for="item, i in _list" :key="item.value" class="tab" :class="{ active: item.active, last: i === _list.length - 1 }"
      @click="onClick(item.value)"
    >
      <div class="label">
        {{ item.label }}
      </div>
      <div class="dot" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.wrap {
  display: flex;
  border-bottom: 1px solid #c7c7cc;
}
.tab {
  display: flex;
  align-items: end;

  .label {
    width: 40rem;
    height: 40rem;
    border-radius: 19px 19px 0 0;
    background: #ceced8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18rem;
    font-weight: 600;
    color: #fff;
  }

  .dot {
    width: 10rem;
    height: 10rem;
    background: #ceced8;
  }

  &.last {
    .label {
      font-size: 16rem;
    }
  }
  &.active {
    .label {
      background: #f23038;
    }
    .dot {
      background: #f23038;
    }
  }
}
</style>
