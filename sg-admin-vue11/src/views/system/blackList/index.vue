<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
    <Tabs v-model:tabValue="tabValue" class="capsule_tap" :destroyInactiveTabPane="true">
      <template v-for="(item, index) in navList">
        <TabPane :key="item.label" :tab="item.label" v-if="item.ifShow">
          <component :is="item.component"
        /></TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts" name="BlackListNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import deviceBlacklist from './components/deviceBlacklist/index.vue';
  import emailBlackList from './components/emailBlackList/index.vue';
  import ipBlackList from './components/ipblackList/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const navList = [
    {
      label: t('table.risk.report_black_ip'), //IP黑名单
      key: 1,
      ifShow: true,
      component: ipBlackList,
    },
    {
      label: t('table.risk.report_device_black'), //设备黑名单
      key: 2,
      ifShow: true,
      component: deviceBlacklist,
    },
    {
      label: t('table.risk.report_email_black'), //邮箱黑名单
      key: 3,
      ifShow: true,
      component: emailBlackList,
    },
  ];
  const tabValue = ref<string>('default');
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px !important;
  }
</style>
