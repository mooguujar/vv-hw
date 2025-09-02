<script setup lang="ts">
import type { LotteryWinLoseSettleData } from '@tg/types'
import { ApiCpNav, ApiCpOdds, ApiCpTrend } from '@tg/apis'
import { LotteryButton, LotteryColorfulBalls, LotteryCountDown, LotteryCountDownMask, LotteryDialog, LotteryKindTabs, LotteryLoading, LotteryPopup, LotteryTableTabs, LotteryTicket } from '@tg/bccomponents'
import { IconLotTicket } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import {
  appEventBus,
} from '@tg/utils'
import { computed, defineAsyncComponent, onActivated, provide, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import AppUserBalance from '../../components/AppUserBalance.vue'
import AppWinLoseSettle from '../../components/AppWinLoseSettle.vue'
import { useLocale } from '../../components/LotteryConfigProvider'
import { useWinGoStore } from '../../stores/useWinGoStore'
import { colorHelp, multiplyArr, winGoKindId } from '../../utils/lotteryMaps'
import { calcTime, isLogin as getLogin } from '../../utils/tool'
import AppWinGoBet from './_components/AppWinGoBet.vue'
import AppWinGoGameRules from './_components/AppWinGoGameRules.vue'
import AppWinGoResAnimal from './_components/AppWinGoResAnimal.vue'

const { $$t } = useLocale()
const isLogin = getLogin()
const winGoStore = useWinGoStore()
const currencyStore = useCurrency()

type AsyncComp = ReturnType<typeof defineAsyncComponent>
const compMap: Map<number, AsyncComp> = new Map<number, AsyncComp>([
  [1, defineAsyncComponent(() => import('../../pages/win-go/_components/AppWinGoGameHistory.vue'))],
  [2, defineAsyncComponent(() => import('../../pages/win-go/_components/AppWinGoGameChart.vue'))],
  [3, defineAsyncComponent(() => import('../../pages/win-go/_components/AppWinGoMyHistory.vue'))],
])

const btnArr = [{
  label: $$t('游戏记录'),
  value: 1,
}, {
  label: $$t('走势图'),
  value: 2,
}, {
  label: $$t('我的记录'),
  value: 3,
}]

const lotteryResultArr = ref<number[]>([])

const tabArr = ref<any[]>([])
// tab
const currentTab = ref(1001)
const time = ref(0)
const randomId = ref<number>(1)
const currentMultiply = ref(1)
const currentBtn = ref(1)
const isModal = ref(false)
const isPop = ref(false)
const clickTarget = ref({ color: '', text: '' })
const animatingIndexes = ref<number[]>([])
const isShowMask = ref(false)
const timeMask = ref(0)
const betPlayId = ref<number>()
const betOdd = ref<string>('')
const curComponentRef = ref<any>(null)
const isShowAnimal = ref(false)
const isShowWinLose = ref(false)
const winLoseData = ref<LotteryWinLoseSettleData>({
  flag: 'Win',
  lottery_name: '',
  issue_id: '',
  settle_amount: '',
  balls: '',
  currency_id: '701',
})

let animationTimer: NodeJS.Timeout | null = null
let clearAllTimer: NodeJS.Timeout | null = null
const { runAsync: runAsyncCpOdds, data } = useRequest(() => ApiCpOdds({ lottery_id: currentTab.value }), {
  onSuccess: (res) => {
    const issue = res?.issue
    if (issue) {
      const t = calcTime(issue.end_time)
      randomId.value = Date.now()
      time.value = t
      timeMask.value = t > 5 ? 0 : t
    }
  },
})
const { runAsync: runAsyncCpNav } = useRequest(() => ApiCpNav({ lottery_id: 1002 }))

const { runAsync: runAsyncLotteryRes } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: 1 }), {
})

provide('currentTab', currentTab)

const currentKind = computed(() => tabArr.value.filter(item => item.value === currentTab.value)[0]?.label)
const odds = computed<{ [key: number]: string }>(() => {
  let obj = {}
  if (data.value) {
    obj = data.value.odds.reduce((pre, item) => {
      pre[item.play_id] = item.odds
      return pre
    }, {} as { [key: number]: string })
  }
  return obj
})

const curPeriod = computed(() => data.value?.issue.id || '0')
const curComponent = computed(() => compMap.get(currentBtn.value))

// function dealArr(arr: number[]) {
//   return arr.map((item, index) => ({ value: item, visible: true }))
// }
async function getLotteryRes() {
  return runAsyncLotteryRes().then((res) => {
    const list = res?.d?.list || []
    const five = list.slice(0, 5).map(item => Number(item.result))
    lotteryResultArr.value = five
  })
}

