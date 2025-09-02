<script lang="ts" setup name="AppBetResultItem">
import type { LotteryBetItem } from '@tg/types'

interface Props {
  data: LotteryBetItem[]
  extra?: LotteryBetItem[] // type2时需要
  title: string
  type: number // type 1 total, 2 特殊处理的2种色组合 ， 3 紫色，4 绿
  vertical?: boolean // vertical false时为历史记录里的 横版样式， true为投注弹窗里的竖版样式
  showTitle?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  showTitle: true,
})

function bg(item: LotteryBetItem) {
  if (props.type === 1) {
    return item.bg ? item.bg : item.even ? '#40AD72' : '#1D864C'
  }
  else if (props.type === 2) {
    return ''
  }
  else if (props.type === 3) {
    return '#B659FE'
  }
  else if (props.type === 4) {
    return '#40AD72'
  }
}
</script>

<template>
  <div
    class="flex" :class="[vertical ? 'flex-col' : 'history']"
  >
    <div v-if="showTitle" class="tt text-[16rem] leading-[22rem] mb-[4rem] font-[500] text-[#6D7693]">
      {{ title }}
    </div>
    <div class="flex gap-[4rem]">
      <div
        v-for="(item, i) in data" :key="i"
        class="center rounded-[4rem] min-w-[32rem]  text-[12rem] leading-[24rem] text-[#fff]"
        :class="{
          'px-[5rem]': type !== 2,
        }"
        :style="{
          background: bg(item),
        }"
      >
        <template v-if="type === 2">
          <span class="rounded-s-[4rem] px-[5rem] bg-[#B659FE]">{{ item.label }}</span>
          <span class="rounded-e-[4rem] px-[5rem] bg-[#40AD72]">{{ extra?.map((item:LotteryBetItem) => item.label).join(',') }}</span>
        </template>
        <span v-else class="">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history {
  gap: 4rem;
  .tt {
    font-size: 14rem;
    line-height: 25rem;
    font-weight: 400;
  }
}
</style>
