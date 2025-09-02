<script lang="ts" setup name="AppBetBtnList">
import type { LotteryBetItem } from '@tg/types'
import { IconUniRecordConfirm } from '@tg/icons'

interface Props {
  data: LotteryBetItem[]
  bettedArr: LotteryBetItem[]
  type: number // type 1  紫色，2 红色，3 绿色
}
const props = defineProps<Props>()
const emit = defineEmits(['toggle'])

const classes = ['bet-btn-purple', 'bet-btn-red', 'bet-btn-green']
const currentClass = classes[props.type - 1]
</script>

<template>
  <div class="flex  gap-[10.6rem]">
    <div
      v-for="(item, i) in data" :key="item.label"
      class="bet-btn-purple relative flex-1 h-[35rem] center rounded-[5rem] text-[14rem] text-white"
      :class="[currentClass, {
        active: bettedArr.find(bet => bet.label === item.label),
      }]"
      @click="$emit('toggle', item)"
    >
      <span class="">
        {{ item.label }}
      </span>
      <div v-if="bettedArr.find(bet => bet.label === item.label)" class="absolute right-0 bottom-0 text-[15rem] flex">
        <IconUniRecordConfirm class="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bet-btn-purple {
  background: rgba(182, 89, 254, 0.5);
  &.active {
    background: rgba(182, 89, 254, 1);
  }
}
.bet-btn-red {
  background: rgba(242, 48, 56, 0.5);
  &.active {
    background: rgba(242, 48, 56, 1);
  }
}
.bet-btn-green {
  background: rgba(64, 173, 114, 0.5);
  &.active {
    background: rgba(64, 173, 114, 1);
  }
}
</style>
