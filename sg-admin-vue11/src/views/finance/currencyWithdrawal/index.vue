<template>
  <ApiAuditTable :apiMap="apiMap" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { WITHDRAWAL_TYPE, AUDIT_TYPE, FINANCE_TYPE } from '../common/const';
  import { columns } from './currencyWithdrawal.data';
  import ApiAuditTable from '../common/component/table/ApiAuditTable.vue';

  import {
    exportcoinWithdrawList,
    getFinanceCoinWithdrawList,
    getFinanceCoinWithdrawDetail,
    reviewFinanceCoinWithdraw,
  } from '/@/api/finance';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'CurrencyWithdrawalNocash',
    components: {
      ApiAuditTable,
    },
    setup() {
      const apiMap = {
        list: getFinanceCoinWithdrawList, // 列表
        exportApi: exportcoinWithdrawList, // 导出api
        exportName: t('table.report.report_currency_withdraw'),
        listById: getFinanceCoinWithdrawDetail, // 列表详情
        reviewApi: reviewFinanceCoinWithdraw, // 审核api
        PAGE_TYPE: WITHDRAWAL_TYPE.CURRENCY, // 页面类型
        AUDIT_TYPE: AUDIT_TYPE.WITHDRAWAL, // 审核类型
        FINANCE_TYPE: FINANCE_TYPE.CURRENCY_WITHDRAWAL,
        tableParams: {}, // 列表额外参数
        columns: columns,
        title: t('table.report.report_currency_withdraw_list'),
        modelTitle: t('modalForm.finance.finance_withdrawal_detail'),
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
