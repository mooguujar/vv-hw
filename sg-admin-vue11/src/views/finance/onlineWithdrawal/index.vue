<template>
  <ApiAuditTable :apiMap="apiMap" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { WITHDRAWAL_TYPE, AUDIT_TYPE, FINANCE_TYPE } from '../common/const';
  import { columns } from './onlineWithdrawal.data';
  import ApiAuditTable from '../common/component/table/ApiAuditTable.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    exportWithdrawList,
    getFinanceWithdrawList,
    getFinanceWithdrawDetail,
    reviewFinanceWithdraw,
  } from '/@/api/finance';

  export default defineComponent({
    name: 'OnlineWithdrawalNocash',
    components: {
      ApiAuditTable,
    },
    setup() {
      const { t } = useI18n();
      const apiMap = {
        list: getFinanceWithdrawList, // 列表
        exportApi: exportWithdrawList, // 导出api
        exportName: t('routes.finance.online_withdrawal'),
        listById: getFinanceWithdrawDetail, // 列表详情
        reviewApi: reviewFinanceWithdraw, // 审核api
        PAGE_TYPE: WITHDRAWAL_TYPE.ONLINE, // 页面类型
        AUDIT_TYPE: AUDIT_TYPE.WITHDRAWAL, // 审核类型
        FINANCE_TYPE: FINANCE_TYPE.ONLINE_WITHDRAWAL,
        tableParams: {}, // 列表额外参数
        columns: columns,
        title: t('table.report.report_online_withdrawal_list'),
        modelTitle: t('business.common_disbursement_approval'),
      };

      return {
        apiMap,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }
</style>
