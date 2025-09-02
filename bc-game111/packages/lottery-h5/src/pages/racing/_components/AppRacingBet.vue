<script setup lang="ts" name="AppWinGoBet">
import type { VNode } from 'vue'
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox, LotteryColorfulBalls, LotteryDialog } from '@tg/bccomponents'
import { useCurrency } from '@tg/stores'
import { mul } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, h, inject, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppPreSaleRules from '../../../components/AppPreSaleRules.vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useLogin } from '../../../hooks/useLogin'
import { multiplyArr } from '../../../utils/lotteryMaps'
import { message } from '../../../utils/message'
import { isLogin } from '../../../utils/tool'

const props = defineProps<Props>()
const emits = defineEmits(['close', 'success'])
const { $$t } = useLocale()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { login } = useLogin(close)
interface Props {
  // 第几
  level: number
  // 已选中
  choose: Set<number>
  odds: { [key: string]: string }
  // 期号
  period: string

}
const { runAsync: runAsyncBet } = useRequest(params => ApiCpBet(params))

const currentTab = inject('currentTab', ref(2001))
const mounts = [1, 10, 100, 1000]
const isCheck = ref(true)
const balance = ref(1)
const currentMultiply = ref(1)
const isShowRules = ref(false)

const levelText = computed(() => {
  if (props.level === 1)
    return $$t('第一名')
  if (props.level === 2)
    return $$t('第二名')
  if (props.level === 3)
    return $$t('第三名')
})
const price = computed(() => mul(currentMultiply.value, balance.value))
const total = computed(() => {
  return Number(price.value) * Number(props.choose.size)
})

// 如果小于10 就是2level1
const bets = computed(() => {
  const arr = Array.from(props.choose)
  return arr.map((item) => {
    return {
      id: item < 11 ? Number(`${currentTab.value}02${props.level}1`) : Number(`${currentTab.value}0${item}`),
      play_id: item < 11 ? Number(`2${props.level}1`) : item,
      odds: item < 11 ? props.odds[`2${props.level}1`] : props.odds[item],
      bet_balls: item < 11 ? JSON.stringify([item]) : '[]',
      times: currentMultiply.value,
      price: String(balance.value),
      amount: String(price.value),
    }
  })
})

function changeCurrentMultiply(value: number) {
  currentMultiply.value = value
}

function RenderSelected() {
  const isBall = (num: number) => num < 11
  const renderBall = (num: number) => h(LotteryColorfulBalls, { number: num, type: 'race', class: 'size-[34rem]' })
  const otherObj: { [key: string]: VNode } = {
    2: h('div', { class: 'h-[34rem] center mx-[2rem]' }, [h('div', { class: 'h-[30rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#FF9000_0%,#FFD000_100%] text-white rounded-[6rem] px-[7rem] center' }, $$t('大'))]),
    3: h('div', { class: 'h-[34rem] center mx-[2rem]' }, [h('div', { class: 'h-[30rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#00BDFF_0%,#5BCDFF_100%] text-white rounded-[6rem] px-[7rem] center' }, $$t('小'))]),
    4: h('div', { class: 'h-[34rem] center mx-[2rem]' }, [h('div', { class: 'h-[30rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#FD0261_0%,#FF8A96_100%] text-white rounded-[6rem] px-[7rem] center' }, $$t('单'))]),
    5: h('div', { class: 'h-[34rem] center mx-[2rem]' }, [h('div', { class: 'h-[30rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#00BE50_0%,#9BDF00_100%] text-white rounded-[6rem] px-[7rem] center' }, $$t('双'))]),
  }
  const arr = Array.from(props.choose).sort((a, b) => a - b).map((item) => {
    if (isBall(item)) {
      return renderBall(item)
    }
    else {
      const sItem = String(item)
      const tar = sItem[sItem.length - 1]
      return otherObj[tar]
    }
  })
  return h('div', { class: 'flex item-center flex-wrap' }, arr)
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target)
    return

  target.value = target.value.replace(/\D/g, '')
  currentMultiply.value = Number(target.value) || 0
}
function close() {
  emits('close')
}
function toggle(type: 1 | -1) {
  if (type === 1) {
    const val = currentMultiply.value + 1
    currentMultiply.value = val
    return
  }
  if (currentMultiply.value < 2)
    return
  const val = currentMultiply.value - 1
  currentMultiply.value = val
}
function changeBalance(value: number) {
  balance.value = value
}
async function onBet() {
  if (!isLogin()) {
    login()
    return
  }
  if (!isCheck.value) {
    message.info($$t('请勾选我同意预售规则'))
    return
  }
  runAsyncBet({
    lottery_id: currentTab.value,
    issue_id: props.period,
    amount: String(total.value),
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: bets.value,
  }).then(() => {
    emits('success')
    emits('close')
  }).then(() => {
    message.info($$t('成功下注'))
  }).catch(() => {
    message.info($$t('下注失败'))
  })
}
</script>

