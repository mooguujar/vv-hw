<template>
  <PageWrapper :contentStyle="{ margin: '10px', paddingLeft: '10px' }">
    <div class="tabs-header">
      <Tabs v-model:tabValue="tabValue" class="tabs capsule_tap">
        <!--汇总-->
        <TabPane :tab="t('routes.commission.commissionCollect')" key="details">
          <CommissionSummary :name="tabValue" />
        </TabPane>
        <!--佣金审核-->
        <TabPane :tab="t('routes.commission.commissionReview')" key="summary">
          <CommissionDetails />
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts" name="CommissionReviewNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import CommissionDetails from './commissionDetails/index.vue';
  import CommissionSummary from './commissionSummary/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const tabValue = ref<string>('summary');
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
  }

  ::v-deep(.vben-page-wrapper-content) {
    background-color: transparent !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    margin-bottom: 0;
    padding: 0;
    border-radius: 2px;
    background-color: transparent !important;
  }

  ::v-deep(.vben-basic-table),
  ::v-deep(.vben-basic-table-form-container),
  ::v-deep(.ant-table) {
    padding: 0 !important;
    background-color: transparent !important;
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

  ::v-deep(.ant-table-container) {
    margin-top: 13px;
  }

  ::v-deep(.ant-table .ant-table-container) {
    background-color: #fff !important;
  }
</style>
