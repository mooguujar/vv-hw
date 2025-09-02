<script setup lang="ts" name="AppWinGoBet">
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox, LotteryDialog } from '@tg/bccomponents'
import { useCurrency } from '@tg/stores'
import { mul } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppPreSaleRules from '../../../components/AppPreSaleRules.vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useLogin } from '../../../hooks/useLogin'
import { useWinGoStore } from '../../../stores/useWinGoStore'
import { multiplyArr } from '../../../utils/lotteryMaps'
import { message } from '../../../utils/message'
import { isLogin } from '../../../utils/tool'

const props = defineProps<Props>()
const emits = defineEmits(['update:currentMultiply', 'close', 'success'])
const { $$t } = useLocale()
const { winGoTabArr } = storeToRefs(useWinGoStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { login } = useLogin(close)

interface Props {
  target: { color: string, text: string }
  // 当前倍数
  currentMultiply: number
  // 当前彩种
  currentTab: number
  // playId
  betPlayId: number
  // 当前赔率
  betOdd: string
  period: string
}
const textMap: { [key: string]: string } = {
  Red: $$t('红色'),
  Green: $$t('绿色'),
  Big: $$t('大'),
  Small: $$t('小'),
}
const { runAsync: runAsyncBet } = useRequest(params => ApiCpBet(params))

const mounts = [1, 10, 100, 1000]
const isCheck = ref(true)
const balance = ref(1)
const color = computed(() => props.target.color)
const text = computed(() => props.target.text === 'Purple' ? $$t('紫色') : Number(props.target.text) >= 0 ? props.target.text : textMap[props.target.text])
const isShowRules = ref(false)

const total = computed(() => mul(props.currentMultiply, balance.value))
const currentKind = computed(() => winGoTabArr.value.filter(item => item.value === props.currentTab)[0]?.label)
const betId = computed(() => Number(`${props.currentTab}0${[props.betPlayId]}`))
function changeCurrentMultiply(value: number) {
  emits('update:currentMultiply', value)
}
function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target)
    return

  target.value = target.value.replace(/\D/g, '')
  emits('update:currentMultiply', Number(target.value) || 0)
}
function close() {
  emits('close')
}
function toggle(type: 1 | -1) {
  if (type === 1) {
    const val = props.currentMultiply + 1
    emits('update:currentMultiply', val)
    return
  }
  if (props.currentMultiply < 2)
    return
  const val = props.currentMultiply - 1
  emits('update:currentMultiply', val)
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
  const play_id = props.betPlayId
  runAsyncBet({
    lottery_id: props.currentTab,
    issue_id: props.period,
    amount: String(total.value),
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: [
      {
        id: betId.value,
        play_id,
        bet_balls: play_id === 101 ? JSON.stringify([Number(props.target.text)]) : '[]',
        odds: props.betOdd,
        times: props.currentMultiply,
        price: String(balance.value),
        amount: String(total.value),
      },
    ],
  }).then(() => {
    emits('success')
  }).then(() => {
    message.info($$t('成功下注'))
  }).catch(() => {
    message.info($$t('下注失败'))
  })
}
</script>

<template>
  <div class="text-[#0D2245] relative app-win-go-bet w-full bg-white rounded-t-[8rem] overflow-hidden">
    <div class="h-[95rem] pt-[13rem] mb-[28rem]" :class="`header-bg-${color}`">
      <div class="text-center text-white font-[600] text-[18rem] mb-[7rem]">
        {{ currentKind }}
      </div>
      <div class="w-full center">
        <div class="h-[25rem] w-[280rem] bg-white rounded-[5rem] text-center text-[#0D2245] font-[500] leading-[25rem]">
          <span class="mr-[14rem]">{{ $$t('选择') }}</span><span>{{ text }}</span>
        </div>
      </div>
    </div>
    <div class="px-[12rem] grid gap-y-[15rem]">
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
        <div v-for="item of multiplyArr" :key="item" class="px-[8rem] last:mr-0 text-[16rem] rounded-[6rem] mr-[6rem]" :class="currentMultiply === item ? `${color}-btn` : 'bg-[#ebebeb]'" @click="changeCurrentMultiply(item)">
          <span class="leading-[28rem] text-[16rem]">X{{ item }}</span>
        </div>
      </h3>
      <h4 class="flex items-center mb-[18rem] h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" /><span class="leading-[28rem] text-[#4D4D4D]">{{ $$t('我同意') }} <span class="text-[#F23038] leading-[28rem] cursor-pointer" @click="isShowRules = true">《{{ $$t('预售规则') }}》</span></span>
      </h4>
    </div>
    <div class="w-full h-[36rem] flex text-[14rem] font-[500]">
      <div class="w-1/3 text-center leading-[36rem] bg-[#25253C] text-[#6D7693]" @click="emits('close')">
        {{ $$t('取消') }}
      </div><div class="flex-1 text-center leading-[36rem] bg-[#47BA7C]" :class="`${color}-btn`" @click="onBet">
        {{ `${$$t('总金额')} ${currentGlobalCurrencyMap.prefix} ${total}` }}
      </div>
    </div>
    <LotteryDialog v-model="isShowRules" :close-text="$$t('我知道')" :title="$$t('预售规则')" :max-size="[264, 371]">
      <AppPreSaleRules />
    </LotteryDialog>
  </div>
</template>

<style scoped lang="scss">
.app-win-go-bet {
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
