<script setup lang="ts" name="AppK3Bet">
import type { LotteryBetItem } from '@tg/types'
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox } from '@tg/bccomponents'
import { useCurrency } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import { appEventBus, isFlutterApp, mul, sendMsgToFlutterApp } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useK3Store } from '../../../stores/useK3Store'
import { multiplyArr } from '../../../utils/lotteryMaps'
import { message } from '../../../utils/message'
import { isIFrame, isLogin, postMsgToParent } from '../../../utils/tool'
import AppBetView from './AppBetView.vue'

const props = defineProps<Props>()
const emits = defineEmits(['success'])
const { $$t } = useLocale()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const k3Store = useK3Store()
const { K3BetData, K3BetType, K3BetParams } = storeToRefs(k3Store)

interface Props {
}
const { runAsync: runAsyncBet } = useRequest(params => ApiCpBet(params))

const mounts = [1, 10, 100, 1000]
const currentMultiply = ref(1)
const isCheck = ref(true)
const balance = ref(1)
const color = computed(() => 'green')

const currentTab = inject('currentTab', ref(1001))
const curPeriod = inject('curPeriod', ref(''))

const singleBetAmount = computed(() => mul(currentMultiply.value, balance.value))
const total = computed(() => mul(Number(singleBetAmount.value), (K3BetParams.value?.length || 0)))

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target)
    return

  target.value = target.value.replace(/\D/g, '')
}
function toggle(type: 1 | -1) {
  if (type === 1) {
    currentMultiply.value = currentMultiply.value + 1
    return
  }
  if (currentMultiply.value < 2)
    return
  currentMultiply.value = currentMultiply.value - 1
}
function changeBalance(value: number) {
  balance.value = value
}
async function onBet() {
  if (!isLogin()) {
    if (isFlutterApp()) {
      sendMsgToFlutterApp(SendFlutterAppMessage.APP_LOGIN)
      return
    }
    if (isIFrame()) {
      postMsgToParent('login')
      return
    }
    k3Store.closePop()
    appEventBus.emit(EventBusNames.LOTTERY_TO_MAIN_PAGE_ROUTE, 'login')
    return
  }
  runAsyncBet({
    lottery_id: currentTab.value, // 1001 彩种（win go 30s）
    issue_id: curPeriod.value, // 2025073100001期号
    amount: total.value,
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: K3BetParams.value?.map((item: LotteryBetItem) => {
      const betId = Number(`${currentTab.value}0${item.play_id}`)
      return {
        id: betId,
        play_id: item.play_id, // 玩法(指定号码，可以多选)
        bet_balls: item.balls ? JSON.stringify(item.balls) : '[]', // 投注号码
        odds: item.odds, // 赔率
        times: currentMultiply.value, // 投注倍数
        price: balance.value.toString(), // 单注价格
        amount: singleBetAmount.value, // 单注投注金额
      }
    }),
  }).then(() => {
    emits('success')
    message.info($$t('成功下注'))
  }).catch(() => {
    message.info($$t('下注失败'))
  })
}

function close() {
  k3Store.closePop()
  k3Store.clearBet()
}
</script>

<template>
  <div class="app-k3-bet pb-[36rem] relative text-[#0D2245]   w-full  bg-white rounded-t-[8rem] overflow-hidden">
    <div class="px-[12rem] py-[18rem] grid gap-y-[15rem]">
      <AppBetView :k3-bet-data="K3BetData" :k3-bet-type="K3BetType" :vertical="true" />
      <h1 class="flex">
        <span class="leading-[28rem] mr-auto font-[500] text-[#6D7693]">{{ $$t('金额') }}</span>
        <div class="flex shrink-0 ">
          <div v-for="item of mounts" :key="item" class="px-[8rem] text-[16rem] mr-[6rem] last:mr-0 rounded-[6rem]  leading-[28rem]" :class="balance === item ? `${color}-btn` : 'bg-[#EBEBEB]'" @click="changeBalance(item)">
            {{ item }}
          </div>
        </div>
      </h1>
      <h2 class="flex">
        <span class="leading-[28rem]  mr-auto font-[500] text-[#6D7693]">{{ $$t('倍数') }}</span>
        <div class="flex">
          <span class="leading-[28rem] size-[28rem] bg-[#47ba7c] text-center shrink-0 rounded-[6rem] text-[25rem]" :class="`${color}-btn`" @click="toggle(-1)">-</span>
          <div class="border-[1rem] border-[#EBEBEB] mx-[6rem] px-[11rem] rounded-[6rem]">
            <input type="text" :value="String(currentMultiply)" inputmode="numeric" @input="onInputChange">
          </div>
          <span class="leading-[28rem] size-[28rem] bg-[#47ba7c] text-center shrink-0 rounded-[6rem] text-[25rem]" :class="`${color}-btn`" @click="toggle(1)">+</span>
        </div>
      </h2>
      <h3 class="text-[#0D2245] w-full flex justify-end">
        <div v-for="item of multiplyArr" :key="item" class="px-[8rem] last:mr-0 text-[16rem] rounded-[6rem] mr-[6rem]" :class="currentMultiply === item ? `${color}-btn` : 'bg-[#ebebeb]'" @click="currentMultiply = item">
          <span class="leading-[28rem] text-[16rem]">X{{ item }}</span>
        </div>
      </h3>
      <h4 class="flex items-center h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" /><span class="leading-[28rem] text-[#4D4D4D]">{{ $$t('我同意') }} <span class="text-[#F23038] leading-[28rem] cursor-pointer">《{{ $$t('预售规则') }}》</span></span>
      </h4>
    </div>
    <div class="w-full h-[36rem] flex text-[14rem] font-[500]">
      <div class="w-1/3 text-center leading-[36rem] bg-[#25253C] text-[#6D7693]" @click="close">
        {{ $$t('取消') }}
      </div><div class="flex-1 text-center leading-[36rem] bg-[#47BA7C]" :class="`${color}-btn`" @click="onBet">
        {{ `${$$t('总金额')} ${currentGlobalCurrencyMap.prefix} ${total}` }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-k3-bet {
  .header-bg-green {
    background: linear-gradient(90deg, #3faa70 0, #47ba7c 100%); /* 渐变绿 */
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .header-bg-purple {
    background: var(---, linear-gradient(90deg, #b658fe 0%, #cd74ff 100%));
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .header-bg-red {
    background: var(---, linear-gradient(90deg, #fc5050 0%, #ff646c 100%));
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .header-bg-big {
    background: var(---, linear-gradient(90deg, #ffa82e 0%, #ffc511 100%));
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .header-bg-small {
    background: var(---, linear-gradient(90deg, #6ca6f3 0%, #87bcf5 100%));
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .header-bg-zero {
    background: linear-gradient(to bottom right, #fd565c 50%, #b658fe 0);
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .header-bg-five {
    background: linear-gradient(to bottom right, #40ad72 50%, #eb43dd 0);
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  }
  .green-btn {
    background-color: #47ba7c;
    color: white;
  }
  .red-btn {
    background-color: #ff646c;
    color: white;
  }
  .purple-btn {
    background-color: #cd74ff;
    color: white;
  }
  .big-btn {
    background-color: #ffa82e;
    color: white;
  }
  .small-btn {
    background-color: #6da7f4;
    color: white;
  }
  .zero-btn {
    background-color: #ff646c;
    color: white;
  }
  .five-btn {
    background-color: #47ba7c;
    color: white;
  }
  input {
    text-align: center;
    line-height: 26rem;
    width: 79rem;
    font-size: 15rem;
  }
}
</style>
