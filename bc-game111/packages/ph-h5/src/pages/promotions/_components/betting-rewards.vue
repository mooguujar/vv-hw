<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberPromoDailyBonusBet, ApiMemberPromoDailyBonusClaim, ApiMemberPromoDailyBonusDetail } from '@tg/apis'
import { BaseImage, PhBaseAmount, PhBaseButton, PhBaseProgress, PhBaseRichArea, PhBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconUniRecordConfirm } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import {
  appEventBus,
  application,
  div,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,
  sub,
} from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppActivityVenues from '~/components/AppActivityVenues.vue'
import AppImage from '~/components/AppImage.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'KeepAlivePromotionBettingRewards',
})
const setTitle = inject('setTitle', (v: string) => { })
const { t } = useI18n()
// const { openNotify } = useNotify()
const router = useRouter()
const currencyStore = useCurrency()
const userLanguage = ref(getLang())
const { jumpToUrl } = useRedirect()
const { isLogin } = storeToRefs(useAppStore())
const currentLang = getLangForBackend()
const route = useRoute()
/** 从链接中获取活动的PID */
const pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
/** 图片地址 */
const imgUrl = ref('')
/** 活动配置数据 */
const dataProfitConfig = ref()

/** 当日、次日、本周、本月投注领取查询 */
const dataPromoDailyBonusBet = ref()

/** 接口返回币种,防止选择的货币没有数据 */
const memberCurrency = ref<CurrencyCode>('701')

/** 可领取的奖励总计 */
let totalBonus = 0
const displayedBonus = ref(0)

/** 当前领取的有效投注 */
const tempTier = ref(0)

/** 接口: 活动配置 */
const {
  data: detailData,
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberPromoDailyBonusDetail)

// 当前货币配置
const activeCurrency = computed(() => {
  return getCurrencyConfig(memberCurrency.value)
})

/** 接口: 当日、次日、本周、本月投注领取查询 */
const {
  runAsync: runAsyncProfitLevel2,
} = useRequest(ApiMemberPromoDailyBonusBet, {
  onSuccess: (data) => {
    dataPromoDailyBonusBet.value = data
  },
})
/** 接口: 当日、次日、本周、本月投注领取查询 */
const {
  runAsync: runAsyncProfitLevel,
  loading: loadingProfitLevel,
} = useRequest(ApiMemberPromoDailyBonusBet, {
  onSuccess: (data) => {
    if (data?.t) {
      if (data.t === activeCurrency.value.cur)
        dataPromoDailyBonusBet.value = data

      else
        runAsyncProfitLevel2({ pid, currency: data.t as CurrencyCode })
    }
    else {
      dataPromoDailyBonusBet.value = data
    }
    totalBonus = 0
    displayedBonus.value = 0
  },
})

/** 接口: 领取奖金 */
const {
  loading: loadingApply,
  runAsync: runAsyncProfitBonusApply,
} = useRequest(ApiMemberPromoDailyBonusClaim)

/** 表格:列，后台配置：全部领取 */
const tableColumnAll: Column[] = [
  {
    title: t('有效投注'),
    dataIndex: 'valid',
    align: 'center',
    isAmount: true,
    slot: 'valid_bet_amount',
    width: '44%',
  },
  {
    title: t('奖励'),
    dataIndex: 'bonus',
    align: 'center',
    isAmount: true,
    slot: 'bonus_rate',
    width: '28%',
  },
  {
    title: t('状态'),
    dataIndex: 'bonus',
    align: 'center',
    slot: 'receive',
    width: '28%',
  },
]

/** 表格:列，后台配置：领取最高档 */
const tableColumnTop: Column[] = [
  {
    title: t('有效投注'),
    dataIndex: 'valid',
    align: 'center',
    isAmount: true,
    slot: 'valid_bet_amount',
    width: '44%',
  },
  {
    title: t('奖励'),
    dataIndex: 'bonus',
    align: 'center',
    isAmount: true,
    slot: 'bonus_rate',
    width: '28%',
  },
]
// 是否参与活动
const isPartCurrencyId = computed(() => {
  // 监听是否参与活动的货币
  return dataPromoDailyBonusBet.value?.t as CurrencyCode ?? null
})
/** 更新当日、次日、上周、上月的数据 */
const dataProfitLevel = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 1:
      return dataPromoDailyBonusBet.value?.d[1]
    default:
      return dataPromoDailyBonusBet.value?.d[0]
  }
})
/** 更新当日的数据 */
const dataProfitLevelToday = computed(() => {
  return dataPromoDailyBonusBet.value?.d[1]
})

