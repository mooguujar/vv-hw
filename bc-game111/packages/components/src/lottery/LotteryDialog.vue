<script setup lang="ts" name="LotteryDialog">
import { computed, h, useSlots, watch } from 'vue'
import LotteryButton from './LotteryButton.vue'

interface Props {
  title?: string
  modelValue: boolean
  showHeader?: boolean
  zIndex?: number
  maxSize?: string[] | number[]
  maskClose?: boolean
  closeText?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  showHeader: true,
  maskClose: true,
  zIndex: 200,
})
const emit = defineEmits(['update:modelValue', 'close'])
const slots = useSlots()

const _title = computed(() => props.title ? props.title : 'title')
const _close = computed(() => props.closeText ? props.closeText : 'closeText')
const getIndex = computed(() => props.zIndex)
const showFooter = computed(() => props.showHeader)
const dialogStyles = computed(() => {
  const _width = !props.maxSize || !props.maxSize[0]
    ? '90%'
    : typeof props.maxSize[0] === 'number'
      ? `${props.maxSize[0]}rem`
      : String(props.maxSize[0])

  const _height = !props.maxSize || !props.maxSize[1]
    ? '80%'
    : typeof props.maxSize[1] === 'number'
      ? `${props.maxSize[1]}rem`
      : String(props.maxSize[1])

  return {
    '--lot-dialog-container-max-width': _width,
    '--lot-dialog-container-max-height': _height,
  }
})

function setClassName(name: string) {
  return `lot-dialog-${name}`
}

function renderHeader() {
  if (!props.showHeader) {
    return null
  }
  const headerVNode = slots.title?.()
  if (headerVNode) {
    return headerVNode
  }
  const header = [h('div', { class: 'text-center text-[15rem] font-[600] text-white leading-[54rem]  bg-[#F23038]' }, _title.value)]
  return header
}

function renderFooter() {
  if (!showFooter.value) {
    return null
  }
  return h('div', { class: 'center pt-[12rem] pb-[16rem]' }, [h(LotteryButton, { onClick: close, class: 'w-[158rem] h-[35rem]', style: { '--lot-base-btn-border-radius': '20rem', '--lot-base-btn-default-bg-color': '#F23038', '--lot-base-btn-default-color': '#fff' } }, _close.value)])
}

function close() {
  emit('close')
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <teleport to="body">
    <Transition name="lot-dialog">
      <div
        v-show="modelValue" :class="[setClassName('wrapper')]" :style="{ '--lot-dialog-wrapper-z-index': getIndex }"
        v-bind="$attrs"
        @click="maskClose && close()"
      >
        <div :class="setClassName('container')" :style="dialogStyles" @click.stop>
          <renderHeader />
          <slot />
          <renderFooter />
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style>
:root {
  --lot-dialog-container-min-width: 264rem;
  --lot-dialog-container-min-height: 160rem;
  --lot-dialog-container-bg: #fff;
  --lot-dialog-container-radius: 8rem;
  --lot-dialog-container-padding: 0 0;
  --lot-dialog-wrapper-z-index: 102;
}
</style>

<style scoped lang="scss">
.lot-dialog-enter-active,
.lot-dialog-leave-active {
  transition: all 0.2s ease;
}
.lot-dialog-enter-from,
.lot-dialog-leave-to {
  opacity: 0;
}

.lot-dialog-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(16, 18, 18, 0.8);
  width: 100%;
  height: 100%;
  max-width: var(--pc-max-width);
  position: fixed;
  z-index: 200;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);

  .lot-dialog-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: var(--lot-dialog-container-min-width);
    min-height: var(--lot-dialog-container-min-height);
    max-width: var(--lot-dialog-container-max-width);
    max-height: var(--lot-dialog-container-max-height);
    background-color: var(--lot-dialog-container-bg);
    border-radius: var(--lot-dialog-container-radius);
    padding: var(--lot-dialog-container-padding);
  }
}
</style>
