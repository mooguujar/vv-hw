<script setup lang='ts'>
import type { LotteryMyBetRecordItem } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import { IconLotCopy } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { timeTodateFormat2 } from '@tg/vue-i18n'
import { copy } from 'clipboard'
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { message } from '../../../utils/message'

interface Props {
  data: LotteryMyBetRecordItem
}

defineOptions({ name: 'AppFiveDMyHistoryItem' })
const props = defineProps<Props>()

const { $$t } = useLocale()

// 位置
const posArr = [
  {
    pos: 'A',
    ids: [401, 402, 403, 404, 405],
  },
  {
    pos: 'B',
    ids: [406, 407, 408, 409, 410],
  },
  {
    pos: 'C',
    ids: [411, 412, 413, 414, 415],
  },
  {
    pos: 'D',
    ids: [416, 417, 418, 419, 420],
  },
  {
    pos: 'E',
    ids: [421, 422, 423, 424, 425],
  },
  {
    pos: $$t('总和'),
    ids: [426, 427, 428, 429],
  },
]
// 大小单双
const bsoeArr = [
  {
    label: $$t('大'),
    name: 'Big',
    ids: [402, 407, 412, 417, 422, 426],
  },
  {
    label: $$t('小'),
    name: 'Small',
    ids: [403, 408, 413, 418, 423, 427],
  },
  {
    label: $$t('单'),
    name: 'Odd',
    ids: [404, 409, 414, 419, 424, 428],
  },
  {
    label: $$t('双'),
    name: 'Even',
    ids: [405, 410, 415, 420, 425, 429],
  },
]
// 号码
const ballArr = [401, 406, 411, 416, 421]

const { bool: isExpand, toggle } = useBoolean(false)

// 状态
const stateText = computed(() => {
  return props.data.state === 1 ? $$t('成功') : props.data.state === 2 ? $$t('失败') : ''
})
const stateClass = computed(() => {
  return props.data.state === 1 ? 'Succeed' : props.data.state === 2 ? 'Failed' : ''
})
// 结算状态
const statusText = computed(() => {
  return props.data.state === 1 ? $$t('成功') : props.data.state === 2 ? $$t('失败') : $$t('未支付')
})
// 货币符号
const currencyPrefix = computed(() => {
  return getCurrencyConfig(props.data.currency_id)?.prefix
})
// 输赢
const amountText = computed(() => {
  const _state = props.data.state
  if (_state > 0)
    return `${_state === 1 ? '+' : '-'}${currencyPrefix.value}${Math.abs(Number(props.data.settle_amount) - Number(props.data.valid_bet_amount)).toFixed(2)}`
  return '--'
})
// 下注位置
const betPos = computed(() => {
  return posArr.find(a => a.ids.includes(props.data.play_id))?.pos
})
// 下注内容
const betContent = computed(() => {
  const str = bsoeArr.find(a => a.ids.includes(props.data.play_id))?.label
  return str || props.data.bet_balls.replace(/[[\]]/g, '').replace(/,/g, '|')
})
// 下注内容的样式
const betContentClass = computed(() => {
  const str = bsoeArr.find(a => a.ids.includes(props.data.play_id))?.name
  return str || 'Ball'
})
// 是否下注号码
const isBall = computed(() => ballArr.includes(props.data.play_id))
const betSelect = computed(() => {
  if (isBall.value) {
    return betContent.value.split('|')
  }

  return betContent.value.slice(0, 1)
})
const balls = computed(() => JSON.parse(props.data.balls))
function onCopy(value: string) {
  copy(value)
  message.info($$t('已复制'))
}
</script>

