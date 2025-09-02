import { FormSchema } from '/@/components/Table';
import { useTreeListStore } from '/@/store/modules/treeList';
import { toTimezone } from '/@/utils/dateUtil';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import TableTooltip from '@/views/report/comprehensiveReport/components/tableTooltip/TableTooltip.vue';
import { h, ref } from 'vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const i18n = useI18n();
const { t } = i18n;
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});

const renderTableTooltip = (column, record, tableType, colType, moneyNum, peopleNum = '') => {
  return h(TableTooltip, {
    record,
    column,
    tableType,
    colType: colType,
    moneyNum: moneyNum,
    peopleNum,
  });
};

//报表管理-存款分类
export const columnsDeposit = [
  {
    title: t('business.common_count_date'),
    dataIndex: 'time',
    width: 120,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('table.report.deposit_amount'),
    dataIndex: 'deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    width: 180,
    customCell: (record) => {
      if (record.deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'deposit', 'deposit_amount', 'deposit_count'),
  },
  {
    title: t('table.report.report_online_pay'),
    dataIndex: 'online_deposit_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.online_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) => {
      return renderTableTooltip(
        column,
        record,
        1,
        'online',
        'online_deposit_amount',
        'online_deposit_count',
      );
    },
  },
  {
    title: t('table.report.report_wallet_pay'),
    dataIndex: 'wallet_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    width: 180,
    customCell: (record) => {
      if (record.wallet_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) => {
      return renderTableTooltip(
        column,
        record,
        1,
        'wallet',
        'wallet_deposit_amount',
        'wallet_deposit_count',
      );
    },
  },
  {
    title: t('table.report.report_virtual_pay'),
    dataIndex: 'virtual_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    width: 180,
    customCell: (record) => {
      if (record.virtual_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) => {
      return renderTableTooltip(
        column,
        record,
        1,
        'virtual',
        'virtual_deposit_amount',
        'virtual_deposit_count',
      );
    },
  },
  {
    title: t('table.report.report_company_deposit'),
    dataIndex: 'offline_deposit_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.offline_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'offline',
        'offline_deposit_amount',
        'offline_deposit_count',
      ),
  },
  {
    title: t('table.report.report_currency_deposit'),
    dataIndex: 'coin_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    width: 180,
    customCell: (record) => {
      if (record.coin_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },

    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'coin', 'coin_deposit_amount', 'coin_deposit_count'),
  },
  {
    title: t('table.report.manual_deposit'),
    dataIndex: 'admin_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    width: 180,
    customCell: (record) => {
      if (record.admin_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    //width: 120,
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'admin', 'admin_deposit_amount', 'admin_deposit_count'),
  },
  {
    title: t('table.report.deposit_order_lost'),
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'lost_deposit_amount',
    customCell: (record) => {
      if (record.lost_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    width: 180,
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'lost', 'lost_deposit_amount', 'lost_deposit_count'),
  },
  {
    title: t('table.report.test_deposit_amount'),
    dataIndex: 'test_deposit_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.test_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'test', 'test_deposit_amount', 'test_deposit_count'),
  },
  {
    title: t('table.report.report_other'),
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'other_deposit_amount',
    customCell: (record) => {
      if (record.other_deposit_amount > 0)
        return {
          class: 'text-red',
        };
    },
    width: 180,
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'other', 'other_deposit_amount', 'other_deposit_count'),
  },
];

export const columnsWithdraw = [
  {
    title: t('business.common_count_date'),
    dataIndex: 'time',
    width: 120,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('table.report.deposit_amount'),
    dataIndex: 'withdraw_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'withdraw', 'withdraw_amount', 'withdraw_count'),
  },
  {
    title: t('table.report.report_online_withdraw'),
    dataIndex: 'online_withdraw_amount',
    width: 180,
    customCell: (record) => {
      if (record.online_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'online',
        'online_withdraw_amount',
        'online_withdraw_count',
      ),

    // customRender: ({ record }) => {
    //   return t('table.common.amount_frequency', [
    //     record.online_withdraw_amount ?? '-',
    //     record.online_withdraw_count ?? '-',
    //   ]);
    // },
  },
  {
    title: t('table.report.report_currency_withdraw'),
    dataIndex: 'coin_withdraw_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.coin_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'coin', 'coin_withdraw_amount', 'coin_withdraw_count'),
  },
  {
    title: t('table.report.automatic_withdrawal'),
    dataIndex: 'auto_withdraw_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.auto_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'auto', 'auto_withdraw_amount', 'auto_withdraw_count'),
  },
  {
    title: t('table.report.manual_withdrawal'),
    dataIndex: 'admin_withdraw_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.admin_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'admin',
        'admin_withdraw_amount',
        'admin_withdraw_count',
      ),
  },
  {
    title: t('table.report.wrong_deposits_and_withdrawals'),
    sorter: true,
    showSorterTooltip: false,
    dataIndex: 'error_withdraw_amount',
    width: 180,
    customCell: (record) => {
      if (record.error_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'errors',
        'error_withdraw_amount',
        'error_withdraw_count',
      ),
  },
  {
    title: t('table.report.test_deduction'),
    dataIndex: 'test_withdraw_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.test_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 1, 'test', 'test_withdraw_amount', 'test_withdraw_count'),
  },
  {
    title: t('table.report.report_other'),
    dataIndex: 'other_withdraw_amount',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.other_withdraw_amount > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'other',
        'other_withdraw_amount',
        'other_withdraw_count',
      ),
  },
];

export const columnsCommission = [
  {
    title: t('business.common_count_date'),
    dataIndex: 'time',
    width: 120,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('table.system.system_total_performance'),
    dataIndex: 'valid_bet_amount_total',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.valid_bet_amount_total > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 2, 'bet_total', 'valid_bet_amount_total'),
  },
  {
    title: t('table.system.system_direct_performance'),
    dataIndex: 'valid_bet_amount_direct',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.valid_bet_amount_direct > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 2, 'bet_direct', 'valid_bet_amount_direct'),
  },
  {
    title: t('table.system.system_other_performance'),
    dataIndex: 'valid_bet_amount_other',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.valid_bet_amount_other > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(column, record, 2, 'bet_other', 'valid_bet_amount_other'),
  },
  {
    title: t('table.report.commission_amount_total'),
    dataIndex: 'commission_amount_total',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.commission_amount_total > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'comm_total',
        'commission_amount_total',
        'commission_count_total',
      ),
  },
  {
    title: t('table.system.system_direct_commission'),
    dataIndex: 'commission_amount_direct',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.commission_amount_direct > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'comm_direct',
        'commission_amount_direct',
        'commission_count_direct',
      ),
  },
  {
    title: t('table.system.system_other_commission'),
    dataIndex: 'commission_amount_other',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.commission_amount_other > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'comm_other',
        'commission_amount_other',
        'commission_count_other',
      ),
  },
  {
    title: t('table.report.report_transfer_commission'),
    dataIndex: 'commission_amount_send',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.commission_amount_send > 0)
        return {
          class: 'text-red',
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'comm_send',
        'commission_amount_send',
        'commission_count_send',
      ),
  },
  {
    title: t('table.report.report_untransfer_commission'),
    dataIndex: 'commission_amount_not_send',
    width: 180,
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) => {
      if (record.commission_amount_not_send > 0)
        return {
          style: {
            color: '#F59A23',
          },
        };
    },
    customRender: ({ record, column }) =>
      renderTableTooltip(
        column,
        record,
        1,
        'other',
        'commission_amount_not_send',
        'commission_count_not_send',
      ),
  },
];

