<script lang="ts" setup name="ph-app-slider">
import { IconUniArrowRight } from '@tg/icons'
import { useScroll } from '@vueuse/core'
import { computed, onActivated, ref, watchEffect } from 'vue'
import PhBaseGameItem from '../ph/PhBaseGameItem.vue'

interface Props {
  title?: string
  data: Array<any>
  ty?: number
  cid?: string
  pid?: string
  useCloudImg?: boolean
  path?: string
  showManCount?: boolean
  total?: number
}
const props = withDefaults(defineProps<Props>(), {
})

const gallery = ref()

const { x } = useScroll(gallery, { behavior: 'smooth' }) // , isScrolling, arrivedState, directions

// 判断是否为二维数组
const isTwoDimensional = computed(() => {
  return props.data.length > 0 && Array.isArray(props.data[0])
})

function onTitleClick() {
  if (props.path) {
    console.log(1)
    // i18nNavigateTo(props.path)
  }
}

onActivated(() => {
  gallery.value?.scrollTo({ left: x.value, behavior: 'instant' })
})
watchEffect(() => {
  console.log('x:', x.value)
})
</script>

<template>
  <div class="w-full flex flex-col items-center mb-[16rem]">
    <div class="w-full leading-[32rem] mb-[6rem] flex items-center justify-between">
      <template v-if="$slots.title">
        <slot name="title">
          {{ title }}
        </slot>
      </template>
      <div v-else class="flex items-center border-l-[3rem] border-l-[#F23038] pl-[6rem] text-[14rem] font-bold text-[rgb(41, 49, 64)] leading-[18px]">
        {{ title }}
      </div>
      <div @click="onTitleClick">
        {{ $t('all') }}
        <IconUniArrowRight class="text-sm ml-1" />
      </div>
    </div>
    <div
      v-if="data && data.length > 0" ref="gallery"
      style="--grid-gap: 7rem; --grid-padding: 0; --aspect-ratio: 0.75;"
      class="smooth-scroll smooth-list snap-x relative snap-mandatory  overflow-x-scroll overflow-y-hidden scroll-smooth hide-scroll   "
      :class="isTwoDimensional ? 'flex flex-col gap-1' : 'grid grid-flow-col grid-col-n gap-1'"
    >
      <!-- 一维数组渲染 -->
      <template v-if="!isTwoDimensional">
        <PhBaseGameItem
          v-for="(item, i) in data"
          :key="`item-${i}`"
          :game-info="item"
        />
      </template>

      <!-- 二维数组渲染 -->
      <template v-else>
        <div
          v-for="(row, rowIndex) in data"
          :key="`row-${rowIndex}`"
          class=" grid grid-flow-col grid-col-n gap-1"
        >
          <PhBaseGameItem
            v-for="(item, colIndex) in row"
            :key="`row-${rowIndex}-col-${colIndex}`"
            :game-info="item"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slide-multi {
  --tg-base-icon-color: var(--color-text-white-0);
}

.smooth-list {
  gap: var(--grid-gap);
}

.grid-col-n {
  --grid-gap: 7rem;
  --grid-column: 3;
  --aspect-ratio: 1;
  --grid-side: 2;
  --grid-cols: var(--grid-column);
  --item-width: calc((100% - var(--grid-gap) * (var(--grid-cols) - 1)) / var(--grid-cols));
  grid-template-columns: repeat(auto-fill, var(--item-width));
  grid-auto-columns: var(--item-width);
}
</style>
