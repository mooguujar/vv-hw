<template>
  <BasicModal
    :title="$t('table.member.member_apply_number') + '( ' + tableTitle + ' )'"
    :width="600"
    :height="652"
    :showCancelBtn="false"
    :showOkBtn="false"
    :scroll="{ x: false }"
    @register="registerDatails"
  >
    <BasicTable :columns="getColumns" class="inProcessNowClass" @register="registerTable">
      <template #summary>
        <TableSummary fixed>
          <TableSummaryRow>
            <TableSummaryCell style="background-color: white" :index="0">
              <div style="text-align: center !important">{{ $t('business.common_total') }}</div>
            </TableSummaryCell>
            <TableSummaryCell style="background-color: white" v-if="+ty !== 2" :index="1">
              <div style="text-align: center !important">{{ from_currency_name }}</div>
            </TableSummaryCell>
            <TableSummaryCell style="background-color: white" v-if="+ty !== 2" :index="2">
              <div style="text-align: center !important">{{
                detail_total.from_bonus_amount || '-'
              }}</div>
            </TableSummaryCell>
            <TableSummaryCell style="background-color: white" :index="3">
              <div style="text-align: center !important">
                <cdBlockCurrency :currencyName="currency_name" />
              </div>
            </TableSummaryCell>
            <TableSummaryCell style="background-color: white" :index="4">
              <div style="text-align: center !important">{{
                detail_total.bonus_amount || '-'
              }}</div>
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, agentappliColumns } from './AppliNumMadel.data';
  import { TableSummary, TableSummaryRow, TableSummaryCell } from 'ant-design-vue';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

  defineEmits(['register']);
  const tableData = ref([] as any);
  const tableTitle = ref('' as any);
  const detail_total = ref({});
  const currency_name = ref();
  const from_currency_name = ref();
  const ty = ref();
  const getColumns = computed(() => (+ty.value === 2 ? agentappliColumns : columns));

  const [registerTable] = useTable({
    dataSource: tableData,
    showIndexColumn: false,
    bordered: true,
    pagination: false,
  });

  const [registerDatails] = useModalInner((data) => {
    ty.value = data.ty;
    tableTitle.value = data.username;
    data && onDataReceive(data);
  });

  function onDataReceive(data) {
    detail_total.value = data.detail_total;
    currency_name.value = currentyOptions[data.currency_id];
    from_currency_name.value = currentyOptions[data.from_currency_id];
    tableData.value = JSON.parse(data.detail).bonus.map((item: any) => ({
      ...item,
      bonus_currency_id: '706',
      currency_id: data.currency_id,
    }));
  }
</script>
<style lang="scss" scoped>
  .inProcessNowClass {
    ::v-deep(.ant-table-summary) {
      background-color: #f0f0f0;
    }
  }
</style>
