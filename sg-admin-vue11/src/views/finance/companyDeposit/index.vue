<template>
  <ApiAuditTable :apiMap="apiMap" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import ApiAuditTable from '../common/component/table/ApiAuditTable.vue';
  import { RECHARGE_TYPE, AUDIT_TYPE, FINANCE_TYPE } from '../common/const';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    exportCompanyList,
    getFinanceCompanyDepositList,
    getFinanceCompanyDepositDetail,
    reviewFinanceCompanyDeposit,
  } from '/@/api/finance';
  import { columns } from './companyDeposit.data';

  const { t } = useI18n();
  export default defineComponent({
    name: 'CompanyDepositNocash',
    components: {
      ApiAuditTable,
    },
    setup() {
      const apiMap = {
        list: getFinanceCompanyDepositList, // 列表
        exportApi: exportCompanyList, // 导出api
        exportName: t('table.report.report_company_deposit'),
        listById: getFinanceCompanyDepositDetail, // 列表详情
        reviewApi: reviewFinanceCompanyDeposit, // 审核api
        PAGE_TYPE: RECHARGE_TYPE.COMPANY, // 页面类型
        AUDIT_TYPE: AUDIT_TYPE.DEPOSIT, // 审核类型
        FINANCE_TYPE: FINANCE_TYPE.COMPANY_DEPOSIT,
        tableParams: {}, // 列表额外参数
        columns: columns,
        title: t('table.report.report_company_deposit_list'),
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