<template>
  <div class="text-[#0D2245] relative app-win-go-bet w-full bg-white rounded-t-[8rem] overflow-hidden">
    <div class="pt-[13rem] px-[12rem] mb-[15rem]">
      <div class="mr-[14rem] text-[#6D7693]">
        {{ $$t('选择') }}
      </div>
      <div class="flex item-center min-h-[34rem]">
        <div class="text-[#FD565C] mr-[10rem] leading-[34rem] shrink-0 text-[20rem] font-[500]">
          {{ levelText }}
        </div>
        <RenderSelected />
      </div>
    </div>
    <div class="px-[12rem] grid gap-y-[15rem]">
      <h1 class="flex">
        <span class="leading-[28rem] mr-auto font-[500] text-[#6D7693]">{{ $$t('金额') }}</span>
        <div class="flex shrink-0 ">
          <div v-for="item of mounts" :key="item" class="px-[8rem] text-[16rem] mr-[6rem] last:mr-0 rounded-[6rem]  leading-[28rem]" :class="balance === item ? `active-btn` : 'bg-[#EBEBEB]'" @click="changeBalance(item)">
            {{ item }}
          </div>
        </div>
      </h1>
      <h2 class="flex">
        <span class="leading-[28rem]  mr-auto font-[500] text-[#6D7693]">{{ $$t('倍数') }}</span>
        <div class="flex">
          <span class="leading-[28rem] size-[28rem] bg-[#47ba7c] text-center shrink-0 rounded-[6rem] text-[25rem] active-btn" @click="toggle(-1)">-</span>
          <div class="border-[1rem] border-[#EBEBEB] mx-[6rem] px-[11rem] rounded-[6rem]">
            <input type="text" :value="String(currentMultiply)" inputmode="numeric" @input="onInputChange">
          </div>
          <span class="leading-[28rem] size-[28rem] bg-[#47ba7c] text-center shrink-0 rounded-[6rem] text-[25rem] active-btn" @click="toggle(1)">+</span>
        </div>
      </h2>
      <h3 class="text-[#0D2245] w-full flex justify-end">
        <div v-for="item of multiplyArr" :key="item" class="px-[8rem] last:mr-0 text-[16rem] rounded-[6rem] mr-[6rem]" :class="currentMultiply === item ? `active-btn` : 'bg-[#ebebeb]'" @click="changeCurrentMultiply(item)">
          <span class="leading-[28rem] text-[16rem]">X{{ item }}</span>
        </div>
      </h3>
      <h4 class="flex items-center mb-[18rem] h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" /><span class="leading-[28rem] text-[#4D4D4D]">{{ $$t('我同意') }}<span class="text-[#F23038] leading-[28rem] cursor-pointer" @click="isShowRules = true">《{{ $$t('预售规则') }}》</span></span>
      </h4>
    </div>
    <div class="w-full h-[36rem] flex text-[14rem] font-[500]">
      <div class="w-1/3 text-center leading-[36rem] bg-[#25253C] text-[#6D7693]" @click="emits('close')">
        {{ $$t('取消') }}
      </div><div class="flex-1 text-center leading-[36rem] bg-[#47BA7C] active-btn" @click="onBet">
        {{ `${$$t('总金额')} ${currentGlobalCurrencyMap.prefix} ${total}` }}
      </div>
    </div>
    <LotteryDialog v-model="isShowRules" :close-text="$$t('我知道')" :title="$$t('预售规则')" :max-size="[264, 371]">
      <AppPreSaleRules />
    </LotteryDialog>
  </div>
</template>

<style scoped lang="scss">
.active-btn {
  background-color: #47ba7c;
  color: white;
}
input {
  text-align: center;
  line-height: 26rem;
  width: 79rem;
  font-size: 15rem;
}
</style>
