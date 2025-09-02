import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
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

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'dataSlot',
    colProps: {
      style: { marginRight: '10px' },
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    label: '',
    slot: 'usernameSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.report.report_deposit_currency'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_agent_account'),
    dataIndex: 'username',
    slots: { customRender: 'username-slot' },
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_name',
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      return record.vip ? `VIP${record.vip}` : '-';
    },
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    slots: { customRender: 'validBet' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.real_valid_bet_amount'),
    helpMessage: `<p><span style="color:#f59a23">${t('business.current_5_1')}</span>${t(
      'table.report.real_valid_bet_amount_p',
    )}</p>`,
    dataIndex: 'real_valid_bet_amount',
    slots: { customRender: 'realValidBet' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    slots: { customRender: 'netAmount' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_gift_amount'),
    dataIndex: 'gift_amount',
    slots: { customRender: 'giftAmount' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_agent_amount'),
    dataIndex: 'commission_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_deposit_amount'),
    dataIndex: 'deposit_amount',
    slots: { customRender: 'depositAmount' },
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('table.report.report_withdraw_amount'),
    dataIndex: 'withdraw_amount',
    slots: { customRender: 'withdrawAmount' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const color = record.cash_profit > 0 ? '#E91134' : '#1CD91C';
      return h('span', { style: { color } }, record.cash_profit);
    },
  },
  {
    title: t('table.report.report_cash_profit_rate'),
    dataIndex: 'cash_profit_rate',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const color = record.cash_profit_rate > 0 ? '#E91134' : '#1CD91C';
      const cash_profit_rate = record.cash_profit_rate ? `${record.cash_profit_rate}%` : '-';
      return h('span', { style: { color } }, cash_profit_rate);
    },
  },
  {
    title: t('table.report.report_bet_multiplier'),
    dataIndex: 'bet_multiplier',
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