async function changeTab(value: number) {
  if (currentTab.value === value)
    return
  isShowMask.value = false
  currentTab.value = value
  if (curComponentRef.value)
    curComponentRef.value.refresh()
  await runAsyncCpOdds()
}
function changeMultiply(value: number) {
  if (currentMultiply.value === value)
    return
  currentMultiply.value = value
}
// 三种类型，1 颜色 ， 2 小球 ， 3 大小
function openBet(kind: 1 | 2 | 3, text: string, targetOdd: string) {
  const color = getClickColor(kind, text)
  betPlayId.value = kind === 2 ? winGoKindId.Balls : winGoKindId[text]
  betOdd.value = targetOdd
  clickTarget.value.color = color
  clickTarget.value.text = text
  isPop.value = true
}
function getClickColor(type: 1 | 2 | 3, value: string) {
  if (type === 2 && value !== '0' && value !== '5') {
    return Number(value) % 2 === 0 ? 'red' : 'green'
  }
  return colorHelp[type][value] || ''
}
function randomOpenBet() {
  startRandomAnimation().then(() => {
    openBet(2, String(Math.floor(Math.random() * 10)), odds.value[winGoKindId.Balls])
  })
}
function timeToShowMask(val: number) {
  if (isPop.value) {
    isPop.value = false
  }
  timeMask.value = val
}

function startRandomAnimation(): Promise<void> {
  return new Promise((resolve) => {
    if (animationTimer)
      clearInterval(animationTimer)
    if (clearAllTimer)
      clearTimeout(clearAllTimer)

    animationTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 10)

      if (!animatingIndexes.value.includes(randomIndex)) {
        animatingIndexes.value.push(randomIndex)

        setTimeout(() => {
          animatingIndexes.value = animatingIndexes.value.filter(i => i !== randomIndex)
        }, 300)
      }
    }, 150)

    clearAllTimer = setTimeout(() => {
      if (animationTimer)
        clearInterval(animationTimer)
      animatingIndexes.value = []
      resolve()
    }, 2000)
  })
}
function onBetSuccess() {
  isPop.value = false
  if (curComponentRef.value && currentBtn.value === 3) {
    curComponentRef.value.refresh()
  }
}
function onBetClose() {
  isPop.value = false
  currentMultiply.value = 1
}
async function init() {
  if (isLogin) {
    await currencyStore.initCurrencyList()
  }

  const res = await runAsyncCpNav()
  const nav = res.map((item) => {
    return {
      label: item.lottery_name,
      value: item.lottery_id,
    }
  })

  tabArr.value = nav
  currentTab.value = tabArr.value[0].value
  winGoStore.setWinGoTabArr(nav)

  await runAsyncCpOdds()
}

async function dealMqtt(value: any) {
  const { payload, topic } = value.message.parsed
  if (payload.startsWith('start') && topic.endsWith(currentTab.value)) {
    isShowMask.value = false
    runAsyncCpOdds()
  }
  if (payload.startsWith('end') && topic.endsWith(currentTab.value)) {
    isShowMask.value = true
  }
  if (payload.startsWith('settle') && topic.endsWith(currentTab.value)) {
    // 调用game history接口拿结果数据
    await getLotteryRes()
    isShowAnimal.value = true
    if (curComponentRef.value) {
      curComponentRef.value.refresh()
    }
  }
}

function dealWinLose(values: any) {
  if (Number(values.type) !== 1)
    return
  if (isShowWinLose.value)
    return
  winLoseData.value = values
  isShowWinLose.value = true
}
function reloadWinGo() {
  runAsyncCpOdds()
  getLotteryRes()
  if (curComponentRef.value)
    curComponentRef.value.refresh()
}
function settleClassName(value: string) {
  // 1算奇偶，2算大小
  const numVal = Number(value)
  if (numVal === 0)
    return 'zero'
  if (numVal === 5)
    return 'five'
  return numVal % 2 === 0 ? 'red' : 'green'
}
function settleColorName(value: string) {
  const numVal = Number(value)
  if (numVal === 0)
    return `${$$t('红色')}|${$$t('紫色')}`
  if (numVal === 5)
    return `${$$t('绿色')}|${$$t('紫色')}`
  return numVal % 2 === 0 ? $$t('红色') : $$t('绿色')
}
onActivated(() => {
  console.log('🚀 ~ onActivated:')
  reloadWinGo()
})
appEventBus.on(EventBusNames.LOTTERY_WIN_GO, (msg) => {
  dealMqtt(msg)
})
appEventBus.on(EventBusNames.LOTTERY_SETTLE_DIALOG, (msg) => {
  dealWinLose(msg)
})