<template>
  <div class="font-[400] border-t-[1rem] bg-white border-[#ebebeb] first:border-none">
    <!-- 列 -->
    <div class="py-[13rem] text-[12rem] cursor-pointer center " @click="toggle">
      <div
        class="size-[36rem] mr-[11rem] rounded-[10rem] text-white flex-none leading-[36rem] text-center"
        :class="betContentClass"
      >
        {{ betContent }}
      </div>
      <div class="flex-1 flex flex-col font-[500]">
        <div class="flex mb-[8rem] items-start justify-between">
          <span class="text-[14rem] leading-[17rem]">{{ data.issue_id }}</span>
          <span
            v-if="stateText" :class="stateClass"
            class="w-[82rem] h-[18rem] rounded-[6rem] border-[1rem] text-center"
          >
            {{ stateText }}
          </span>
        </div>
        <div class="flex" style="align-items: end;">
          <span class="mr-auto text-[#888] leading-[17rem]">{{ timeTodateFormat2(data.created_at) }}</span>
          <span v-if="stateText" :class="stateClass" class="text-[14rem] leading-[15.5rem] text-center">
            {{ amountText }}
          </span>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <div v-if="isExpand" class="pt-[12rem] pb-[24rem] grid gap-y-[8rem] text-[#6D7693] leading-[25rem] text-[14rem]">
      <div class="font-[500] text-[20rem] leading-[28rem] text-[#000]">
        {{ $$t('详情') }}
      </div>
      <div class="detail-bg">
        <span>{{ $$t('订单号') }}</span>
        <div class="leading-[25rem] flex">
          <span class="mr-[3.5rem] leading-[25rem]">{{ data.id }}</span><span
            class="text-[#9DABC8] cursor-pointer center text-[18rem]" @click="onCopy(data.id)"
          >
            <IconLotCopy />
          </span>
        </div>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('期号') }}</span>
        <span>{{ data.issue_id }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('购买金额') }}</span>
        <span>{{ currencyPrefix }}{{ data.bet_amount }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('倍数') }}</span>
        <span>{{ data.times }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('税后金额') }}</span>
        <span class="text-[#F2413B]">{{ currencyPrefix }}{{ data.valid_bet_amount }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('税') }}</span>
        <span>{{ currencyPrefix }}{{ data.tax_amount }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('开奖结果') }}</span>
        <div class="flex items-center">
          <span v-if="balls.length === 0">--</span>
          <span
            v-for="num, i in balls" :key="`${num}-${i}`"
            class="w-[18rem] h-[18rem] ml-[3rem] flex items-center justify-center rounded-[50%] border-[1rem] border-solid border-[#000] text-[#000] text-[12rem]"
          >
            {{ num }}
          </span>
        </div>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('选择') }}</span>
        <div class="flex items-center">
          <span class="text-[#6D7693] text-[14rem]">{{ betPos }}</span>
          <template v-if="isBall">
            <span
              v-for="num, i in betSelect" :key="`${num}-${i}`"
              class="w-[18rem] h-[18rem] ml-[3rem] flex items-center justify-center rounded-[50%] border-[1rem] border-solid border-[#000] text-[#000] text-[12rem]"
            >
              {{ num }}
            </span>
          </template>
          <span
            v-else
            class="w-[18rem] h-[18rem] ml-[3rem] flex items-center justify-center rounded-[50%] border-[1rem] border-solid border-[#000] text-[#000] text-[12rem]"
          >
            {{ betSelect }}
          </span>
        </div>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('状态') }}</span>
        <span :class="stateClass">{{ statusText }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('输赢') }}</span>
        <span :class="stateClass">{{ amountText }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('下单时间') }}</span>
        <span>{{ timeTodateFormat2(data.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.detail-bg {
  border-radius: 4rem;
  background: #f9f9f9;
  padding: 0 2rem;
  height: 25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.Succeed {
  border-color: #47ba7c;
  color: #47ba7c;
}

.Failed {
  border-color: #fd565c;
  color: #fd565c;
}

.Big {
  background-color: #ffa82e;
}

.Small {
  background-color: #6da7f4;
}

.Odd {
  background-color: #40ad72;
}

.Even {
  background-color: #fd565c;
}

.Ball {
  background-color: #fd565c;
}
</style>
