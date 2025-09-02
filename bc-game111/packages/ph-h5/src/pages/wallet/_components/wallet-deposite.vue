<!-- 人民币：钱包支付 -->
<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { PhBaseFinanceEmpty } from '@tg/bccomponents'
import { useAppStore, useStorageStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import MerchantList from './merchant-list.vue'

defineOptions({
  name: 'AppWalletDeposit',
})
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const storageStore = useStorageStore()
const { isCompleteKYC, comboCnyList, comboCnyLoading } = storeToRefs(appStore)
/** 当前的支付ID */
const curPaymentId = ref('')
/** 当前的法币 */
const activeFiatCurrency = ref<{ currency_id: CurrencyCode, currency_name: EnumCurrencyKey }>({
  currency_id: '701',
  currency_name: 'CNY',
})

const paymentMethodList = computed(() => {
  if (comboCnyList.value?.method && comboCnyList.value.method.length > 0)
    return comboCnyList.value.method.filter(a => a.alias === 'qb')
  else
    return []
})
const renderList = computed(() => {
  if (paymentMethodList.value && paymentMethodList.value.length > 0) {
    return paymentMethodList.value.map((a) => {
      return {
        ...a,
        merchants: a.merchants,
      }
    })
  }
  return []
})

/** 选择线上支持或转账 */
function gotoDepositFiatDetail({ item, list }: { item: any, list: any }) {
  curPaymentId.value = item.id
  const { id, payment_type, bank, zkId } = list

  router.push({
    path: '/wallet/deposit-detail',
    query: {
      currencyType: 'wallet', // 当前的货币类型
      currencyId: activeFiatCurrency.value.currency_id, // 当前的货币ID
      currencyName: activeFiatCurrency.value.currency_name, // 当前的货币名称
      curMerchant: JSON.stringify(item), // 当前的支付通道
      curPaymentType: payment_type,
      paymentId: id, // 当前的支付ID
      initHaveBank: bank,
      initzkId: zkId,
      initFiatCurrency: JSON.stringify(activeFiatCurrency.value), // 初始化当前法币
      activeCurrency: JSON.stringify(activeFiatCurrency.value), // 初始化当前法币
      curDepositPromo: JSON.stringify(curDepositPromo(id)), // 当前支付优惠
      merchantsList: JSON.stringify(curMerchantsList(id)), // 当前支付通道列表
      from_sub_tab: 'wallet',
    },
  })
}
/** 选择当前的支付优惠 */
function curDepositPromo(id: string) {
  if (paymentMethodList?.value && paymentMethodList.value.length > 0)
    return paymentMethodList.value.filter(a => a.id === id)[0].deposit_promo

  else
    return []
}
/** 选择当前的支付通道 */
function curMerchantsList(id: string) {
  if (paymentMethodList?.value && paymentMethodList.value.length > 0)
    return paymentMethodList.value.filter(a => a.id === id)[0].merchants

  else
    return []
}

watch(renderList, (_renderList) => {
  /*  if (_renderList.length > 0) {
    if (depositDetail.value && depositDetail.value.subTab === 'wallet' && depositDetail.value.detail) {
      const merchantId = depositDetail.value.detail.id
      let listItem: any = null
      let merchantItem: any = null
      _renderList.forEach((itemTemp) => {
        const tempMerChantItem = itemTemp?.merchants.find(item => item.id === merchantId)
        if (tempMerChantItem) {
          listItem = itemTemp
          merchantItem = tempMerChantItem
        }
      })
      if (listItem && merchantItem) {
        gotoDepositFiatDetail(merchantItem, listItem.id, listItem.payment_type, listItem.bank, listItem.zkId)
        // promoStore.setDepositDetail(null)
      }
    }
  } */
})
onMounted(() => {
})
</script>

<template>
  <div class="my-[16rem] p-[12rem] rounded-[8rem]  bg-white">
    <!-- 线上支付列表 -->
    <AppLoading v-if="comboCnyLoading" />
    <template v-else-if="renderList?.length > 0">
      <div
        v-for="list in renderList" :key="list.id" class=" px-[9rem] pt-[6rem] pb-[12rem] rounded-[4rem] border-solid border border-[#EBEBEB]"
      >
        <MerchantList :list="list" :currency="activeFiatCurrency" @itemclick="gotoDepositFiatDetail" />
      </div>
    </template>
    <PhBaseFinanceEmpty v-else description="$t('无存款渠道')" />
  </div>
</template>

<style>
:root {
}
</style>

<style lang="scss" scoped>

</style>
