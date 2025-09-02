import { FormSchema, BasicColumn } from '/@/components/Table';
import { mul } from '/@/utils/number';
import { useCurrencyStore } from '/@/store/modules/currency';
import { Tag, Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { stateGameRecordColor, stateGameRecordData } from '/@/views/finance/common/const';
import { createCurrencyMap } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { columns } from '../bettingSport/index.data';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
        },
        text,
      ),
  );
};

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    labelPrefix: '',
    slot: 'grupButton',
    // colProps: { style: { width: '190px' } },
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'currency_id',
    labelPrefix: t('business.common_currency'),
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    componentProps: {
      api: async () => {
        return [...[{ label: t('business.common_all'), value: '' }], ...getCurrencyList];
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
      allowClear: false,
      showIcon: true,
    },
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      allowClear: false,
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    labelPrefix: t('business.common_member_account'),
    labelPrefixWidth: 75,
    component: 'Input',
    componentProps: {
      placeholder: t('common.inputText'),
    },
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },
];

export const getTotalColumns: BasicColumn[] = [
  {
    title: t('table.report.report_platform_name'),
    dataIndex: 'platform_name',
  },
  {
    title: t('table.report.report_bet_count'),
    dataIndex: 'bet_count',
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    customRender: ({ record }) => {
      const net_amount = Number(record.net_amount) ? Number(record.net_amount) : '-';
      return h(
        'span',
        {
          style: { color: Number(record.net_amount) > 0 ? '#E91134' : '#1CD91C' },
        },
        net_amount,
      );
    },
  },
  {
    title: t('table.report.report_bet_count_proportion'),
    dataIndex: 'bet_count_proportion',
    customRender: ({ record }) => {
      const bet_count_proportion = record.bet_count_proportion
        ? `${mul(Number(record.bet_count_proportion), 100)}%`
        : '-';
      return bet_count_proportion;
    },
  },
  {
    title: t('table.report.report_profit_rate'),
    dataIndex: 'profit_rate',
    customRender: ({ record }) => {
      const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
      return h(
        'span',
        {
          style: { color: Number(record.profit_rate) > 0 ? '#E91134' : '#1CD91C' },
        },
        profit_rate,
      );
    },
  },
];
useAutoTableLabelWidth(getTotalColumns);
export function getDetailColumns(platform_name): BasicColumn[] {
  const columns = [
    {
      title: platform_name,
      dataIndex: 'game_name',
      width: 240,
      slots: { customRender: 'gameName', style: { textAlign: 'center' } },
    },
    {
      title: t('table.report.report_bet_count'),
      dataIndex: 'bet_count',
      minWidth: 100,
    },
    {
      title: t('table.report.report_bet_amount'),
      dataIndex: 'bet_amount',
      minWidth: 100,
    },
    {
      title: t('table.report.report_valid_bet_amount'),
      dataIndex: 'valid_bet_amount',
      minWidth: 100,
    },
    {
      title: t('table.report.report_platform_amount'),
      dataIndex: 'net_amount',
      customRender: ({ record }) => {
        const net_amount = Number(record.net_amount) ? Number(record.net_amount) : '-';
        return h(
          'span',
          {
            style: { color: Number(record.net_amount) > 0 ? '#E91134' : '#1CD91C' },
          },
          net_amount,
        );
      },
    },
    {
      title: t('table.report.report_bet_count_proportion'),
      dataIndex: 'bet_count_proportion',
      customRender: ({ record }) => {
        const bet_count_proportion = record.bet_count_proportion
          ? `${mul(Number(record.bet_count_proportion), 100)}%`
          : '-';
        return bet_count_proportion;
      },
    },
    {
      title: t('table.report.report_profit_rate'),
      dataIndex: 'profit_rate',
      minWidth: 160,
      customRender: ({ record }) => {
        const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
        return h(
          'span',
          {
            style: { color: Number(record.profit_rate) > 0 ? '#E91134' : '#1CD91C' },
          },
          profit_rate,
        );
      },
    },
  ];
  useAutoTableLabelWidth(columns);
  return columns;
}

export const bettingRecordColumns: BasicColumn[] = [
  {
    title: t('table.report.report_bill_no'),
    dataIndex: 'bill_no',
    maxWidth: 240,
    customRender: ({ record }) => {
      return record.bill_no ? record.bill_no : '-';
    },
  },
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('table.report.report_player_name'),
    dataIndex: 'player_name',
    minWidth: 180,
    customRender: ({ record }) => {
      return record.player_name ? record.player_name : '-';
    },
  },
  {
    title: t('table.report.report_platform_name'),
    minWidth: 100,
    dataIndex: 'platform_name',
    customRender: ({ record }) => {
      return record.platform_name ? record.platform_name : '-';
    },
  },
  {
    title: t('table.report.report_game_name'),
    dataIndex: 'game_name',
    customRender: ({ record }) => {
      return record.game_name ? record.game_name : '-';
    },
    minWidth: 120,
  },
  {
    title: t('table.report.report_bet_currency_id'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: createCurrencyMap(record.currency_id) }),
    minWidth: 120,
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.bet_amount ? record.bet_amount : '-';
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.valid_bet_amount ? record.valid_bet_amount : '-';
    },
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    minWidth: 120,
    customRender: ({ record }) => {
      const color = record.net_amount > 0 ? 'text-red' : 'text-green';
      return h('div', { class: color }, record.net_amount);
    },
  },
  {
    title: t('table.report.report_bet_content'),
    dataIndex: 'detail',
    width: 120,
    customRender: ({ record }) => {
      if (record.game_class == '8') return '-';
      if (record.detail == '[]') return '-';
      return record.detail.length > 9 ? setTooltip(record.detail) : record.detail;
    },
  },
  {
    title: t('table.report.report_bet_time'),
    dataIndex: 'settle_time',
    customRender: ({ record }) => {
      return toTimezone(record.settle_time, 'YYYY-MM-DD HH:mm:ss', false);
    },
    minWidth: 200,
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      const state = record.state;
      return h(Tag, { color: stateGameRecordColor[state] }, () => stateGameRecordData[state]);
    },
  },
];
useAutoTableLabelWidth(bettingRecordColumns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];

export function getColumnsBasedOnGameType(history): BasicColumn[] {
  if (history.game_type == 4) return columns;
  else return bettingRecordColumns;
}