/** 优惠是否终止 */
const isDiscountEnd = computed(() => {
  if (dataPromoDailyBonusBet.value?.s === '1')
    return false

  else
    return true
})

/** 后台配置是”1:全部领取“还是”2:最高档领取“，启用不同的列 */
const tableColumn = computed(() => {
  return dataProfitConfig.value?.method === 1 ? tableColumnAll : tableColumnTop
})

/** 最高可获得奖励 */
const maxBonus = computed(() => {
  let _maxBonus = 0
  if (dataProfitConfig.value?.method === 1 && dataProfitConfig.value?.currency) {
    dataProfitConfig.value?.currency.forEach((item: any) => {
      _maxBonus += Number.parseFloat(item.bonus)
    })
  }
  else if (dataProfitConfig.value?.method === 2 && dataProfitConfig.value?.currency) {
    _maxBonus = Number.parseFloat(dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1].bonus)
  }
  return _maxBonus.toFixed(2)
})

/** 当前可领取的等级 */
const currentLevel = computed(() => {
  return dataProfitLevel.value?.valid_bet_amount ?? '0'
})

/** 当日可领取的等级 */
const todayLevel = computed(() => {
  return dataProfitLevelToday.value?.valid_bet_amount ?? '0'
})

// 当前下一级领取奖励水平的数据
const nextLevel = computed(() => {
  const _currentLevel = dataProfitConfig.value?.period === 1 ? currentLevel.value : todayLevel.value
  if (dataProfitConfig.value?.currency) {
    const level = dataProfitConfig.value.currency.find((item: any) => item.valid >= Number(_currentLevel) + 1)
    return level
  }
  else {
    return null
  }
})

// 当前记录可领取奖励
const currAvaiLevel = computed(() => {
  if (dataProfitConfig.value?.currency && Number(currentLevel.value) > 0) {
    if (Number(currentLevel.value) >= dataProfitConfig.value.currency[0].valid && Number(currentLevel.value) <= dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1].valid)
      return dataProfitConfig.value.currency.find((item: any) => (Number(currentLevel.value) <= item.valid))

    else if (Number(currentLevel.value) > dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1].valid)
      return dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1]
  }
  return null
})

// 距离下级奖励还需多少
const stillNextLevel = computed(() => {
  const _currentLevel = dataProfitConfig.value?.period === 1 ? currentLevel.value : todayLevel.value
  const levelNum = sub(Number(nextLevel.value ? nextLevel.value.valid : 0), Number(_currentLevel || 0))
  return nextLevel.value ? Number.parseFloat(levelNum).toFixed(2) : ''
})

// 当日、次日、本周、本月投注的文案
const periodText = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 1:
      return t('今日有效投注')
    case 2:
      return t('今日有效投注')
    case 3:
      return t('本周有效投注')
    case 4:
      return t('本月有效投注')
    default:
      return t('今日有效投注')
  }
})

// 次日、上周、上月投注的文案
const lastPeriodText = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 2:
      return t('昨日有效投注')
    case 3:
      return t('上周有效投注')
    case 4:
      return t('上月有效投注')
    default:
      return ''
  }
})

// 一键领取是否显示
const isShowReceive = computed(() => {
  return dataProfitConfig.value?.period === 1
})

// 审核状态
const isAudit = computed(() => {
  return dataProfitConfig.value?.automatic === 2
})

/** 领取是否可用1:已经领取 0：没有领取 */
const isReceive = computed(() => {
  if (displayedBonus.value > 0)
    return false

  else if ((isPartCurrencyId.value) && displayedBonus.value === 0)
    return true

  else return undefined
})
// 当前有效投注占比
function percentNextLevel() {
  const _currentLevel = dataProfitConfig.value?.period === 1 ? currentLevel.value : todayLevel.value
  if (nextLevel.value) {
    if (Number(nextLevel.value.valid))
      return Number(div(Number(_currentLevel || 0), Number(nextLevel.value.valid))) * 100

    else
      return 0
  }
  else {
    return 100
  }
}

