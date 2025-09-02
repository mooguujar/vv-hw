<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <div class="mx-3">
      <div class="mt-4px">
        <a-button
          :type="currencyType === 'Fiat' ? 'primary' : ''"
          :size="'large'"
          class="mr-2.5"
          @click="handCurrency('Fiat')"
          >{{ $t('business.Fiat_currency') }}</a-button
        >
        <a-button
          :size="'large'"
          :type="currencyType === 'encryption' ? 'primary' : ''"
          @click="handCurrency('encryption')"
          >{{ $t('business.cryptocurrency_currency') }}</a-button
        >
      </div>
      <ApiTable ref="apiTableInstance" :apiMap="currentCurrency.apiMap">
        <cdMoveButtonCurrency
          :btn-list="currencyList?.map((item) => ({ name: item.name, value: item.id }))"
          v-model="activeKey"
          :currencyType="currencyType"
          @move-currency-ids="moveCurrencyIds"
          v-if="isHasAuth('20716')"
        />
        <cdButtonCurrency
          :btn-list="currencyList?.map((item) => ({ name: item.name, value: item.id }))"
          v-model="activeKey"
          v-else-if="!isHasAuth('20716')"
        />
      </ApiTable>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { computed, ref, watch, watchEffect } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { bankcolumns, searchFormSchema, usdtcolumns } from './paywayManagement.data';
  import ApiTable from './component/ApiTable.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { isVirtualCurrency } from '/@/utils/common';
  import { getPaymentMethodList, sortFinanceCurrency } from '/@/api/finance';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdMoveButtonCurrency from '/@/components-cd/button/movueCurrency.vue';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { message } from 'ant-design-vue';
  import { isHasAuth } from '@/utils/authFunction';

  const { getCurrencyList } = useCurrencyStore();
  const count = useCurrencyStore();

  const currencyStore = useCurrencyStore();
  const achieveList = ref<any>([]);
  const currencyList = ref<any>([]);
  const currencyArrayList = ref<any>([]);
  let activeKey = ref();
  let currencySort = ref({
    '1': [],
    '2': [],
  });
  let currencyType = ref('Fiat');
  const { initTagTreeList } = useTreeListStore();

  initTagTreeList();

  getCurrencyList.forEach((item) => {
    const type = isVirtualCurrency(item.id) ? 1 : 0;
    const tab = {
      key: item.id,
      name: item.name,
      apiMap: {
        PAGE_ID: item.id,
        PAGE_TYPE: item.name, // 类型
        columns: isVirtualCurrency(item.id) ? usdtcolumns : bankcolumns,
        schemas: searchFormSchema,
        modalType: type,
        listParams: {
          currency_id: item.id,
        },
        list: getPaymentMethodList, // 获取列表接口
        // delListItem: deleteMethod, // 删除接口
        // updateState: updateMethodState, //更新接口
      },
    };
    if (isVirtualCurrency(item.id)) currencySort.value['2'].push(item.id);
    else currencySort.value['1'].push(item.id);
    achieveList.value.push(tab);
  });

  activeKey.value = achieveList.value[0].key ?? '';

  const apiTableInstance = ref<any>(null);

  const currentCurrency = computed(() =>
    achieveList.value.find((item) => item.key == activeKey.value),
  );

  watch(currentCurrency, () => {
    apiTableInstance.value?.reload();
  });

  watchEffect(() => {
    currencyArrayList.value = count.currencyList;
    let type = 2;
    if (currencyType.value === 'Fiat') type = 1;
    currencyList.value = currencyArrayList.value.filter((el) => el.attr == type);
  });

  function handCurrency(type) {
    currencyType.value = type;
    if (type === 'Fiat') filterCurrency(1);
    else filterCurrency(2);
  }

  function filterCurrency(type) {
    currencyList.value = currencyArrayList.value.filter((el) => el.attr == type);
    if (currencyList.value.length > 0) activeKey.value = currencyList.value[0].id ?? '';
  }

  filterCurrency(1);

  // function filterCurrencyList(type) {
  //   currencyList.value = currencyArrayList.value.filter((el) => el.attr == type)
  // }

  async function moveCurrencyIds(val, type) {
    if (type === 'Fiat') {
      if (currencySort.value['1'] != val) {
        currencySort.value['1'] = val;
      } else {
        return false;
      }
    } else {
      if (currencySort.value['2'] != val) {
        currencySort.value['2'] = val;
      } else {
        return false;
      }
    }
    const { status, data } = await sortFinanceCurrency(currencySort.value);
    if (status) {
      currencyStore.initCurrencyList();
      message.success(data);
    } else {
      message.error(data);
    }
  }
</script>

<style lang="less" scoped>
  .pay-bottom {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }

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

  ::v-deep(.vben-basic-table) {
    padding: 0 !important;
    background-color: #f0f2f5 !important;

    form {
      background-color: #f0f2f5 !important;
    }
  }

  ::v-deep(.vben-basic-table-form-container) {
    background-color: #f0f2f5 !important;
  }

  ::v-deep(.ant-table-wrapper) {
    background-color: #f0f2f5 !important;
  }
</style>
