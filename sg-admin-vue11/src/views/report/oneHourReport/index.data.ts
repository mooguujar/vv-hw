import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    labelPrefix: '',
    slot: 'grupButton',
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',

    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    width: 80,
    slots: { customRender: 'currency' },
  },
  {
    title: t('business.common_count_date'),
    dataIndex: 'count_time', //和Frenk说：“直接用count_time就OK。
    width: 150,
    customRender: ({ record }) => {
      return toTimezone(record.count_time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('business.common_count_time'),
    dataIndex: 'count_time',
    width: 100,
    slots: { customRender: 'time', style: { textAlign: 'center' } },
  },

  {
    title: t('table.report.report_online_data'),
    width: 500,
    children: [
      {
        title: 'PC',
        dataIndex: 'pc_ol_num',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.pc_ol_num || 0;
        },
      },
      {
        title: 'H5',
        dataIndex: 'h5_ol_num',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.h5_ol_num || 0;
        },
      },
      {
        title: 'IOS',
        dataIndex: 'ios_ol_num',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.ios_ol_num || 0;
        },
      },
      {
        title: 'Android',
        dataIndex: 'android_ol_num',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.android_ol_num || 0;
        },
      },
      {
        title: 'PWA',
        dataIndex: 'pwa_ol_num',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.pwa_ol_num || 0;
        },
      },
      {
        title: t('table.report.report_total'),
        dataIndex: 'ol_total',
        minWidth: 100,
      },
    ],
  },
  {
    title: t('table.report.report_first_deposit_data'),
    dataIndex: '',
    width: 500,
    children: [
      {
        title: t('table.report.report_reg'),
        dataIndex: 'reg_num',
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'first_deposit_num',
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.first_deposit_num);
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'first_deposit_amount',
        customRender: ({ record }) => {
          return record.first_deposit_amount ? record.first_deposit_amount : 0;
        },
      },
      {
        title: t('table.report.report_convert'),
        dataIndex: 'first_convert_rate',
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.first_convert_rate + '%');
        },
      },
      {
        title: t('table.report.report_per_capita'),
        dataIndex: 'first_per_capita',
      },
    ],
  },

  {
    title: t('table.report.report_deposit_data'),
    dataIndex: '',
    width: 500,
    children: [
      {
        title: t('table.report.report_num'),
        dataIndex: 'deposit_num',
      },
      {
        title: t('table.report.report_cnt'),
        dataIndex: 'deposit_cnt',
        customRender: ({ record }) => {
          return record.deposit_cnt || 0;
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'deposit_amount',
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.deposit_amount);
        },
      },
    ],
  },

  {
    title: t('table.report.report_withdrawal_data'),
    width: 300,
    children: [
      {
        title: t('table.report.report_num'),
        dataIndex: 'withdraw_num',
        customRender: ({ record }) => {
          return record.withdraw_num ? record.withdraw_num : 0;
        },
      },
      {
        title: t('table.report.report_cnt'),
        dataIndex: 'withdraw_cnt',
        customRender: ({ record }) => {
          return record.withdraw_cnt ? record.withdraw_cnt : 0;
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'withdraw_amount',
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.withdraw_amount);
        },
      },
    ],
  },

  {
    title: t('table.report.report_deposit_withdrawal_average'),
    width: 200,
    children: [
      {
        title: t('table.report.report_deposit'),
        dataIndex: 'deposit_avg',
        customRender: ({ record }) => {
          return record.deposit_avg ? record.deposit_avg : 0;
        },
      },
      {
        title: t('table.report.report_withdrawal'),
        dataIndex: 'withdraw_avg',
        customRender: ({ record }) => {
          return record.withdraw_avg ? record.withdraw_avg : 0;
        },
      },
    ],
  },
  {
    title: t('table.report.report_profit_data'),
    width: 200,
    children: [
      {
        title: t('table.report.report_profit'),
        dataIndex: 'profit_amount',
        customRender: ({ record }) => {
          const color = record.profit_amount > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, record.profit_amount);
        },
      },
      {
        title: t('table.report.report_rate'),
        dataIndex: 'profit_rate',
        customRender: ({ record }) => {
          const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
          return h('span', {}, profit_rate);
        },
      },
    ],
  },

  {
    title: t('table.report.report_retain_data'),
    width: 300,
    children: [
      {
        title: t('table.report.report_num'),
        dataIndex: 'retain_num',
        customRender: ({ record }) => {
          return record.retain_num ? record.retain_num : 0;
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'retain_amount',
        customRender: ({ record }) => {
          return h('div', record.retain_amount);
          // return h('div', { class: 'text-red' }, record.retain_amount);
        },
      },
      {
        title: t('table.report.report_retain'),
        dataIndex: 'retain_rate',
        customRender: ({ record }) => {
          const retain_rate = record.retain_rate ? `${record.retain_rate}%` : '-';
          return h('span', { class: 'text-red' }, retain_rate);
        },
      },
    ],
  },
  {
    title: t('table.report.report_platform_data'),
    width: 400,
    children: [
      {
        title: t('table.report.report_bet'),
        dataIndex: 'platform_bet_amount',
        customRender: ({ record }) => {
          return record.platform_bet_amount ? record.platform_bet_amount : 0;
        },
      },
      {
        title: t('table.report.report_multiplier'),
        dataIndex: 'platform_bet_multiplier',
        customRender: ({ record }) => {
          return record.platform_bet_multiplier || 0;
        },
      },
      {
        title: t('table.report.report_win_lose'),
        dataIndex: 'platform_win_lose',
        customRender: ({ record }) => {
          const color = record.platform_win_lose > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, record.platform_win_lose);
        },
      },
      {
        title: t('table.report.report_profit_rate'),
        dataIndex: 'platform_win_rate',
        customRender: ({ record }) => {
          const platform_win_rate = record.platform_win_rate ? `${record.platform_win_rate}%` : '-';
          return platform_win_rate;
        },
      },
    ],
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_yesterday'), value: 'yesterday' },
  { label: t('business.common_before_yesterday'), value: 'beforeYesterday' },
];