/** 当前记录是否已领取 */
function isReceiveCurRecord(record: any) {
  const isvArr = dataPromoDailyBonusBet.value?.v ?? []
  if (isvArr.includes(record.valid))
    return true

  else return false
}
/** 延时显示：计算总奖金 */
function calculateBonus(data: number) {
  setTimeout(() => {
    if (data === 0) {
      totalBonus = 0
      displayedBonus.value = 0
    }
    totalBonus += data
    displayedBonus.value = totalBonus
  }, 0)
}
/** 是否等于当前领取的等级 0: 领取 -1: 已领取 1: 其它 */
function isCurrentLevel(currentLevel: any, record: any, type: number) {
  if (isReceiveCurRecord(record)) {
    return -1
  }
  else if (Number.parseFloat(record.valid) <= Number.parseFloat(currentLevel)) {
    if (dataProfitConfig.value.method === 2) {
      if (Number.parseFloat(currAvaiLevel.value.valid) === Number.parseFloat(record.valid)) {
        calculateBonus(Number.parseFloat(record.bonus))
        return 0
      }
      else {
        const index = dataProfitConfig.value?.currency.findIndex((item: any) => item.valid === Number.parseFloat(currAvaiLevel.value.valid))
        const hightestArr = dataProfitConfig.value?.currency[index]
        if ((record.valid === hightestArr.valid) && (type === 1)) {
          calculateBonus(Number.parseFloat(record.bonus))
          return 0
        }
        else {
          return 1
        }
      }
    }
    else {
      if (type === 1) {
        totalBonus = 0
        if (tempTier.value === record.valid)
          totalBonus -= record.bonus

        else
          calculateBonus(Number.parseFloat(record.bonus))
      }
      return 0
    }
  }
  else {
    return 1
  }
}
// 一键领取, tier: 0: 全部领取 or 领取最高档 ,有效投注金额值：分段领取
function handleReceive(tier: number) {
  if (isLogin.value) {
    if (isDiscountEnd.value) {
      Message.error(t('活动已结束'))
      return
    }
    if (tier)
      tempTier.value = tier
    runAsyncProfitBonusApply({
      pid,
      tier,
      currency: isPartCurrencyId.value ? isPartCurrencyId.value as any : activeCurrency.value.cur,
    }).then((data) => {
      if (!data) {
        if (tier)
          tempTier.value = tier

        if (dataProfitConfig.value?.automatic === 2) {
          Message.success(
            h('div', { class: 'flex items-center gap-[4rem]' }, [
              h(IconUniRecordConfirm, { class: 'text-white' }),
              h('span', { class: 'whitespace-nowrap' }, t('奖金系统正在审核中')),
            ]),
          )
          runAsyncProfitLevel({ pid, currency: isPartCurrencyId.value ? isPartCurrencyId.value as any : activeCurrency.value.cur })
        }
        else {
          currencyStore.initCurrencyList()
        }
        calculateBonus(0)
      }
      else if (data === '操作失败') {
        Message.error(t('领取失败'))
      }
      else {
        console.log('领取事件成功:', data)
        if (isAudit.value) {
          Message.success(
            h('div', { class: 'flex items-center gap-[4rem]' }, [
              h(IconUniRecordConfirm, { class: 'text-white' }),
              h('span', { class: 'whitespace-nowrap' }, t('奖金系统正在审核中')),
            ]),
          )
        }
        mqttRefresh()
      }
    })
  }
  else {
    router.push('/login')
  }
}
/** 配置活动图片 */
function setProfitConfig(data: any) {
  if (data)
    imgUrl.value = data.img[currentLang] || ''
}
/** 接口：活动配置数据 */
function runAsyncConfig() {
  return runAsyncProfitConfig({ pid }).then((data) => {
    let tongue = (data as any).lang || '[]'
    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!tongue.includes(getLangForBackend() || '')) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (data && +data.state !== 1 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
    else {
      // 使用类型断言，因为实际API返回包含currency_id但类型定义不完整
      memberCurrency.value = (data as any).currency_id || '701'
      setProfitConfig(data)
      dataProfitConfig.value = getCurrencyConfigByData(data)
    }

    if (isLogin.value)
      runAsyncProfitLevel({ pid, currency: (data as any).currency_id || '701' })
  })
}

