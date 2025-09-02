<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
    <Tabs v-model:tabValue="tabValue" class="capsule_tap">
      <TabPane :tab="t('routes.risk.link_records')" key="associated">
        <LinkRecordsassociated />
      </TabPane>
      <TabPane :tab="t('table.risk.report_gruel_record')" key="spenalty">
        <LinkRecordspenalty />
      </TabPane>
    </Tabs>
    <!-- <LinkRecordsassociated key="associated" v-else /> -->
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import LinkRecordsassociated from './components/linkRecordsassociated/index.vue';
  import LinkRecordspenalty from './components/linkRecordspenalty/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';

  const { t } = useI18n();
  const tabValue = ref<string>('associated');
</script>

<style lang="less" scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px !important;
  }

  ::v-deep(.vben-basic-table-form-container) {
    padding: 0;
  }
</style>
