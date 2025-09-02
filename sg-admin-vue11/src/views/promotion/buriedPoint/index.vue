<template>
  <PageWrapper>
    <Tabs v-model:tabValue="tabValue" class="tabs capsule_tap" :destroyInactiveTabPane="true">
      <TabPane v-for="(item, index) in navList" :tab="item.label" :key="index">
        <component :is="item.component"
      /></TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts" name="BuriedPointNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import GoogleBuriedPoint from './components/googleBuriedPoint/index.vue';
  import FbMetaPixel from './components/FbMetaPixel/index.vue';
  import KwaiPixel from './components/KwaiPixel/index.vue';
  import TikTokPixel from './components/TikTokPixel/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const navList = [
    {
      label: t('table.promotion.promotion_burial_point'),
      key: 1,
      component: GoogleBuriedPoint,
    },
    {
      label: 'Facebook/Meta Pixel',
      key: 2,
      component: FbMetaPixel,
    },
    {
      label: 'Kwai Pixel',
      key: 3,
      component: KwaiPixel,
    },
    {
      label: 'TikTok Pixel',
      key: 4,
      component: TikTokPixel,
    },
  ];
  const tabValue = ref<string>('default');
</script>
<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    //background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 4px !important;
  }
</style>