/** 过滤当前货币和语言的数据 */
function getCurrencyConfigByData(data: any) {
  const _currentCurrency = memberCurrency.value ? memberCurrency.value : activeCurrency.value.cur
  const button = data?.button?.button
  const button_type = data?.button?.button_type
  const redirect = data?.button?.redirect
  const automatic = data?.automatic
  const text = data?.buttonText[currentLang]
  const currencyList = data?.conf.currency
  const currency = data?.conf.currency[_currentCurrency]
  const detail = data?.detail[currentLang]
  const images = data?.img[currentLang]
  const method = data?.conf.method
  const period = data?.conf.period
  const platform_ids = data?.conf.plat_ids
  const rule_type = data?.rule_type
  const tongue = data?.tongue
  return {
    button,
    button_type,
    redirect,
    automatic,
    text,
    currencyList,
    currency,
    detail,
    images,
    method,
    period,
    platform_ids,
    rule_type,
    tongue,
  }
}
/** 跳转到活动列表页面 */
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}
function mqttRefresh() {
  console.log('领取成功后的mqtt刷新')
  currencyStore.initCurrencyList()
  calculateBonus(0)
  runAsyncProfitLevel({ pid, currency: memberCurrency.value })
}

/** 领取事件 */
function handleItemClick(data: any) {
  const valid = data.valid
  if (isReceiveCurRecord(data))
    return

  handleReceive(valid)
}
/** 监听登陆状态 */
watch(isLogin, async (newVal) => {
  if (newVal)
    await application.allSettled([runAsyncConfig()])

  else
    await application.allSettled([runAsyncConfig()])
})

