<template>
  <PageWrapper :contentStyle="{ margin: '10px', paddingLeft: '10px' }">
    <div class="tabs-header">
      <Tabs v-model:tabValue="tabValue" class="tabs capsule_tap" @change="changeCodeTab">
        <!--兑换码-->
        <TabPane :tab="t('common.redeemCode')" key="details">
          <CommissionDetails :currencyList="currencyList" :key="childKey" v-if="!Object.keys(detailExchangeCode).length" @reload="init(1)" />
          <exchangeCodeDetails v-else></exchangeCodeDetails>
        </TabPane>
        <!--已过期-->
        <TabPane :tab="t('table.system.system_expired')" key="summary">
          <CommissionSummary :name="tabValue" :key="childKey" :currencyList="currencyData" v-if="!Object.keys(detailCodeExchange).length" />
          <exchangeCodeDetails v-else></exchangeCodeDetails>
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts" name="codeExpired">
  import { ref, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import CommissionDetails from './exchangeCode/index.vue';
  import CommissionSummary from './codeExpired/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getExchangeCurrency } from '@/api/activity';
  import exchangeCodeDetails from './exchangeCodeDetails/index.vue';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();
  const { setDetailExchangeCode, setDetailCodeExchange, setOnePageData, setOnePageList } = useUserStore();
  const store = useUserStore();
  const detailExchangeCode = computed(() => store.detailExchangeCode);
  const detailCodeExchange = computed(() => store.detailCodeExchange);
  const tabValue = ref<string>('summary');
  const currencyList = ref([] as any);
  const currencyData = ref([] as any);
  const childKey = ref(0 as number);
  const changeCodeTab = async (str) => {
    setDetailExchangeCode({});
    setDetailCodeExchange({});
    setOnePageData({});
    setOnePageList({});
    if (str === 'details') {
      init(1); // 正常
    } else {
      init(2); // 已过期
    }
  };
  const init = async (state) => {
    currencyList.value = [];
    currencyData.value = [];
    childKey.value++;
    let res = await getExchangeCurrency({
      state: state,
    });
    if (!res) return;
    if (state === 1) {
      currencyList.value = res?.map((item) => {
        return {
          name: item,
          value: item,
          label: item,
        };
      });
    } else {
      currencyData.value = res?.map((item) => {
        return {
          name: item,
          value: item,
          label: item,
        };
      });
    }
  };
  init(1);
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    margin-bottom: 0;
    padding: 0 !important;
    border-radius: 2px;
  }

  ::v-deep(.ant-tabs-content > div > div) {
    padding: 0 !important;

    form {
      margin: 0 !important;
    }
  }

  ::v-deep(.ant-table-wrapper .ant-table-title) {
    padding: 0 !important;
    border: 1px solid #e1e1e1 !important;
  }

  ::v-deep(.ant-table) {
    border: 1px solid #e1e1e1 !important;
  }

  ::v-deep(.ant-form-item-control-input-content) {
    .ant-radio-button-wrapper {
      border-radius: 4px !important;
      box-shadow: none !important;
    }

    .ant-radio-button-wrapper:not(:last-child) {
      margin-right: 4px;
    }

    .ant-radio-button-wrapper:not(:first-child)::before {
      height: calc(100% - 4px);
      margin-top: 2px;
      margin-left: 1px;
    }
  }
</style>
