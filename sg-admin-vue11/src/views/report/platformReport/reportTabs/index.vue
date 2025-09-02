<template>
  <PageWrapper :contentStyle="{ margin: '0px' }" class="rounded-lg">
    <template #title>
      <div>
        <span>{{ setTitleHeader }}</span>
        <span v-if="setTitleType"
          ><cdIconCurrency :icon="setTitleFooter" class="w-22px mt--5px mr-1 ml-1"
        /></span>
        <span>{{ setTitleFooter }}</span>
      </div>
    </template>
    <Tabs v-model:tabValue="tabValue" class="tabs capsule_tap">
      <TabPane :tab="$t('table.report.report_for_member')" key="username">
        <MemberReport :historyData="historyData" />
      </TabPane>
      <TabPane :tab="$t('table.report.report_for_game')" key="game">
        <GameReport />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts" setup name="GameReport">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import MemberReport from './memberReport/index.vue';
  import GameReport from './gameReport/index.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { getAllCurrencyList } = useCurrencyStore();
  const tabValue = ref<string>('username');
  const setTitleHeader = ref<string>('');
  const setTitleFooter = ref<string>('');
  const currency = ref<string>('');
  const historyData = ref<any>({});
  const setTitleType = ref<string>('');
  const { t } = useI18n();

  const getCurrencyName = (currency_id) => {
    const itemFind = getAllCurrencyList?.find((item) => {
      return item?.id == currency_id;
    });
    const styleName = itemFind?.label || '-';
    return styleName;
  };
  currency.value = history.state.currency_id
    ? getCurrencyName(history.state.currency_id)
    : t('table.member.member_money_all');
  setTitleType.value = history.state.currency_id ? getCurrencyName(history.state.currency_id) : '';
  setTitleHeader.value = `${history.state.platform_name}-`;
  setTitleFooter.value = currency.value;
  historyData.value = history.state;
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .tabs {
    border-radius: 3px;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }
</style>
<style lang="less" scoped>
  ::v-deep(.ant-page-header) {
    padding-top: 10px;
    background-color: transparent;
  }

  ::v-deep(.ant-page-header-back) {
    margin-right: 15px;

    div svg {
      display: none;
    }

    div::after {
      content: ' ';
      display: inline-block;
      width: 9.1px;
      height: 14px;
      background: no-repeat;
      background-image: url('/@/assets/images/btn-left.webp');
      background-size: 100%;
      vertical-align: middle;
    }
  }
</style>
