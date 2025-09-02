<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { useDownloadStore } from '@tg/stores'
import { useWindowScroll } from '@vueuse/core'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  list: Array<{ name: string, [key: string]: any }> | null
  active: string
  type?: number
}

withDefaults(defineProps<Props>(), {
  type: 1,
})

const emit = defineEmits(['update:active', 'change'])

const { isShowPwaHasC } = storeToRefs(useDownloadStore())
const { y: windowY } = useWindowScroll()

const scrollDwon = ref(false)
// dash计算数据
const parent = ref()
const curTabRef = ref<Array<Element | null>>([])
const dashWidth = ref()
const dashOffset = ref()

function change($event: MouseEvent, item: Record<string, any>, i: number) {
  scrollIntoView($event.target)
  reset()
  emit('change', item.value)
  emit('update:active', item.value)
  if (curTabRef.value && parent.value) {
    const parentRect = parent.value!.getBoundingClientRect()
    const childRect = curTabRef.value[i]!.getBoundingClientRect()
    dashWidth.value = `${childRect.width}px`
    const offsetLeft = childRect.left - parentRect.left + parent.value.scrollLeft
    dashOffset.value = offsetLeft
  }
}

function scrollIntoView(ele: any) {
  if (!ele)
    return
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

let lastScrollTop = 0
let lastScrollDownTop = 0
const SCROLL_UP_THRESHOLD = 20
const SCROLL_DOWN_TRIGGER = 50
// 暂停监听
let ignoreScroll = false

const handleScroll = throttle(() => {
  const current = windowY.value
  if (ignoreScroll)
    return

  if (current > lastScrollTop) {
    // 往下滚
    if (current >= SCROLL_DOWN_TRIGGER) {
      scrollDwon.value = true
    }
    lastScrollDownTop = current
  }
  else if (current < lastScrollTop) {
    // 往上滚
    if ((lastScrollDownTop - current) >= SCROLL_UP_THRESHOLD) {
      scrollDwon.value = false
    }
  }

  lastScrollTop = current
}, 30, {
  leading: true,
  trailing: false,
})

function reset() {
  ignoreScroll = true
  windowY.value = 0
  lastScrollTop = 0
  lastScrollDownTop = 0
  setTimeout(() => {
    ignoreScroll = false
  }, 100) // 冷却期
}

function changeActiveUrl(path: string) {
  return path.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_active.webp`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  if (curTabRef.value && curTabRef.value[0] && parent.value) {
    const parentRect = parent.value!.getBoundingClientRect()
    const childRect = curTabRef.value[0].getBoundingClientRect()
    dashWidth.value = `${childRect.width}px`
    const offsetLeft = childRect.left - parentRect.left + parent.value.scrollLeft
    dashOffset.value = offsetLeft
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- transform: `translate(-50%,${scrollDwon ? '-70rem' : '0'})`,  -->
  <div
    class="wrapper h5-fixed-top px-[10rem] w-full bg-[#f6f7f8] overflow-hidden z-[var(--z-index-dropdown)] text-[12rem] transition-transform duration-400"
    :style="{ top: isShowPwaHasC ? '96rem' : '50rem' }"
  >
    <div class="absolute left-[-10rem] top-[-42rem] w-[var(--pc-max-width)] h-auto  pointer-events-none">
      <BaseImage url="/ph-h5/png/casino-head-bg.png" :is-show-error-img="false" />
    </div>
    <div class="overflow-hidden">
      <div ref="parent" class="overflow-scroll hide-scroll  relative items-center flex">
        <div
          v-for="item, index in list"
          ref="curTabRef" :key="item.name"
          class="relative shrink-0 flex flex-col mr-[13.5rem] h-[66rem] justify-between items-center pt-[4rem] pb-[16rem]  cursor-pointer"
          :style="{ marginRight: list?.length === index + 1 ? '0' : '13.5rem' }"
          @click="change($event, item, index)"
        >
          <!-- <div v-if="active === item.value" v-bg-image="'/casino-game-type-bg'" class="active-bg" /> -->
          <div class="w-[28rem] h-[28rem]">
            <BaseImage is-network :url="changeActiveUrl(item.icon)" />
          </div>
          <span :class="{ 'text-[#F23038]': active === item.value }" class="font-[500] leading-[12rem]">{{ item.name }}</span>
        </div>
        <div class="dash" :style="{ width: dashWidth, transform: `translateX(${dashOffset}px)` }" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// .wrapper {
//   left: 50%;
//   transform: translate(-50%, 0);
// }

.active-bg {
  border-radius: 50%;
  width: 44rem;
  height: 44rem;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.dash {
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 10rem;
  width: 0;
  border-radius: 4px;
  background: #f23038;
  transition: transform 0.2s ease-out;
}
</style>
