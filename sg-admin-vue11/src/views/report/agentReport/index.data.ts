import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
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
  {
    field: 'username',
    labelPrefix: t('business.common_agent_account'),
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_agent_account'),
    dataIndex: 'username',
    slots: { customRender: 'action', style: { textAlign: 'center' } },
  },
  {
    title: t('business.common_account_type'),
    dataIndex: 'user_type',
    width: 160,
    customRender: ({ record }: any) => {
      return agencyType.find((item) => item.value === record.user_type)?.label || '-';
    },
  },
  {
    title: t('table.report.report_reg_user_count'),
    dataIndex: 'reg_user_count',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.reg_user_count;
    },
  },
  {
    title: t('table.report.report_first_deposit_amount'),
    dataIndex: 'first_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return (
        record.first_deposit_amount +
        '/' +
        record.first_deposit_user_count +
        ' ' +
        t('component.unit.people')
      );
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return (
        record.valid_bet_amount + '/' + record.bet_user_count + ' ' + t('component.unit.people')
      );
    },
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const color = record.net_amount > 0 ? 'text-red' : 'text-green';
      return h('div', { class: color }, record.net_amount);
    },
  },
  {
    title: t('table.report.report_commission_amount'),
    dataIndex: 'commission_amount',
    // customRender: ({ record }) => {
    //   return setTooltip(record.commission_amount);
    // },
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.commission_amount;
    },
  },
  {
    title: t('table.report.report_gift_amount'),
    dataIndex: 'gift_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.gift_amount + '/' + record.gift_user_count + ' ' + t('component.unit.people');
    },
  },
  {
    title: t('table.report.report_team_profit'),
    dataIndex: 'team_profit',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const color = Number(record.team_profit) > 0 ? 'text-red' : 'text-green';
      return h('div', { class: color }, record.team_profit);
    },
    minWidth: 150,
  },
  {
    title: t('table.report.report_deposit_amount'),
    dataIndex: 'deposit_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return (
        record.deposit_amount + '/' + record.deposit_user_count + ' ' + t('component.unit.people')
      );
    },
  },
  {
    title: t('table.report.report_withdraw_amount'),
    dataIndex: 'withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return (
        record.withdraw_amount + '/' + record.withdraw_user_count + ' ' + t('component.unit.people')
      );
    },
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      const color = record.cash_profit > 0 ? 'text-red' : 'text-green';
      return h('div', { class: color }, record.cash_profit);
    },
  },
  {
    title: t('table.report.report_team_balance'),
    dataIndex: 'team_balance',
    minWidth: 200,
    customRender: ({ record }) => {
      return record.team_balance;
    },
  },
  {
    title: t('table.report.report_team_user'),
    dataIndex: 'team_user_count',
    // customRender: ({ record }) => {
    //   return record.team_user_count;
    // },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];

export const agencyType = [
  {
    value: 0,
    label: t('table.member.member_partner'),
  },
  {
    value: 1,
    label: t('business.agent_1'),
  },
  {
    value: 2,
    label: t('business.agent_2'),
  },
  {
    value: 3,
    label: t('business.agent_3'),
  },
  {
    value: 4,
    label: t('business.agent_4'),
  },
  {
    value: 5,
    label: t('business.agent_5'),
  },
  {
    value: 6,
    label: t('business.agent_6'),
  },
  {
    value: 7,
    label: t('business.agent_7'),
  },
  {
    value: 8,
    label: t('business.agent_8'),
  },
  {
    value: 9,
    label: t('business.agent_9'),
  },
  {
    value: 10,
    label: t('business.agent_10'),
  },
];
