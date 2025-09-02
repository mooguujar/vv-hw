<template>
  <PageWrapper :contentStyle="{ margin: '10px', paddingLeft: '10px' }">
    <div class="tabs-header">
      <Tabs v-model:tabValue="tabValue" class="tabs capsule_tap">
        <!--汇总-->
        <TabPane :tab="$t('routes.commission.commissionCollect')" key="details">
          <CommissionSummary :name="tabValue" />
        </TabPane>
        <!--佣金明细-->
        <TabPane :tab="$t('routes.commission.commissionDetail')" key="summary">
          <CommissionDetails />
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts" name="CommissionRecordNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import CommissionDetails from './commissionDetails/index.vue';
  import CommissionSummary from './commissionSummary/index.vue';

  const tabValue = ref<string>('summary');
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
