<script setup lang="ts">
import { ApiMemberTurntableConfig, ApiMemberTurntableRecord, ApiMemberTurntableRoll } from '@tg/apis'
import { BaseImage } from '@tg/bccomponents'
import { IconForgetClose } from '@tg/icons'
import { useAppStore, useCurrency, useLoginReloadDialog, useNotLoginReloadDialog } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppRoulette from './AppRoulette.vue'

interface Props {
  showRoll?: boolean
  /** 首页弹框转盘配置是，首页弹框接口返回的 */
  data?: any
  state?: number
  pid?: string
  amount?: string
}
defineOptions({
  name: 'AppDialogTurntableFirst',
})
const props = withDefaults(defineProps<Props>(), {
  showRoll: false,
  amount: '0',
  pid: '',
})

// const { openFreeGetManyDialog } = useDialogFreeGetMany()
const { isLogin } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

const activeCurrency = computed(() => {
  return application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? '706' : currentGlobalCurrencyMap.value.cur
})

const {
  data: rollRecord,
  runAsync: runAsyncTurntableRecord,
} = useRequest(ApiMemberTurntableRecord, {
  ready: isLogin,
})

const { data: resultRoll, loading: loadTurntableRoll, runAsync: runAsyncTurntableRoll } = useRequest(ApiMemberTurntableRoll, {
  ready: isLogin,
})
const { data: turntableConfig, runAsync: runAsyncTurntableConfig } = useRequest(ApiMemberTurntableConfig)
const notLoginReloadDialog = useNotLoginReloadDialog()
const loginReloadDialog = useLoginReloadDialog()
if (props.data)
  turntableConfig.value = props.data
const rouletteRef = ref()
// 当前抽奖币种货币配置 默认USDT
// const getCurrencyConfig = computed(() => {
//   return getCurrencyConfigByCode(turntableConfig.value?.currency_id ?? '706')
// })

function handleStartRoll(isZero: boolean) {
  if (isZero) { // 次数为0不可滚动
    return
  }
  rouletteRef.value?.play()
  if (!loadTurntableRoll.value)
    runAsyncTurntableRoll({ pid: props.pid, cur: activeCurrency.value })
}
function handleEndRoll() {
  handleClose()

  let _amount = resultRoll.value?.amount ?? '0'
  if (rollRecord.value?.achieved_prize)
    _amount = (+_amount + +rollRecord.value?.achieved_prize).toString()

  /* openFreeGetManyDialog({
    data: turntableConfig.value,
    pid: props.pid,
    amount: _amount,
  }) */
  runAsyncTurntableRecord({ pid: props.pid })
}
function handleClose() {
  if (rouletteRef.value?.isTurn) {
    if (isLogin.value)
      loginReloadDialog.next()
    else
      notLoginReloadDialog.next()
  }
}

// if (!props.data) {
//   await application.allSettled(
//     [runAsyncTurntableConfig({ pid: props.pid, cur: activeCurrency.value.cur })],
//   )
// }

runAsyncTurntableConfig({ pid: props.pid, cur: activeCurrency.value })
runAsyncTurntableRecord({ pid: props.pid })
</script>

<template>
  <div class="center fixed left-0 top-0 h-[100%] w-[100%]" @click="handleClose" @touchmove.stop.prevent>
    <div class="margin-auto relative h-[386rem] w-[332rem]">
      <div
        class="center close-round absolute right-[14rem] top-[0] h-[18rem] w-[18rem] cursor-pointer rounded-full"
        @click="handleClose"
      >
        <IconForgetClose class="text-[12rem]" />
      </div>
      <!-- 转盘 -->
      <div class="margin-auto relative w-[100%]">
        <div class="absolute bottom-[-67rem] left-[30rem] z-[4] w-[284rem]">
          <BaseImage url="/ph-h5/png/before-front-background.png" />
        </div>
        <div class="absolute bottom-[-40rem] left-[40rem] z-[3] w-[70rem]">
          <BaseImage url="/ph-h5/png/before-left-background.png" />
        </div>
        <div class="absolute bottom-[-60rem] right-[20rem] z-[3] w-[95rem]">
          <BaseImage url="/ph-h5/png/before-right-background.png" />
        </div>
        <!-- 各种转盘样式 -->
        <div class="margin-auto relative">
          <AppRoulette
            ref="rouletteRef" class="absolute bottom-[-50rem] scale-[0.9]"
            :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times" :state="turntableConfig?.state"
            :amount="resultRoll?.amount" @start-roll="handleStartRoll" @end-roll="handleEndRoll"
          />
        </div>
        <div class="absolute top-0 left-0 z-[1] w-[100%] px-[6rem]">
          <BaseImage url="/ph-h5/png/bottom-background.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close-round {
  border: 1px solid #c1c1c1;
  color: #c1c1c1;
}
</style>
