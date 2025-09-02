<script setup lang='ts'>
import { BaseImage, LotteryDialog, LotteryKindTabs, LotteryPopup } from '@tg/bccomponents'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { storeToRefs } from 'pinia'

import { computed, provide, unref } from 'vue'
import AppUserBalance from '../../components/AppUserBalance.vue'
import AppWinLoseSettle from '../../components/AppWinLoseSettle.vue'
import { useLocale } from '../../components/LotteryConfigProvider'
import useLottery from '../../hooks/useLottery'
import { useK3Store } from '../../stores/useK3Store'
import { getBetItemByLotteryData } from '../../utils/lotteryMaps'
import AppBetView from './_components/AppBetView.vue'
import AppGameBottom from './_components/AppGameBottom.vue'
import AppK3Bet from './_components/AppK3Bet.vue'
import AppLottery from './_components/AppLottery.vue'
import AppRemainTime from './_components/AppRemainTime.vue'

const { $$t } = useLocale()
const {
  currentTab,
  tabArr,
  curPeriod,
  time,
  timeToShowMask,
  lotteryResultArr,
  showResults,
  timeMask,
  isShowMask,
  randomId,
  data,
  isShowWinLose,
  winLoseData,
} = useLottery('k3')
const k3Store = useK3Store()
const { showBetPop } = storeToRefs(k3Store)
const RemainProps = computed(() => {
  return {
    curPeriod: unref(curPeriod),
    time: unref(time),
    randomId: unref(randomId),
    lotteryResultArr,
    timeToShowMask,
    showResults,
  }
})

const LotteryProps = computed(() => {
  return {
    timeMask: unref(timeMask),
    isShowMask: unref(isShowMask),
    data: unref(data),
  }
})

provide('currentTab', currentTab)
provide('curPeriod', curPeriod)

const isShowBet = computed({
  get: () => showBetPop.value,
  set: (value) => {
    if (!value) {
      k3Store.clearBet()
    }
  },
})

function betSuccess() {
  k3Store.closePop()
  k3Store.clearBet()
  appEventBus.emit(EventBusNames.LOTTERY_K3_HISTORY, {})
}

const results = computed(() => {
  return winLoseData.value.result.map((id) => {
    return {
      play_id: id,
      bet_balls: winLoseData.value.bet_balls,
    }
  })
})
</script>

<template>
  <div v-if="currentTab" class="px-[13rem] pt-[16rem] grid gap-[16rem] pb-[58rem]">
    <AppUserBalance />
    <LotteryKindTabs v-model="currentTab" :tabs="tabArr" />
    <div>
      <AppRemainTime v-bind="{ ...RemainProps }" />
      <AppLottery v-bind="{ ...LotteryProps }" />
    </div>
    <AppGameBottom />
    <LotteryPopup v-model="isShowBet">
      <AppK3Bet
        v-if="isShowBet"
        @success="betSuccess"
      />
    </LotteryPopup>
    <LotteryDialog v-model="isShowWinLose" :show-header="false" style="--lot-dialog-container-bg: transparent" :mask-close="false">
      <AppWinLoseSettle
        v-if="isShowWinLose"
        :type="winLoseData.flag"
        :amount="winLoseData.settle_amount"
        :period="winLoseData.issue_id"
        :name="winLoseData.lottery_name"
        :currency-id="winLoseData.currency_id"
        @close="isShowWinLose = false"
      >
        <div class="center flex-col gap-[6rem]">
          <div class="flex gap-[17rem]">
            <BaseImage v-for="(num, i) in winLoseData.balls.split(',')" :key="i" :url="`/lottery/png/dice-solo-${num}.png`" class="w-[20rem]" />
          </div>
          <div class="flex gap-[5rem]">
            <AppBetView
              v-for="(item, i) in results"
              :key="i"
              :show-title="false"
              :playid="item.play_id"
              :k3-bet-data="getBetItemByLotteryData(item, $$t).K3BetData"
              :k3-bet-type="getBetItemByLotteryData(item, $$t).K3BetType"
            />
          </div>
        </div>
      </AppWinLoseSettle>
    </LotteryDialog>
  </div>
</template>

<style lang='scss' scoped>

</style>
