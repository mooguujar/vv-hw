<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
    <Tabs v-model:tabValue="tabValue" class="capsule_tap">
      <TabPane :tab="t('routes.discountActivity.interest')" key="interest">
        <Interest />
      </TabPane>
      <TabPane :tab="t('table.discountActivity.discount_ebao_detail')" key="details">
        <Details />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts" setup name="InterestTreasurNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import Details from './components/details/index.vue';
  import Interest from './components/interest/index.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { getAllCurrencyList } = useCurrencyStore();
  const tabValue = ref<string>('interest');
  const setTitle = ref<string>('');
  const currency = ref<string>('');
  const getCurrencyName = (currency_id) => {
    const itemFind = getAllCurrencyList?.find((item) => {
      return item.id == currency_id;
    });
    const styleName = itemFind?.label || '-';
    return styleName;
  };
  currency.value = history.state.currency_id ? getCurrencyName(history.state.currency_id) : '币种';
  setTitle.value = `${history.state.platform_name} ${currency.value}总览`;
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px;
  }
</style>
