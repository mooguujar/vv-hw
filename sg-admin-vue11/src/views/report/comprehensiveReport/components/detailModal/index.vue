<template>
  <div>
    <BasicModal
      :width="1200"
      :title="title"
      :currencyId="currency_id"
      :showOkBtn="false"
      :showCancelBtn="false"
      @register="registerModal"
      :destroyOnClose="true"
    >
      <BasicTable @register="registerTable">
        <template #summary>
          <TableSummary v-if="summaryList.length > 0" fixed>
            <TableSummaryRow>
              <template v-for="(rowItem, index) of currentModal" :key="index">
                <TableSummaryCell class="!text-center" :index="index">{{
                  summaryList[0]?.[rowItem] ? summaryList[0]?.[rowItem] : '-'
                }}</TableSummaryCell>
              </template>
            </TableSummaryRow>
            <TableSummaryRow>
              <template v-for="(rowItem, index) of currentModal" :key="index">
                <TableSummaryCell class="!text-center" :index="index">{{
                  summaryList[1]?.[rowItem] ? summaryList[1]?.[rowItem] : '-'
                }}</TableSummaryCell>
              </template>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getColumnsFun } from './index.data.ts';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableSummary, TableSummaryCell, TableSummaryRow } from 'ant-design-vue';
  import { setDateParmas } from '/@/utils/dateUtil';
  import { getDataOverviewDetailList } from '/@/api/report';

  const { t } = useI18n();
  const totalObj = {
    first_deposit: [
      'username',
      '-',
      '-',
      '-',
      'first_day_deposit',
      'withdraw_amount',
      'cash_profit',
      '-',
    ],
    deposit: [
      'username',
      '-',
      '-',
      '-',
      'online_deposit_amount',
      'wallet_deposit_amount',
      'virtual_deposit_amount',
      'offline_deposit_amount',
      'coin_deposit_amount',
      'admin_deposit_amount',
      'lost_deposit_amount',
      'deposit_amount',
    ],
    withdraw: [
      'username',
      '-',
      '-',
      '-',
      'online_withdraw_amount',
      'coin_withdraw_amount',
      'auto_withdraw_amount',
      'admin_withdraw_amount',
      'error_withdraw_amount',
      'withdraw_amount',
    ],
    cash_profit: [
      'username',
      '-',
      '-',
      '-',
      'deposit_amount',
      'withdraw_amount',
      'cash_profit',
      'valid_bet_amount',
      'bet_multiplier',
    ],
    commission: [
      'username',
      '-',
      '-',
      'valid_bet_amount_total',
      'valid_bet_amount_direct',
      'commission_amount_other',
      'commission_amount_total',
    ],
  };
  const title = ref('' as string);
  const start_time = ref();
  const end_time = ref();
  const item = ref();
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const currency_id = ref();
  const summaryList = ref([]);
  const currentModal = ref([]);
  const [registerModal] = useModalInner(async (data) => {
    start_time.value = data.start_time;
    end_time.value = data.end_time;
    item.value = data.type;
    currentModal.value = totalObj[data.type];
    currency_id.value = data.currency_id;
    setColumns(getColumnsFun(data.type));
    title.value = `${data.name}｜ ${currency_id.value ? '' : t('table.member.member_money_all')}`;
  });

  const [registerTable, { setColumns }] = useTable({
    api: async (data) => {
      const res = await getDataOverviewDetailList(data);
      if (res.c) {
        summaryList.value = res.c;
      }
      delete res.c;
      return res;
    },

    showIndexColumn: false,
    bordered: true,
    maxHeight: 450,
    pagination: true,
    beforeFetch: async (params) => {
      params['start_time'] = start_time.value;
      params['end_time'] = end_time.value;
      params['item'] = item.value;
      params['sort_key'] = sortKey.value;
      params['sort_type'] = sortType.value;
      params['currency_id'] = currency_id.value;
      setDateParmas(params);
      return params;
    },
    afterFetch: () => {
      sortKey.value = '';
      sortType.value = '';
    },

    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-wrapper .ant-table-title) {
    min-height: 0 !important;
  }

  ::v-deep(.ant-table > .ant-table-footer) {
    padding: 0 !important;
  }
</style>
