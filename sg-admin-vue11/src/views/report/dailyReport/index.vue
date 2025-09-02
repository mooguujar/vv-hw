<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable daily-report">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
      <template #tableTitle>
        <div class="w-full">
          <cdButtonCurrency
            :btn-list="currentList"
            @change-button-currency="changeClick"
            v-model="currency_id"
          />
        </div>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #summary>
        <TableSummary>
          <TableSummaryRow>
            <TableSummaryCell class="text-center" :index="0">{{
              t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="1">{{
              totalDayReport.time || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="2">{{
              totalDayReport.reg_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="3">{{
              totalDayReport.first_deposit_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="4">{{
              totalDayReport.first_deposit_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="5">{{
              totalDayReport.first_deposit_rate ? `${totalDayReport.first_deposit_rate}%` : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="6">{{
              totalDayReport.first_deposit_amount_per || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="7">{{
              totalDayReport.commission_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="8">{{
              totalDayReport.commission_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="9">{{
              totalDayReport.gift_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="10">{{
              totalDayReport.gift_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="11"
              :class="[totalDayReport.gift_rate > 0 ? 'text-red' : 'text-green']"
              >{{
                totalDayReport.gift_rate ? `${totalDayReport.gift_rate}%` : '-'
              }}</TableSummaryCell
            >
            <TableSummaryCell class="text-center" :index="12">{{
              totalDayReport.valid_bet_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="13">{{
              totalDayReport.bet_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="14">{{
              totalDayReport.net_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="15"
              :class="[totalDayReport.kill_rate > 0 ? 'text-red' : 'text-green']"
              >{{
                totalDayReport.kill_rate ? `${totalDayReport.kill_rate}%` : '-'
              }}</TableSummaryCell
            >
            <TableSummaryCell class="text-center" :index="16">{{
              totalDayReport.bet_multiplier || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="17">{{
              totalDayReport.deposit_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="18">{{
              totalDayReport.deposit_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="19">{{
              totalDayReport.withdraw_amount || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="20">{{
              totalDayReport.withdraw_user_count || '-'
            }}</TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="21"
              :class="[totalDayReport.cash_profit > 0 ? 'text-red' : 'text-green']"
              >{{ totalDayReport.cash_profit || '-' }}</TableSummaryCell
            >
            <TableSummaryCell
              class="text-center"
              :index="22"
              :class="[totalDayReport.cash_profit_rate > 0 ? 'text-red' : 'text-green']"
              >{{
                totalDayReport.cash_profit_rate ? `${totalDayReport.cash_profit_rate}%` : '-'
              }}</TableSummaryCell
            >
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup name="DailyReportNocash">
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { PageWrapper } from '/@/components/Page';
  import { exportReportDay, getDayReportList } from '/@/api/report/index';
  import { TableSummary, TableSummaryRow, TableSummaryCell, DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { isHasAuth } from '@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(400).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const totalDayReport = ref({} as any);
  const isSelect = ref('month' as string);
  const currency_id = ref('' as string);
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const { currencyTreeList } = useTreeListStore();
  const { exportFile } = useExportFile();

  const [registerTable, { reload, getForm }] = useTable({
    api: async (data) => {
      try {
        totalDayReport.value = {};
        const { d, n } = await getDayReportList(data);
        const dayReportList = d.filter((item) => {
          if (item.time == 0) {
            totalDayReport.value = item;
          } else {
            return true;
          }
        });
        if (n && !currency_id.value) {
          currentList.value = [
            { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
          ].concat(currencyTreeList.filter((item) => n.includes(item.id)));
        }
        return dayReportList;
      } catch (error) {
        return [];
      }
    },
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
      },
      customClassForm: true,
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showAdvancedButton: false, //是否收起
      showResetButton: isHasAuth('50401'), //导出按钮隐藏
      resetFunc: handleExportTableList,
    },
    beforeFetch: (params) => {
      processingParams(params);
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
    immediate: false,
  });

  function processingParams(params) {
    params['sort_key'] = sortKey.value ? sortKey.value : 'time';
    params['sort_type'] = sortType.value ? sortType.value : 'desc';
    params.start_time = dayjs(params.time[0]).format('YYYY-MM-DD');
    params.end_time = dayjs(params.time[1]).format('YYYY-MM-DD');
    delete params.time;
    params['currency_id'] = currency_id.value;
  }

  const disabledStartDate = (date: number) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time ? model.value.end_time.valueOf() : null;
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
  };

  const disabledEndDate = (date: number) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      model.value.start_time = value[0];
      model.value.end_time = value[1];
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      processingParams(param);
      await exportFile(exportReportDay, param, t('routes.report.dailyReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }

  .currentListGroup {
    ::v-deep(.ant-radio-button-wrapper:first-child) {
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      border-left-width: 1px;
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      border-left-width: 1px;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px;
      border-left-width: 1px solid #d9d9d9;
      text-align: center;
    }
  }
</style>
