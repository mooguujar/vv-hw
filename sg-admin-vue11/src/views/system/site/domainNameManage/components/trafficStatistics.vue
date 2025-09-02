<template>
  <div class="flex">
    <ApiTable :apiMap="apiMap" />
  </div>
</template>

<script lang="ts" setup>
  import { columns } from './trafficStatistics.data';
  import ApiTable from '../common/apiTable.vue';

  const apiMap = {
    // list: getFinanceCompanyDepositList, // 列表
    // exportApi: exportRechargeList, // 导出api
    // exportName: '公司入款',
    // listById: getFinanceCompanyDepositDetail, // 列表详情
    // reviewApi: reviewFinanceCompanyDeposit, // 审核api
    // PAGE_TYPE: RECHARGE_TYPE.COMPANY, // 页面类型
    // AUDIT_TYPE: AUDIT_TYPE.DEPOSIT, // 审核类型
    // FINANCE_TYPE: FINANCE_TYPE.COMPANY_DEPOSIT,
    // tableParams: {}, // 列表额外参数
    columns: columns,
    formHide: false,
    // title: '公司入款列表',
    // modelTitle: '入款详情',
  };
</script>
