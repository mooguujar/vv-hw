<script lang="tsx" setup name="AppMyHistoryList">
import type { LotteryMyBetRecordItem } from '@tg/types'
import { BaseImage } from '@tg/bccomponents'
import { IconLotCopy } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { timeTodateFormat2 } from '@tg/vue-i18n'
import { ref } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { getBetItemByLotteryData, getLotteryBallLabel } from '../../../utils/lotteryMaps'
import AppBetView from './AppBetView.vue'

const props = defineProps<Props>()
const { $$t } = useLocale()
interface Props {
  data: any
}
const clickedid = ref()

function dealHeadStatus(record: LotteryMyBetRecordItem) {
  const state = record.state
  if (state === 0) {
    return 'opacity-0'
  }
  if (state === 1) {
    return 'text-[#47BA7C]'
  }
  if (state === 2) {
    return 'text-[#FD565C]'
  }
}
</script>

<template>
  <div class="">
    <div v-for="item of data" :key="item.id" class="font-[400] border-t-[1rem] bg-white border-[#ebebeb] first:border-none">
      <!-- 列 -->
      <div class="py-[13rem] text-[12rem] cursor-pointer center " @click="clickedid = item.id">
        <div class="size-[36rem] mr-[12rem] rounded-[10rem] text-white center" :style="{ background: getLotteryBallLabel(item, $$t)?.bg }">
          {{ getLotteryBallLabel(item, $$t)?.label }}
        </div>
        <div class="flex-1 flex flex-col font-[500] pointer-events-none">
          <h1 class="flex mb-[5rem] items-start">
            <span class="mr-auto text-[14rem] leading-[17rem]">
              {{ item.issue_id }}</span>
            <span class="w-[82rem] leading-[18rem] rounded-[6rem] border-[1rem] text-center" :class="dealHeadStatus(item)">
              {{ item.state === 1 ? $$t('成功') : $$t('失败') }}
            </span>
          </h1>
          <h2 class="flex" style="align-items: end;">
            <span class="mr-auto text-[#888] leading-[17rem]">
              {{ timeTodateFormat2(item.created_at) }}
            </span>
            <span class="text-[14rem] leading-[15.5rem]" :class="dealHeadStatus(item)">{{ item.state === 1 ? '+' : '-' }}{{ getCurrencyConfig(item.currency_id).prefix }}{{ item.valid_bet_amount }}</span>
          </h2>
        </div>
      </div>
      <!-- 详情 -->
      <div v-if="clickedid === item.id" class="p-[12rem] pb-[24rem] grid gap-y-[8rem] text-[#6D7693] leading-[25rem] text-[14rem]">
        <h1 class="font-[500] text-[20rem] text-[#000]">
          {{ $$t('详情') }}
        </h1>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('订单号') }}</span>
          <div class="leading-[25rem] flex">
            <span class="mr-[3.5rem] leading-[25rem]">{{ item.id }}</span><span class="text-[#9DABC8] cursor-pointer center text-[18rem]"><IconLotCopy /></span>
          </div>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('期号') }}</span>
          <span>{{ item.issue_id }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('购买金额') }}</span>
          <span>{{ getCurrencyConfig(item.currency_id).prefix }}{{ item.bet_amount }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('倍数') }}</span>
          <span>{{ item.times }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('税后金额') }}</span>
          <span class="text-[#F2413B]">{{ getCurrencyConfig(item.currency_id).prefix }}{{ item.valid_bet_amount }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('税') }}</span>
          <span>{{ getCurrencyConfig(item.currency_id).prefix }}{{ item.tax_amount }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('开奖结果') }}</span>
          <div class="flex gap-[4rem]">
            <BaseImage v-for="(num, i) in JSON.parse(item.balls)" :key="i" :url="`/lottery/png/dice-solo-${num}.png`" class="w-[20rem]" />
          </div>
        </h2>
        <h2 class="flex flex-col detail-bg">
          <span class="mr-auto">{{ $$t('选择') }}</span>
          <AppBetView :playid="item.play_id" :k3-bet-data="getBetItemByLotteryData(item, $$t).K3BetData" :k3-bet-type="getBetItemByLotteryData(item, $$t).K3BetType" />
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">{{ $$t('状态') }}</span>
          <span v-if="item.state === 0">{{ $$t('未支付') }}</span>
          <span v-if="item.state === 1" class="text-[#47BA7C]">{{ $$t('成功1') }}</span>
          <span v-if="item.state === 2" class="text-[#FD565C]">{{ $$t('失败') }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">Win/lose</span>
          <span v-if="item.state === 0">--</span>
          <span v-else :class="[item.state === 1 ? 'text-[#47BA7C]' : 'text-[#FD565C]']">{{ `${item.state === 1 ? '+' : '-'}${getCurrencyConfig(item.currency_id).prefix}${Math.abs(Number(item.settle_amount) - Number(item.valid_bet_amount)).toFixed(2)}` }}</span>
        </h2>
        <h2 class="flex detail-bg">
          <span class="mr-auto">Order time</span>
          <span>{{ timeTodateFormat2(item.created_at) }}</span>
        </h2>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
 .detail-bg {
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: #f9f9f9;
  border-radius: 4rem;
  line-height: 25rem;
}
</style>
