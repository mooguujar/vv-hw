<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
    <div class="tabs-header">
      <Tabs v-model:activeKey="tabValue" class="capsule_tap">
        <TabPane :tab="$t('table.risk.report_pending')" key="pending">
          <LowMultiplePending @on-click="toProcessed" />
        </TabPane>
        <TabPane :tab="$t('table.risk.report_processed')" key="processed">
          <LowMultipleProcessed :record="pendingRecord" />
        </TabPane>
        <TabPane :tab="$t('table.risk.report_ignored')" key="ignored">
          <LowMultipleIgnored />
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import LowMultipleProcessed from './components/LowMultipleProcessed/index.vue';
  import LowMultipleIgnored from './components/lowMultipleIgnored/index.vue';
  import LowMultiplePending from './components/lowMultiplePending/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const tabValue = ref<string>('pending');
  const pendingRecord = ref(null as any);
  const toProcessed = (record) => {
    tabValue.value = 'processed';
    nextTick(() => (pendingRecord.value = record));
  };
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px !important;
  }

  ::v-deep(.vben-basic-table-form-container) {
    padding: 0;
  }
</style>
