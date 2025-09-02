<template>
  <PageWrapper :contentStyle="{ margin: '10px', paddingLeft: '10px' }">
    <Tabs v-model:tab-value="tabValue" class="tabs capsule_tap" :destroyInactiveTabPane="true">
      <TabPane v-for="item in navList" :tab="item.label" :key="item.key">
        <component :is="item.component" :tabValue="item.key" />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts" name="DomainNameManageNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { navList } from './index.data';
  import { Tabs, TabPane } from 'ant-design-vue';

  const tabValue = ref<number>(1);
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding-left: 0 !important;
    padding-top: 0 !important;
  }

  ::v-deep(.ant-form-item-control-input-content) {
    .ant-btn {
      float: left;
    }
  }

  ::v-deep(.ant-btn-error) {
    position: absolute;
    //left: 0;
    bottom: 0;
  }

  ::v-deep(.anticon-copy) {
    margin-top: 0;
  }

  ::v-deep(.anticon-copy::before) {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('/@/assets/images/copy_addBlacklist.webp');
    background-size: 100%;
  }

  ::v-deep(.anticon-copy > svg) {
    display: none;
  }

  ::v-deep(.anticon-redo) {
    margin-top: 0;
  }

  ::v-deep(.anticon-redo::before) {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('/@/assets/images/redo_addBlacklist.webp');
    background-size: 100%;
  }

  ::v-deep(.anticon-redo > svg) {
    display: none;
  }

  ::v-deep(.ant-radio-button-wrapper-checked) {
    box-shadow: none !important;
  }
</style>
