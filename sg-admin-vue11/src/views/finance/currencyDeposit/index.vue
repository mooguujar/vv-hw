<template>
  <ApiAuditTable :apiMap="apiMap" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { RECHARGE_TYPE, AUDIT_TYPE, FINANCE_TYPE } from '../common/const';
  import { columns } from './currencyDeposit.data';
  import ApiAuditTable from '../common/component/table/ApiAuditTable.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    exportDepositOnlineList,
    getFinanceCoinDepositList,
    getFinanceCoinDepositDetail,
    reviewFinanceCoinDeposit,
  } from '/@/api/finance';

  const { t } = useI18n();
  export default defineComponent({
    name: 'CurrencyDepositNocash',
    components: {
      ApiAuditTable,
    },
    setup() {
      const apiMap = {
        list: getFinanceCoinDepositList, // 列表
        exportApi: exportDepositOnlineList, // 导出api
        exportName: t('table.report.report_currency_deposit'),
        listById: getFinanceCoinDepositDetail, // 列表详情
        reviewApi: reviewFinanceCoinDeposit, // 审核api
        PAGE_TYPE: RECHARGE_TYPE.CURRENCY, // 页面类型
        AUDIT_TYPE: AUDIT_TYPE.DEPOSIT, // 审核类型
        FINANCE_TYPE: FINANCE_TYPE.CURRENCY_DEPOSIT,
        tableParams: {}, // 列表额外参数
        columns: columns,
        title: t('table.report.report_currency_deposit_list'),
        modelTitle: t('modalForm.finance.finance_common_income'), //入款详情
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
