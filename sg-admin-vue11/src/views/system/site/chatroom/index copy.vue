<template>
  <PageWrapper :contentStyle="{ margin: '10px' }">
    <Tabs v-model:activeKey="tabValue" class="tabs" :destroyInactiveTabPane="true">
      <TabPane v-for="(item, index) in navList" :tab="item.label" :key="index">
        <component :is="chatTable" ref="componentRef" :lang="item.lang" />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts" name="SiteSettings">
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import chatTable from './chatTable.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref } from 'vue';

  const { t } = useI18n();

  const navList = [
    {
      label: t('common.common_zh_CN'),
      key: 1,
      lang: 'zh_CN',
    },
    {
      label: t('common.langEn'),
      key: 2,
      lang: 'en_US',
    },
    {
      label: t('common.LangVetnam'),
      key: 3,
      lang: 'vi_VN',
    },
    {
      label: t('common.LangPt'),
      key: 4,
      lang: 'pt_BR',
    },
    {
      label: t('common.LangIndia'),
      key: 5,
      lang: 'hi_IN',
    },
    {
      label: t('common.common_th_TH'),
      key: 6,
      lang: 'th_TH',
    },
  ];

  const tabValue: any = ref(1);
</script>
<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }
</style>