export const searchSchema: FormSchema[] = [
  {
    field: 'startDateEndDate',
    labelPrefix: t('modalForm.common.date_range'),
    component: 'RangePicker',
    labelPrefixWidth: 75,
    defaultValue: [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()],
    componentProps: ({ formActionType }) => {
      const dates = ref();
      const value = ref();
      const hackValue = ref();
      return {
        format: 'YYYY-MM-DD',
        disabledDate: (current) => {
          if (!dates.value || (dates.value as any).length === 0) {
            return false;
          }
          const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 30;
          const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 30;
          return tooEarly || tooLate;
        },
        onChange: async (val) => {
          value.value = val;
        },
        onOpenChange: (open) => {
          if (open) {
            if (!value.value) {
              value.value = [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()];
            }
            value.value = formActionType.getFieldsValue().startDateEndDate;
            formActionType.setFieldsValue({ startDateEndDate: [] });
            dates.value = [] as any;
            hackValue.value = [] as any;
          } else {
            formActionType.setFieldsValue({
              startDateEndDate: value.value ? value.value : hackValue.value,
            });
            if (formActionType.submit != undefined) formActionType.submit();
            hackValue.value = undefined;
          }
        },
        onCalendarChange: (val) => {
          dates.value = val;
        },
        getPopupContainer: () => document.body,
      };
    },
  },
];

