import { BasicColumn } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useI18n } from '/@/hooks/web/useI18n';
import { currentyOptions } from '/@/settings/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

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
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_count_date'),
    dataIndex: 'count_date',
    minWidth: 100,
    customRender: ({ record }) => {
      return toTimezone(record.count_date, 'YYYY-MM-DD');
    },
  },
  {
    title: t('business.common_count_time'),
    dataIndex: 'count_time',
    minWidth: 100,
    customRender: ({ record }) => {
      return toTimezone(record.count_time, 'HH:ss ');
    },
  },

  {
    title: t('table.report.report_online_data'),
    minWidth: 500,
    children: [
      {
        title: 'PC',
        dataIndex: 'pc_ol_num',
        minWidth: 100,
      },
      {
        title: 'H5',
        dataIndex: 'h5_ol_num',
        minWidth: 100,
      },
      {
        title: 'IOS',
        dataIndex: 'ios_ol_num',
        minWidth: 80,
      },
      {
        title: 'Android',
        dataIndex: 'android_ol_num',
        minWidth: 100,
      },
      {
        title: 'PWA',
        dataIndex: 'pwa_ol_num',
        minWidth: 100,
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
    minWidth: 500,
    children: [
      {
        title: t('table.report.report_reg'),
        dataIndex: 'reg_num',
        minWidth: 100,
      },
      {
        title: t('table.report.report_num'),
        dataIndex: 'first_deposit_num',
        minWidth: 60,
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.first_deposit_num);
        },
      },
      {
        title: t('table.report.report_amount'),
        minWidth: 100,
        dataIndex: 'first_deposit_amount',
        customRender: ({ record }) => {
          return record.first_deposit_amount || 0;
        },
      },
      {
        title: t('table.report.report_convert'),
        dataIndex: 'first_convert_rate',
        minWidth: 100,
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.first_convert_rate + '%');
        },
      },
      {
        title: t('table.report.report_per_capita'),
        dataIndex: 'first_per_capita',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.first_per_capita || 0;
        },
      },
    ],
  },
  {
    title: t('table.report.report_deposit_data'),
    dataIndex: '',
    minWidth: 300,
    children: [
      {
        title: t('table.report.report_num'),
        dataIndex: 'deposit_num',
        minWidth: 60,
        customRender: ({ record }) => {
          return record.deposit_num || 0;
        },
      },
      {
        title: t('table.report.report_cnt'),
        dataIndex: 'deposit_cnt',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.deposit_cnt || 0;
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'deposit_amount',
        minWidth: 100,
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.deposit_amount);
        },
      },
    ],
  },

  {
    title: t('table.report.report_withdrawal_data'),
    minWidth: 300,
    children: [
      {
        title: t('table.report.report_num'),
        dataIndex: 'withdraw_num',
        minWidth: 60,
        customRender: ({ record }) => {
          return record.withdraw_num || 0;
        },
      },
      {
        title: t('table.report.report_cnt'),
        dataIndex: 'withdraw_cnt',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.withdraw_cnt || 0;
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'withdraw_amount',
        minWidth: 100,
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.withdraw_amount);
        },
      },
    ],
  },

  {
    title: t('table.report.report_deposit_withdrawal_average'),
    minWidth: 200,
    children: [
      {
        title: t('table.report.report_deposit'),
        dataIndex: 'deposit_avg',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.deposit_avg || 0;
        },
      },
      {
        title: t('table.report.report_withdrawal'),
        dataIndex: 'withdraw_avg',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.withdraw_avg || 0;
        },
      },
    ],
  },
  {
    title: t('table.report.report_profit_data'),
    minWidth: 200,
    children: [
      {
        title: t('table.report.report_profit'),
        dataIndex: 'profit_amount',
        minWidth: 100,
        customRender: ({ record }) => {
          const color = record.profit_amount > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, record.profit_amount);
        },
      },
      {
        title: t('table.report.report_rate'),
        dataIndex: 'profit_rate',
        minWidth: 100,
        customRender: ({ record }) => {
          const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
          return h('span', {}, profit_rate);
        },
      },
    ],
  },

  {
    title: t('table.report.report_retain_data'),
    minWidth: 300,
    children: [
      {
        title: t('table.report.report_num'),
        dataIndex: 'retain_num',
        minWidth: 60,
        customRender: ({ record }) => {
          return record.retain_num || 0;
        },
      },
      {
        title: t('table.report.report_amount'),
        dataIndex: 'retain_amount',
        minWidth: 100,
        customRender: ({ record }) => {
          return h('div', { class: 'text-red' }, record.retain_amount);
        },
      },
      {
        title: t('table.report.report_retain'),
        dataIndex: 'retain_rate',
        minWidth: 100,
        customRender: ({ record }) => {
          const retain_rate = record.retain_rate ? `${record.retain_rate}%` : '-';
          return h('span', { class: 'text-red' }, retain_rate);
        },
      },
    ],
  },
  {
    title: t('table.report.report_platform_data'),
    //minWidth: 400,
    children: [
      {
        title: t('table.report.report_bet'),
        dataIndex: 'platform_bet_amount',
        minWidth: 100,
        customRender: ({ record }) => {
          return record.platform_bet_amount || 0;
        },
      },
      {
        title: t('table.report.report_multiplier'),
        minWidth: 100,
        dataIndex: 'platform_bet_multiplier',
      },
      {
        title: t('table.report.report_win_lose'),
        minWidth: 100,
        dataIndex: 'platform_win_lose',
        customRender: ({ record }) => {
          const color = record.platform_win_lose > 0 ? 'text-red' : 'text-green';
          return h('div', { class: color }, record.platform_win_lose);
        },
      },
      {
        title: t('table.report.report_profit_rate'),
        minWidth: 100,
        dataIndex: 'platform_win_rate',
        customRender: ({ record }) => {
          const platform_win_rate = record.platform_win_rate ? `${record.platform_win_rate}%` : '-';
          return h('span', {}, platform_win_rate);
        },
      },
    ],
  },
];
