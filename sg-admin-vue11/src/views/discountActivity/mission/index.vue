<template>
  <PageWrapper :contentStyle="{ marginTop: '10px' }" class="LayoutTable">
    <Tabs v-model:activeKey="tabValue" @change="tabValueChange" class="capsule_tap">
      <template v-for="item in navList">
        <TabPane :key="item.key" v-if="item.id">
          <template #tab>
            <span>{{ item.label }}</span>
          </template>
          <component :is="item.component" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import closeMissionList from './components/closeMissionList/index.vue';
  import allMissionList from './components/allMissionList/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  /** 任务列表\进行中任务\已关闭任务 */
  const navList = [
    {
      label: t('table.discountActivity.mission_activity_list'), //任务列表
      key: 1,
      id: '40601',
      component: allMissionList,
    },
    {
      label: t('table.discountActivity.mission_examine'),
      id: '40603',
      key: 3,
      component: closeMissionList,
    },
  ];

  const tabValue = ref<any>(1);

  const tabValueChange = (e) => {};
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px !important;
  }

  ::v-deep(.vben-page-wrapper-content) {
    margin: 10px;
  }
</style>
