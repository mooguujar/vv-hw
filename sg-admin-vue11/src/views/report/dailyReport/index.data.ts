import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { currentyOptions } from '/@/settings/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});
export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 100,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_count_date'),
    dataIndex: 'time',
    minWidth: 150,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('table.report.report_new_add_data'),
    dataIndex: '',
    children: [
      {
        title: t('table.report.report_reg'),
        dataIndex: 'reg_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: t('table.report.report_first_deposit'),
        dataIndex: 'first_deposit_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.first_deposit_amount;
        },
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'first_deposit_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: t('table.report.report_change_percent'),
        dataIndex: 'first_deposit_rate',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          const first_deposit_rate = record.first_deposit_rate
            ? `${record.first_deposit_rate}%`
            : '-';
          return h('span', {}, first_deposit_rate);
        },
      },
      {
        title: t('table.report.report_per_capita'),
        dataIndex: 'first_deposit_amount_per',

        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.first_deposit_amount_per;
        },
      },
    ],
  },
  {
    title: t('table.report.report_commission_data'),
    dataIndex: 'address',
    children: [
      {
        title: t('table.report.report_amount'),
        dataIndex: 'commission_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.commission_amount;
        },
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'commission_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
    ],
  },
  {
    title: t('table.report.report_discount_activity'),
    dataIndex: 'address',
    children: [
      {
        title: t('table.report.report_amount'),
        dataIndex: 'gift_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.gift_amount;
        },
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'gift_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: t('table.report.report_rate'),
        dataIndex: 'gift_rate',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          const gift_rate = record.gift_rate ? `${record.gift_rate}%` : '-';
          const color = Number(record.gift_rate) > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, gift_rate);
        },
      },
    ],
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'address',
    children: [
      {
        title: t('table.report.report_bet'),
        dataIndex: 'valid_bet_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.valid_bet_amount;
        },
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'bet_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: t('table.report.report_win_lose'),
        dataIndex: 'net_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.net_amount;
        },
      },
      {
        title: t('table.report.report_kill_rate'),
        dataIndex: 'kill_rate',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          const kill_rate = record.kill_rate ? `${record.kill_rate}%` : '-';
          const color = Number(record.kill_rate) > 0 ? 'text-red' : 'text-green';
          return h('span', { class: color }, kill_rate);
        },
      },
      {
        title: t('table.report.report_multiplier'),
        dataIndex: 'bet_multiplier',
        sorter: true,
        showSorterTooltip: false,
      },
    ],
  },
  {
    title: t('table.report.report_deposit_amount_total'),
    dataIndex: 'address',
    children: [
      {
        title: t('table.report.report_deposit'),
        dataIndex: 'deposit_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.deposit_amount;
        },
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'deposit_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
    ],
  },
  {
    title: t('table.report.report_withdrawal_amount_total'),
    dataIndex: 'address',
    children: [
      {
        title: t('table.report.report_withdrawal'),
        dataIndex: 'withdraw_amount',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          return record.withdraw_amount;
        },
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'withdraw_user_count',
        sorter: true,
        showSorterTooltip: false,
      },
    ],
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'address',
    children: [
      {
        title: t('table.report.report_profit'),
        dataIndex: 'cash_profit',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          const color = Number(record.cash_profit_rate) > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, record.cash_profit);
        },
      },
      {
        title: t('table.report.report_rate'),
        dataIndex: 'cash_profit_rate',
        sorter: true,
        showSorterTooltip: false,
        customRender: ({ record }) => {
          const cash_profit_rate = record.cash_profit_rate ? `${record.cash_profit_rate}%` : '-';
          const color = Number(record.cash_profit_rate) > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, cash_profit_rate);
        },
      },
    ],
  },
];
useAutoTableLabelWidth(columns);
export const searchSchema: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    labelPrefix: '',
    slot: 'grupButton',
    // colProps: { style: { width: '130px' } },
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
];

export const dateGroupButtonList = [
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
