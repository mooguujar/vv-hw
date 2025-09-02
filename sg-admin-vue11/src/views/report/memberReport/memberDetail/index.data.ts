import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useI18n } from '/@/hooks/web/useI18n';
import { currentyOptions } from '/@/settings/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el: { id: string | number; name: any }) => {
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

export const columns: BasicColumn[] = [
  {
    title: t('table.report.report_deposit_currency'), //币种
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_member_date'), //日期
    dataIndex: 'time',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },

  {
    title: t('business.common_member_outlay'), //投注金额
    dataIndex: 'bet_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('business.common_member_valid_outlay'), //有效投注
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
    title: t('business.common_member_platform_iswin'), //win or lose
    dataIndex: 'net_amount',
    slots: { customRender: 'netAmount' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('business.common_member_discount_money'), //discountMoney
    dataIndex: 'gift_amount',
    sorter: true,
    slots: { customRender: 'giftAmount' },
    showSorterTooltip: false,
  },
  {
    title: t('business.common_member_commission_reward'), //commissionReward
    dataIndex: 'commission_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('business.common_member_sameday_deposit'), //same-day deposit
    dataIndex: 'deposit_amount',
    slots: { customRender: 'depositAmount' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('business.common_member_sameday_withdraw'), //same-day withdraw
    dataIndex: 'withdraw_amount',
    slots: { customRender: 'withdrawAmount' },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('business.common_member_cash_profit'), //cash-profit
    dataIndex: 'cash_profit',
    sorter: true,
    showSorterTooltip: false,
    customCell: (record) =>
      record.cash_profit > 0 ? { style: 'color:red' } : { style: 'color:#1cd91c' },
  },
  {
    title: t('business.common_member_profit_Proportion'), //profit-proportion
    dataIndex: 'cash_profit_rate',
    sorter: true,
    showSorterTooltip: false,
    customCell: (record: { cash_profit_rate: number }) => {
      return record.cash_profit_rate > 0 ? { style: 'color:red' } : { style: 'color:#1cd91c' };
    },
    customRender: ({ record }) => {
      return h('div', {}, `${record?.cash_profit_rate}%`);
    },
  },

  {
    title: t('business.common_member_Coding_multiple'), //coding multiple
    dataIndex: 'bet_multiplier',
    sorter: true,
    showSorterTooltip: false,
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
