<template>
  <div>
    <ApiConfigTable :apiMap="apiMap" />
  </div>
</template>

<script setup lang="ts">
  import ApiConfigTable from '../common/component/table/ApiConfigTable.vue';
  import { columns, getWithdrawForm } from './withdrawalConfig.data';
  import { deleteSetting, getSettingList } from '/@/api/finance';
  import { useMemberStore } from '/@/store/modules/member';

  const memberStore = useMemberStore();
  // 获取VIP等级下拉
  memberStore.getLevelList();

  const apiMap = {
    exportApi: '',
    exportName: '',
    listById: '',
    columns: columns,
    schemas: getWithdrawForm,
    addName: 'AddWithdrawalConfig',
    list: getSettingList,
    delListItem: deleteSetting,
    modalType: 'add',
  };
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }
</style>
