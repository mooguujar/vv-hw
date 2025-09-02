x<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <div class="mx-3">
      <div class="mt-4px">
        <a-button
          v-show="isFiat"
          :type="currencyType == 'Fiat' ? 'primary' : ''"
          :size="'large'"
          class="mr-2.5"
          @click="handCurrency('Fiat')"
          >{{ $t('business.Fiat_currency') }}</a-button
        >
        <a-button
          v-show="isEncryption"
          :size="'large'"
          :type="currencyType == 'encryption' ? 'primary' : ''"
          @click="handCurrency('encryption')"
          >{{ $t('business.cryptocurrency_currency') }}</a-button
        >
      </div>
      <ApiTable
        ref="apiTableInstance"
        :apiMap="currentCurrency.apiMap"
        :activeKey="activeKey"
        :achieveList="achieveList"
        @successactive-key="successactiveKey"
      >
        <cdButtonCurrency
          :btn-list="currencyList?.map((item) => ({ name: item.name, value: item.id }))"
          v-model="activeKey"
        />
      </ApiTable>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { columnsPaymentList, paymentForm } from './paymentPlatform.data';
  import {
    getPaymentMerchantList,
    updatePaymentMerchantState,
    delPaymentMerchant,
  } from '/@/api/finance';
  import ApiTable from './component/ApiTable.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { isVirtualCurrency } from '/@/utils/common';
  import { storeToRefs } from 'pinia';

  // const { getCurrencyList } = useCurrencyStore();

  const { paymentCurrencyList } = storeToRefs(useTreeListStore());
  const treeListStore = useTreeListStore();

  const achieveList = ref<any>([]);
  const activeKey = ref();
  let currencyType = ref('Fiat');
  const currencyList = ref<any>([]);
  const { getCurrencyObj } = useCurrencyStore();

  const isFiat = ref<any>(false);
  const isEncryption = ref<any>(false);

  function createItem(item: any) {
    return {
      key: item.id,
      name: item.name,
      apiMap: {
        PAGE_TYPE: item.name, // 类型
        columns: columnsPaymentList,
        schemas: paymentForm(item.id),
        listParams: {
          currency_id: item.id,
        },
        PAGE_ID: item.id,
        list: getPaymentMerchantList, // 获取列表接口
        delListItem: delPaymentMerchant, // 删除接口
        updateState: updatePaymentMerchantState, //更新状态接口
      },
    };
  }

  function crratepaymentCurrencyList(type?: any) {
    if (paymentCurrencyList.value.length == 0) {
      return;
    }
    isFiat.value = paymentCurrencyList.value.some((item) => item.attr === '1');
    isEncryption.value = paymentCurrencyList.value.some((item) => item.attr === '2');

    if (type) {
      if (isFiat.value) {
        handCurrency('Fiat');
      } else if (isEncryption.value) {
        handCurrency('encryption');
      } else {
        handCurrency('Fiat');
      }
    }

    paymentCurrencyList.value.forEach((item: any) => {
      const tab = createItem(item);
      achieveList.value.push(tab);
    });
  }

  crratepaymentCurrencyList('first');

  if (achieveList.value.length > 0) activeKey.value = achieveList.value[0].key ?? '';

  // const currentCurrency = computed(() =>
  //   achieveList.value.find((item) => item.key == activeKey.value),
  // );

  const currentCurrency = computed(() => {
    const foundItem = achieveList.value.find((item) => item.key == activeKey.value);
    return foundItem || createItem(getCurrencyObj);
  });

  const apiTableInstance = ref<any>(null);

  watch(currentCurrency, () => {
    apiTableInstance.value?.reload();
  });

  function successactiveKey(data) {
    treeListStore.initPaymentFinanceCurrency().then((res) => {
      crratepaymentCurrencyList();
      if (isVirtualCurrency(data)) handCurrency('encryption');
      else handCurrency('Fiat');
      activeKey.value = data;
      apiTableInstance.value?.reload();
    });
  }

  function handCurrency(type) {
    currencyType.value = type;
    if (type == 'Fiat') filterCurrency(1);
    else filterCurrency(2);
  }

  function filterCurrency(type) {
    currencyList.value = paymentCurrencyList.value.filter((el) => el.attr == type);
    if (currencyList.value.length > 0) activeKey.value = currencyList?.value[0]?.id ?? '';
  }

  // filterCurrency(1);
</script>

<style lang="less" scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }

  ::v-deep(.ant-radio-button-wrapper:first-child) {
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper:last-child) {
    border-left-width: 1px;
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    border-left-width: 1px;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    width: 88px;
    border-left-width: 1px solid #d9d9d9;
    text-align: center;
  }
</style>