appEventBus.on(EventBusNames.APP_GLOBAL_VISIBILITY, () => {
  reloadWinGo()
})

watch(currentTab, (newVal) => {
  getLotteryRes()
}, { immediate: true })

await init()
</script>

<template>
  <div class="px-[13rem] pt-[16rem] grid gap-[16rem] pb-[58rem]">
    <AppUserBalance />
    <LotteryKindTabs v-model="currentTab" :tabs="tabArr" @change="changeTab" />
    <LotteryTicket bg-img="/lottery/png/ticket-red.png" class="flex">
      <div class="w-1/2 p-[10rem] text-white">
        <div class="border-1 text-[18rem] border-[#fff] rounded-[30rem] center w-[150rem] h-[23rem] text-white" @click="isModal = true">
          <IconLotTicket /><span class="ml-[2rem] text-[12rem]">{{ $$t('玩法说明') }}</span>
        </div>
        <div class="my-[7rem] pl-[8rem] h-[17rem]">
          {{ currentKind }}
        </div>
        <div class="grid grid-cols-5 gap-x-[6rem] overflow-hidden h-[25rem]">
          <!-- 数组长度一直是5，用index当key，组件都是重新复用，只onMounted一次,动画会因为v-show重新执行 ，数据会因为.value重新复制发生变化，target传不传都一样了 -->
          <template v-for="item, index in lotteryResultArr" :key="index">
            <div v-if="index === 0">
              <LotteryColorfulBalls v-show="!isShowAnimal" :number="item" class="w-[25rem]" />
              <AppWinGoResAnimal v-show="isShowAnimal" :target="item" @end="isShowAnimal = false" />
            </div>
            <div v-else>
              <LotteryColorfulBalls :number="item" class="w-[25rem] " />
            </div>
          </template>
        </div>
      </div>
      <div class="w-1/2 p-[10rem] text-white">
        <div class="text-right text-[12rem]">
          {{ $$t('倒计时') }}
        </div>
        <LotteryCountDown :key="randomId" class="my-[8rem] justify-end" :time="time" @on-time="timeToShowMask" />
        <div class="text-right font-[700] text-[16rem]">
          {{ curPeriod }}
        </div>
      </div>
    </LotteryTicket>
    <div class="p-[8rem] grid gap-y-[13rem] bg-[#EAEAEA] rounded-[8rem] relative">
      <div class="flex justify-around text-white font-[500]">
        <div class="w-[100rem] h-[35rem] px-[10rem] rounded-tr-[10rem] cursor-pointer rounded-bl-[10rem] bg-[#40AD72] flex items-center" style="box-shadow: 0 2rem 6rem 0 #BAE6B0;" @click="openBet(1, 'Green', odds?.[winGoKindId.Green])">
          <span class="mr-auto">{{ $$t('绿色') }}</span><span>{{ odds?.[winGoKindId.Green] }}X</span>
        </div>
        <div class="w-[100rem] flex items-center px-[10rem] h-[35rem] cursor-pointer rounded-[10rem] bg-[#B659FE]" style="box-shadow: 0 2rem 6rem 0 #B659FE;" @click="openBet(1, 'Purple', odds?.[winGoKindId.Purple])">
          <span class="mr-auto">{{ $$t('紫色') }}</span><span>{{ odds?.[winGoKindId.Purple] }}X</span>
        </div>
        <div class="w-[100rem] px-[10rem] flex items-center h-[35rem] cursor-pointer rounded-tl-[10rem] rounded-br-[10rem] bg-[#FD565C]" style="box-shadow: 0px 2rem 6rem 0 #FD565C;" @click="openBet(1, 'Red', odds?.[winGoKindId.Red])">
          <span class="mr-auto">{{ $$t('红色') }}</span><span>{{ odds?.[winGoKindId.Red] }}X</span>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-x-[18rem] gap-y-[8.5rem] text-[#6D7693] text-[12px] bg-[#F2F2F2] rounded-[10rem] py-[14rem] px-[10rem]">
        <div v-for="_, index of 10" :key="index" class="flex flex-col items-center cursor-pointer" @click="openBet(2, String(index), odds?.[winGoKindId.Balls])">
          <LotteryColorfulBalls
            :number="index" class="size-[44rem]" :class="[
              animatingIndexes.includes(index) ? 'animate-balls-scale' : '',
            ]"
          />
          <div>{{ odds?.[winGoKindId.Balls] }}X</div>
        </div>
      </div>
      <div class="flex ">
        <LotteryButton class="border-1 mr-[5rem] w-[80rem] h-[30rem] border-[#1D864C]" style="--lot-base-btn-default-color: #1D864C" @click="randomOpenBet">
          {{ $$t('随机') }}
        </LotteryButton>
        <div
          v-for="item of multiplyArr" :key="item"
          class="min-w-[37rem] shrink-0 h-[30rem] mr-[5rem] text-[#0D2245] last:mr-0 rounded-[8rem] cursor-pointer center text-[12rem] font-[500]"
          :class="[currentMultiply === item ? 'bg-[#F23038] text-white' : 'bg-[#fff]']"
          @click="changeMultiply(item)"
        >
          X{{ item }}
        </div>
      </div>
      <div class="process px-[12rem] h-[36rem] flex text-white text-[16rem]">
        <div class="w-1/2 bg-[#FFA82E] rounded-l-[20rem] flex items-center px-[10rem]" @click="openBet(3, 'Big', odds?.[winGoKindId.Big])">
          <span class="mr-auto">{{ $$t('大') }}</span>
          <span>{{ odds?.[winGoKindId.Big] }}X</span>
        </div>
        <div class="w-1/2 bg-[#6DA7F4] rounded-r-[20rem] flex items-center px-[10rem]" @click="openBet(3, 'Small', odds?.[winGoKindId.Small])">
          <span class="mr-auto">{{ $$t('小') }}</span>
          <span>{{ odds?.[winGoKindId.Small] }}X</span>
        </div>
      </div>
      <LotteryCountDownMask v-if="timeMask > 0 || isShowMask" :time="timeMask" />
    </div>

    <LotteryTableTabs v-model="currentBtn" :tabs="btnArr" />
    <Suspense timeout="0">
      <component :is="curComponent" ref="curComponentRef" />
      <template #fallback>
        <div class="flex items-center justify-center min-h-[200rem]">
          <LotteryLoading />
        </div>
      </template>
    </Suspense>
  </div>

  <LotteryDialog v-model="isModal" :title="$$t('玩法说明')" :max-size="[264, 371]" :close-text="$$t('关闭')">
    <AppWinGoGameRules />
  </LotteryDialog>
  <LotteryPopup v-model="isPop" :has-wrapper="true">
    <AppWinGoBet v-if="isPop" v-model:current-multiply="currentMultiply" :period="curPeriod" :bet-odd="betOdd" :bet-play-id="(betPlayId as number)" :cur-period="curPeriod" :target="clickTarget" :current-tab="currentTab" @close="onBetClose" @success="onBetSuccess" />
  </LotteryPopup>
  <LotteryDialog v-model="isShowWinLose" :show-header="false" style="--lot-dialog-container-bg: transparent" :mask-close="false">
    <AppWinLoseSettle v-if="isShowWinLose" :type="winLoseData.flag" :amount="winLoseData.settle_amount" :period="winLoseData.issue_id" :name="winLoseData.lottery_name" :currency-id="winLoseData.currency_id" @close="isShowWinLose = false">
      <div class="text-[11rem] flex font-[500]">
        <div class="mr-[5rem] text-white leading-[22rem]">
          {{ $$t('彩票结果') }}
        </div>
        <div :class="settleClassName(winLoseData.balls)" class="px-[12rem] leading-[22rem] mr-[5rem] rounded-[5rem]">
          {{ settleColorName(winLoseData.balls) }}
        </div>
        <div class="mr-[5rem] size-[22rem] leading-[22rem] text-center rounded-[100rem]" :class="settleClassName(winLoseData.balls)">
          {{ winLoseData.balls }}
        </div>
        <div :class="settleClassName(winLoseData.balls)" class="px-[12rem] leading-[22rem] rounded-[5rem]">
          {{ Number(winLoseData.balls) > 4 ? $$t('大') : $$t('小') }}
        </div>
      </div>
    </AppWinLoseSettle>
  </LotteryDialog>
</template>

<style scoped lang="scss">
@keyframes balls-scale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.85);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-balls-scale {
  animation: balls-scale 0.3s ease-in-out infinite;
}
.zero {
  background: linear-gradient(to bottom right, #fb4e4e 50%, #eb43dd 50%);
  color: #fff;
  border: none;
}
.five {
  background: linear-gradient(to bottom right, #5cba47 50%, #eb43dd 0);
  color: #fff;
  border: none;
}
.red {
  background: #fb4e4e;
  color: #fff;
  border: none;
}
.green {
  background: #5cba47;
  color: #fff;
  border: none;
}
</style>
