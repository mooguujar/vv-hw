<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable">
      <template #summary>
        <TableSummary fixed>
          <TableSummaryRow>
            <TableSummaryCell class="text-center" :index="0">{{
              t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="1">{{
              totalgameListByGame.game_name ? totalgameListByGame.game_name : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="2">{{
              totalgameListByGame.member_count ? totalgameListByGame.member_count : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="3">{{
              totalgameListByGame.bet_count ? totalgameListByGame.bet_count : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="4">
              {{
                totalgameListByGame.bet_count_proportion
                  ? `${mul(totalgameListByGame.bet_count_proportion, 100)}%`
                  : '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="5">{{
              totalgameListByGame.bet_amount ? totalgameListByGame.bet_amount : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="6">{{
              totalgameListByGame.valid_bet_amount ? totalgameListByGame.valid_bet_amount : '-'
            }}</TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :class="[totalgameListByGame.net_amount > 0 ? 'text-[#E91134]' : 'text-[#1CD91C]']"
              :index="7"
              >{{
                totalgameListByGame.net_amount ? totalgameListByGame.net_amount : '-'
              }}</TableSummaryCell
            >
            <TableSummaryCell
              class="text-center"
              :index="8"
              :class="[totalgameListByGame.profit_rate > 0 ? 'text-[#E91134]' : 'text-[#1CD91C]']"
              >{{
                totalgameListByGame.profit_rate ? `${totalgameListByGame.profit_rate}%` : '-'
              }}</TableSummaryCell
            >
          </TableSummaryRow>
        </TableSummary>
      </template>
      <template #currency="{ record }">
        <div>
          <cdIconCurrency :icon="currencyName(record?.currency_id)" class="w-20px mr-3px" />
          {{ currencyName(record?.currency_id) }}
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema } from './index.data';
  import { TableSummary, TableSummaryRow, TableSummaryCell } from 'ant-design-vue';
  import { getGameListByGame } from '/@/api/report/index';
  import { add, mul } from '/@/utils/number';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  const totalgameListByGame = ref({} as any);
  const { currencyAllTreeList } = useTreeListStore();
  const currentList = ref([...currencyAllTreeList] as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);

  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: async (data) => {
      try {
        const response = await getGameListByGame(data);
        const getGameListByGameList = response.filter((item) => {
          if (item.platform_id === '0') {
            //后台的uid会有空的情况
            totalgameListByGame.value = item;
          } else {
            return true;
          }
        });
        return getGameListByGameList;
      } catch (error) {
        return [];
      }
    },
    resizeHeightOffset: 40,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      showResetButton: false,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
        // xxl: 1,
        // xl: 1,
        // lg: 1,
      },
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
    beforeFetch: (param) => {
      param['start_time'] = history.state.start_time;
      param['end_time'] = history.state.end_time;
      param['currency_id'] = history.state.currency_id;
      param['platform_id'] = history.state.platform_id;
      param['username'] = history.state.username;
      param['parent_name'] = history.state.parent_name;
      param['sort_key'] = sortKey.value ? sortKey.value : 'valid_bet_amount';
      param['sort_type'] = sortType.value ? sortType.value : 'desc';
      return param;
    },
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    useSearchForm: true,
  });
  function currencyName(id) {
    let currencyName = currentList.value.filter((c) => c.id === id)[0].name;
    return currencyName;
  }
</script>
<style lang="less" scoped>
  .red {
    color: #e91134;
  }

  .green {
    color: #1cd91c;
  }
</style>
