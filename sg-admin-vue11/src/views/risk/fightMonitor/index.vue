<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
    <Tabs v-model:activeKey="tabValue" class="capsule_tap">
      <TabPane :tab="t('table.risk.report_pending')" key="pending">
        <ProfitListPending @on-click="toPending" />
      </TabPane>
      <TabPane :tab="t('table.risk.report_processed')" key="processed">
        <ProfitListProcessed :record="pendingRecord" />
      </TabPane>
      <TabPane :tab="t('table.risk.report_ignored')" key="ignored">
        <ProfitListIgnored />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import ProfitListPending from './components/profitListPending/index.vue';
  import ProfitListProcessed from './components/profitListProcessed/index.vue';
  import ProfitListIgnored from './components/profitListIgnored/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGameSortStore } from '/@/store/modules/gameSort';

  const { t } = useI18n();
  const tabValue = ref<string>('pending');
  const pendingRecord = ref(null as any);
  const toPending = (record) => {
    tabValue.value = 'processed';
    nextTick(() => (pendingRecord.value = record));
  };

  const gameSortStore = useGameSortStore();
  gameSortStore.setgame_typeList(); //调用游戏类型接口
</script>

<style lang="less" scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px !important;
  }

  ::v-deep(.vben-basic-table-form-container) {
    padding: 0;
  }

  ::v-deep(.ant-table > div:first-child) {
    padding-bottom: 0 !important;
    border: 1px solid red !important;
  }
</style>