watchEffect(() => {
  // 使用类型断言，因为实际API返回包含names但类型定义不完整
  let names = (detailData.value as any)?.names || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    setTitle(name)
})
onMounted(() => {
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

await application.allSettled([runAsyncConfig()])
</script>

<template>
  <div class="text-tg-text-lightgrey page-back-cash m-auto  max-w-[650rem]">
    <div class="mb-[16rem] center" :class="{ ' mb-[16rem]': imgUrl }">
      <BaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class=" bg-[#fff] mb-[16rem] rounded-[4rem] px-[10rem] py-[5rem] font-[500]">
      <div class="flex items-end justify-between mb-[10rem]">
        <div class="flex text-[20rem]">
          <span class="mr-[10rem]">{{ periodText }}:</span>
          <span>
            <PhBaseAmount
              class="theme-amount" :amount="dataProfitLevelToday?.valid_bet_amount || '0.00'"
              :currency-type="getCurrencyConfig(memberCurrency)?.name" style="--ph-base-amount-font-size:20rem"
            />
          </span>
        </div>
        <AppImage class="w-[48rem]" url="/ph-h5/png/back-cash-currency.png" />
      </div>
      <PhBaseProgress
        class="mb-[10rem]" width="100%" :show-percentage="false" :value="percentNextLevel()"
        :show-info="false" :stroke-width="8" background-color="#EBEBEB" bar-color="#2BA471"
      />
      <div v-if="nextLevel" class="text-[#6D7693] font-[500] text-right text-[12rem]">
        {{ t('距离下级还需') }}<span class="theme-amount">{{ stillNextLevel }}</span>
      </div>
      <div v-else class="text-[#6D7693] font-[500] text-right text-[12rem]">
        {{ t('已达到最高级') }}
      </div>
    </div>
    <div
      v-if="!isShowReceive"
      class="theme-box mb-[16rem] flex flex-col gap-[10rem] rounded-[4rem] p-[12rem] text-[12rem] font-[500]"
    >
      <div class="flex">
        <span class="flex-shrink-0">{{ lastPeriodText }}：</span>
        <span class="flex-1 flex justify-start">
          <PhBaseAmount
            class="theme-amount" :amount="dataProfitLevel?.valid_bet_amount || '0.00'"
            :currency-type="getCurrencyConfig(memberCurrency)?.name"
          />
        </span>
      </div>
      <div class="flex">
        <span class="flex-shrink-0">{{ t('可领取') }}：</span>
        <span class="flex-1 flex justify-start">
          <PhBaseAmount
            class="theme-amount"
            :amount="dataProfitConfig?.method === 1 ? displayedBonus : isReceive ? displayedBonus : (maxBonus || '0.00')"
            :currency-type="getCurrencyConfig(memberCurrency)?.name"
          />
        </span>
      </div>
      <PhBaseButton
        v-if="isReceive" style="--ph-base-button-primary-background-color:#6D7693"
      >
        {{ t('当日已领取') }}
      </PhBaseButton>
      <PhBaseButton
        v-else
        :disabled="isReceive === undefined ? true : isReceive"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
      >
        {{ isReceive ? t('当日已领取') : t('领取') }}
      </PhBaseButton>
    </div>
    <PhBaseTable
      class="table"
      :columns="tableColumn" last-first-padding :data-source="dataProfitConfig?.currency ?? []"
    >
      <template #valid_bet_amount="{ record }">
        <div class="inline-table">
          <PhBaseAmount
            class="theme-amount" :amount="record.valid" :currency-type="getCurrencyConfig(memberCurrency)?.name"
            :style="{ color: isCurrentLevel(currentLevel, record, 1) === 0 && dataProfitConfig.method === 2 ? 'var(--green-500)' : '' }"
          />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="inline-table">
          <PhBaseAmount
            class="theme-amount"
            :amount="record.bonus"
            :currency-type="getCurrencyConfig(memberCurrency)?.name"
            :style="{ color: isCurrentLevel(currentLevel, record, 1) === 0 && dataProfitConfig.method === 2 ? 'var(--green-500)' : '' }"
          />
        </div>
      </template>
      <template #receive="{ record }">
        <div
          v-if="isCurrentLevel(currentLevel, record, 0) === 0"
          class="text-[#fff] bg-[#f23038] w-[85rem] h-[28rem] center rounded-[4rem]"
          @click="handleItemClick(record)"
        >
          {{ t('领取') }}
        </div>
        <div
          v-else-if="isCurrentLevel(currentLevel, record, 0) === -1"
          :style="{ color: dataProfitConfig?.automatic === 2 ? '#fff' : '#ccc', backgroundColor: dataProfitConfig?.automatic === 2 ? '#F88D22' : '#6D7693' }"
          class="text-[#ccc] w-[85rem] h-[28rem] center rounded-[4rem]"
        >
          {{ dataProfitConfig?.automatic === 2 ? t('审核中') : t('已领取') }}
        </div>
        <div v-else>
          -
        </div>
      </template>
    </PhBaseTable>
    <PhBaseButton v-if="isShowReceive && isReceive" class="mt-[16rem] w-[100%]" style="--ph-base-button-primary-background-color:#6D7693">
      {{ t('当日已领取') }}
    </PhBaseButton>
    <PhBaseButton
      v-else-if="isShowReceive && !isReceive" class="mt-[16rem] w-[100%]"
      :bg-style="isReceive ? 'grey' : 'secondary'" size="md" :disabled="isReceive === undefined ? true : isReceive"
      :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
    >
      {{ isReceive ? t('当日已领取') : t('一键领取') }}
    </PhBaseButton>
    <AppActivityVenues
      v-if="dataProfitConfig?.platform_ids.length > 0" :title="t('活动场馆')"
      :plat-form-ids="dataProfitConfig?.platform_ids" default-tab="3"
    />
    <div class="theme-text text-[#0D2245] my-[16rem] text-[18rem] font-[500]">
      {{ t('活动规则') }}
    </div>
    <div class="mb-[24rem]">
      <PhBaseRichArea v-if="dataProfitConfig?.rule_type === 2" :content="dataProfitConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfig(memberCurrency)?.name" :amount="maxBonus"
        :is-login="isLogin"
        :content="dataProfitConfig?.detail"
      />
    </div>
    <div v-if="dataProfitConfig?.button === 1" class="my-[24rem] text-center">
      <PhBaseButton @click="jumpToUrl({ type: +dataProfitConfig.button_type, jumpUrl: dataProfitConfig.redirect })">
        {{ dataProfitConfig?.text }}
      </PhBaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-box {
  color: #6d7693;
  background-color: #ffffff;
}

.page-back-cash {
  --tg-table-layout: fixed;
  --tg-table-th-padding-x: 8rem;
  --tg-table-td-padding-x: 8rem;
  --tg-table-th-word-wrap: break-word;
  --tg-table-th-white-space: normal;
}

.set-radios {
  --tg-base-img-style-radius: 12rem;
}
</style>
