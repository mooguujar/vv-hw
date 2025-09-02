<script setup lang='ts'>
import type { ILotteryOddsData } from '@tg/types'
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox, LotteryDialog } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useCurrency } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppPreSaleRules from '../../../components/AppPreSaleRules.vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useLogin } from '../../../hooks/useLogin'
import { multiplyArr } from '../../../utils/lotteryMaps'
import { message } from '../../../utils/message'
import { isLogin as getLogin } from '../../../utils/tool'
import AppFiveDBetPanel from './AppFiveDBetPanel.vue'

interface BetOptionsItem {
  label: string
  play_id: number
  id: number
  odd: string
}

interface Props {
  data: ILotteryOddsData
  lotteryId: number
  issueId: string
}

defineOptions({ name: 'AppFiveDBetPopup' })
const props = defineProps<Props>()
const emit = defineEmits(['close', 'success'])

const { bool: isCheck } = useBoolean(true)
const { bool: isShowRules } = useBoolean(false)
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { login } = useLogin(() => emit('close'))
const { $$t } = useLocale()

const { run: runBet } = useRequest(ApiCpBet, {
  onSuccess() {
    emit('success')
    emit('close')
    message.info($$t('成功下注'))
  },
  onError() {
    message.info($$t('下注失败'))
  },
})

const isLogin = ref(getLogin())

// 下注选项Ref
const betOptionsPanelRef = ref()
// 倍数
const currentMultiply = ref(1)
// 金额
const amount = ref('1')

const total = computed(() => Number(amount.value) * currentMultiply.value)
const params = computed(() => {
  return {
    lottery_id: props.lotteryId,
    issue_id: props.issueId, // 期号，例如 "2025072301293"
    amount: total.value.toString(),
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: [], // 投注项列表
  }
})

function changeCurrentMultiply(v: number) {
  currentMultiply.value = v
}
function decrease() {
  if (currentMultiply.value > 0)
    currentMultiply.value = currentMultiply.value - 1
}
function increase() {
  currentMultiply.value = currentMultiply.value + 1
}
function onAmountClick(v: string) {
  amount.value = v
}
// 下注
function onBet() {
  if (!isLogin.value)
    return login()
  if (!isCheck.value) {
    message.info($$t('请勾选我同意预售规则'))
    return
  }
  const bsoe = betOptionsPanelRef.value.selectBSOEObj as BetOptionsItem
  const nums = betOptionsPanelRef.value.selectNumObjArr as BetOptionsItem[]
  console.log('🚸🚸🚸 ~ onBet ~ 下注选项:', bsoe, nums)

  // 大小单双
  if (bsoe) {
    runBet({
      ...params.value,
      bets: [{
        id: bsoe.id,
        play_id: bsoe.play_id,
        bet_balls: '',
        odds: bsoe.odd,
        times: currentMultiply.value,
        price: amount.value,
        amount: total.value.toString(),
      }],
    })
  }
  // 号码
  else if (nums && nums.length > 0) {
    runBet({
      ...params.value,
      bets: [{
        id: nums[0].id,
        play_id: nums[0].play_id,
        bet_balls: `[${nums.map(a => a.label)}]`,
        odds: nums[0].odd,
        times: currentMultiply.value,
        price: amount.value,
        amount: total.value.toString(),
      }],
    })
  }
}
</script>

<template>
  <div class="pt-[16rem] bg-[#fff] rounded-t-[8rem] ">
    <div class="px-[13rem] pb-[18rem]">
      <AppFiveDBetPanel ref="betOptionsPanelRef" :data="data.odds" is-in-pop />
      <!-- 快捷金额 -->
      <div class="flex  justify-between mt-[4rem] mb-[15rem]">
        <span class="text-[#6D7693] text-[16rem] leading-[28rem]">{{ $$t('金额') }}</span>
        <div class="flex">
          <div
            v-for="num in data.price" :key="num"
            class=" ml-[6rem] px-[8rem] h-[28rem] flex items-center justify-center rounded-[4rem] text-[16rem] "
            :class="amount === num ? 'bg-[#47BA7C] text-[#fff]' : 'bg-[#EBEBEB] text-[#0D2245]'"
            @click="onAmountClick(num)"
          >
            {{ num }}
          </div>
        </div>
      </div>
      <!-- 数量 -->
      <div class="flex  justify-between  mb-[15rem]">
        <span class="text-[#6D7693] text-[16rem] leading-[28rem]">{{ $$t('倍数') }}</span>
        <div class="flex">
          <div
            class="w-[28rem] h-[28rem] text-[#fff] text-[25rem] flex  justify-center bg-[#47BA7C] rounded-[6rem]"
            @click="decrease"
          >
            <span class="leading-[25rem]">-</span>
          </div>
          <input
            id="" v-model.number="currentMultiply"
            class="inline-block mx-[6rem] w-[79rem] border-[1rem] border-solid border-[#EBEBEB] text-[#0D2245] text-[15rem] text-center rounded-[6rem]"
            type="number" inputmode="numeric" name=""
          >
          <div
            class="w-[28rem] h-[28rem] text-[#fff] text-[25rem] flex  justify-center bg-[#47BA7C] rounded-[6rem]"
            @click="increase"
          >
            <span class="leading-[25rem]">+</span>
          </div>
        </div>
      </div>
      <!-- 倍数 -->
      <div class="flex justify-end mb-[15rem]">
        <div
          v-for="item of multiplyArr" :key="item" class="px-[8rem] last:mr-0 text-[16rem] rounded-[6rem] mr-[6rem]"
          :class="currentMultiply === item ? 'bg-[#47BA7C] text-[#fff]' : 'bg-[#ebebeb] text-[#0D2245]'"
          @click="changeCurrentMultiply(item)"
        >
          <span class="leading-[28rem] text-[16rem]">X{{ item }}</span>
        </div>
      </div>

      <h4 class="flex items-center h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" />
        <span class="leading-[28rem] text-[#4D4D4D]">{{ $$t('我同意') }}
          <span class="text-[#F23038] leading-[28rem] cursor-pointer" @click="isShowRules = true">
            《{{ $$t('预售规则') }}》
          </span>
        </span>
      </h4>
    </div>

    <!-- 取消、下注 -->
    <div class="w-full h-[36rem] flex  text-[14rem] font-[500]">
      <div class="w-1/3 text-center leading-[36rem] bg-[#25253C] text-[#6D7693]" @click="emit('close')">
        {{ $$t('取消') }}
      </div>
      <div class="flex-1 text-center text-[#fff] leading-[36rem] bg-[#47BA7C]" @click="onBet">
        {{ $$t('总金额') }} {{ currentGlobalCurrencyMap.prefix }} {{ total }}
      </div>
    </div>

    <LotteryDialog v-model="isShowRules" :close-text="$$t('我知道')" :title="$$t('预售规则')" :max-size="[264, 371]">
      <AppPreSaleRules />
    </LotteryDialog>
  </div>
</template>

<style lang='scss' scoped></style>
