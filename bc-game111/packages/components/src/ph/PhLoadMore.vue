<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  loading: boolean
  finished: boolean
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
})

const emits = defineEmits(['load'])

const containerRef = ref()
const container = ref(document.body)

function handleLoad() {
  if (!props.loading && !props.finished) {
    emits('load')
  }
}

function onScroll() {
  if (!props.autoLoad || props.loading || props.finished)
    return
  // const el = document.body
  // if (!el)
  //   return

  // const scrollBottom
  //   = el.scrollHeight - el.scrollTop - el.clientHeight

  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = document.documentElement.scrollHeight

  const scrollBottom
    = scrollHeight - clientHeight - scrollTop

  // console.log(scrollTop,clientHeight ,scrollHeight,scrollBottom);

  if (scrollBottom < 10) {
    handleLoad()
  }
}

onMounted(() => {
  if (props.autoLoad && container.value) {
    window.addEventListener('scroll', onScroll)
  }
})

onBeforeUnmount(() => {
  if (container.value) {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div ref="containerRef" class="load-more-wrapper">
    <slot />
  </div>
</template>

<style scoped>

</style>
