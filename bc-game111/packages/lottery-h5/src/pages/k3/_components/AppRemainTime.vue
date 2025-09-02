<script setup lang='ts'>
import { BaseImage, LotteryCountDown } from '@tg/bccomponents'
import { IconLotTicket } from '@tg/icons'
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import AppDialogHowtoplay from './AppDialogHowtoplay.vue'

const props = defineProps<Props>()
const { $$t } = useLocale()
interface Props {
  curPeriod: string
  time: number
  timeToShowMask: any
  randomId: number
  lotteryResultArr: any
  showResults: any
}
const lastResult = computed(() => {
  return props.lotteryResultArr?.value?.[0]
})

const result = computed(() => {
  return props.showResults?.value || []
})
</script>

<template>
  <div class="bg-white rounded-t-[10rem] flex flex-col py-[16rem] px-[11rem]">
    <div class="flex justify-between items-center font-[500] text-[#8B8B8B]">
      <div class="center gap-[13rem]">
        <span class="d">
          {{ $$t('期号') }}
        </span>
        <AppDialogHowtoplay>
          <div class="border-[1rem] text-[18rem] border-[#F23038] rounded-[30rem] center px-[20rem] h-[23rem] text-[#F23038]">
            <IconLotTicket /><span class="ml-[2rem] text-[12rem]">{{ $$t('玩法说明') }}</span>
          </div>
        </AppDialogHowtoplay>
      </div>
      <div class="text-right text-[12rem]">
        {{ $$t('倒计时') }}
      </div>
    </div>
    <div class="flex justify-between items-center font-[700] text-[##2C3E50]">
      <span class="text-[20rem]">
        {{ curPeriod }}
      </span>
      <LotteryCountDown :key="randomId" class="justify-end" style="--lot-timer-box-bg:#EFEFF4;--lot-timer-box-first-clip:none;--lot-timer-box-last-clip:none;" :time="time" @on-time="timeToShowMask" />
    </div>

    <div class="dices my-[18rem]  rounded-[7rem] bg-[#00B977] p-[10rem]">
      <div class="center bg-[#003C26] rounded-[5rem]  gap-[7.5rem] p-[5rem] h-[96rem]">
        <div v-for="(item, i) in result" :key="i" class="item center flex-1 h-[86rem] ">
          <BaseImage :url="`/lottery/png/dice-${item}.png`" class="w-[66rem]" />
        </div>
      </div>
    </div>
    <div class="absolute w-0 h-0 overflow-hidden">
      <BaseImage url="/lottery/png/dice-1.png" class="w-[66rem]" />
      <BaseImage url="/lottery/png/dice-2.png" class="w-[66rem]" />
      <BaseImage url="/lottery/png/dice-3.png" class="w-[66rem]" />
      <BaseImage url="/lottery/png/dice-4.png" class="w-[66rem]" />
      <BaseImage url="/lottery/png/dice-5.png" class="w-[66rem]" />
      <BaseImage url="/lottery/png/dice-6.png" class="w-[66rem]" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.dices {
  position: relative;
  .item {
    background: rgba(255, 255, 255, 0);
    box-shadow:
      0 -5rem 55rem 0 rgba(0, 0, 0, 0.3) inset,
      0 5rem 5rem 0 rgba(0, 0, 0, 0.3) inset;
  }
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -5rem;
    transform: translateY(-50%);
    z-index: 0;
    width: 5rem;
    height: 26rem;
    background: #008b59;
    border-radius: 5rem 0 0 5rem;
  }
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -5rem;
    transform: translateY(-50%);
    z-index: 0;
    width: 5rem;
    height: 26rem;
    background: #008b59;
    border-radius: 0 5rem 5rem 0;
  }
}
</style>