export const OperationsOverviewSearchSchema: FormSchema[] = [
  {
    field: 'startDateEndDate',
    labelPrefix: t('modalForm.common.date_range'),
    component: 'RangePicker',
    labelPrefixWidth: 80,
    componentProps: ({ formActionType }) => {
      return {
        format: 'YYYY-MM-DD',
        disabledDate: (date) => {
          return date.valueOf() > dayjs().endOf('day').valueOf();
        },
        onChange: async (value) => {
          if (formActionType.submit != undefined) formActionType.submit();
        },
        getPopupContainer: () => document.body,
      };
    },
  },
];

export const dateGroupButtonListAll = [
  // { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('business.common_today'), value: 'days' },
  { label: t('modalForm.common.yesterday'), value: 'yesterday' },
  { label: t('table.member.member_month'), value: 'month' },
  { label: t('modalForm.common.last_month'), value: 'lastMonth' },
];

export const dateGroupButtonListOperations = [
  { label: t('common.week'), value: 'week' },
  { label: t('common.month'), value: 'month' },
];

export const options: any = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    icon: 'rect',
    origin: 'vertical',
    y: 'bottom',
    data: [],
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 10,
  },
  // toolbox: {
  //   feature: {
  //     saveAsImage: {},
  //   },
  // },
  grid: {
    left: '0',
    right: '1%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [],
};

export const regOptions: any = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    icon: 'rect',
    origin: 'vertical',
    y: 'bottom',
    data: [],
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 10,
  },
  // toolbox: {
  //   feature: {
  //     saveAsImage: {},
  //   },
  // },
  grid: {
    left: '0',
    right: '0',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [],
};

export const OptionsProperty: any = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
    enterable: true,
    formatter: function (params) {
      return `
        <div style="max-height: 600px; overflow-y: auto; width: auto;padding:0 10px">
          ${params
            .map(
              (item) => `
            <div style="display: flex; align-items: center; justify-content: space-between;">
             <div class="flex items-center">
               <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${item.color}; margin-right: 8px;"></div>
               <div>${item.seriesName}</div>
             </div>
              <div>${item.data}</div>
            </div>
          `,
            )
            .join('')}
        </div>
      `;
    },
  },
  legend: {
    icon: 'rect',
    origin: 'vertical',
    y: 'bottom',
    data: [],
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 10,
  },
  toolbox: {
    feature: {},
  },
  grid: {
    left: '2%',
    right: '3%',
    bottom: '20%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mo333n', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: '',
      type: 'line',
      //stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [],
    },
  ],
};

export const getcolumns = (item): any => {
  if (item == 'deposit') {
    useAutoTableLabelWidth(columnsDeposit);
    return columnsDeposit;
  } else if (item == 'withdraw') {
    useAutoTableLabelWidth(columnsWithdraw);
    return columnsWithdraw;
  } else if (item == 'commission') {
    useAutoTableLabelWidth(columnsCommission);
    return columnsCommission;
  }
};

export const series = {
  name: '',
  type: 'line',
  //stack: 'Total',
  areaStyle: {},
  emphasis: {
    focus: 'series',
  },
  data: [],
};
