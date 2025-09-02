import { FormSchema, BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';
import { toTimezone } from '@/utils/dateUtil';
import { currentyOptions } from '@/settings/commonSetting';
import { h } from 'vue';

const { t } = useI18n();
//佣金审核汇总查询条件
export const searchForm: FormSchema[] = [
  // {
  //   field: 'summary',
  //   component: 'Input',
  //   label: '',
  //   slot: 'commissionSummary',
  //   colProps: { style: { width: '130px' } },
  // },
  // {
  //   field: 'start_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_period_start'), //开始时间
  //   labelPrefixWidth: '70',
  //   colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  // },
  // {
  //   field: 'end_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_period_end'), //结束时间
  //   labelPrefixWidth: '70',
  //   colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  // },
  {
    field: 'year',
    slot: 'yearSelect',
    component: 'Input',
    label: t('modalForm.system.years'), //结束时间
    colProps: { style: { marginRight: '8px' } },
  },
  {
    field: 'state',
    slot: 'stateSelect',
    component: 'Input',
    label: t('table.system.system_table_header_status'), //结束时间
    colProps: { style: { marginRight: '8px' } },
  },
  // {
  //   field: 'status',
  //   component: 'Select',
  //   labelPrefix: t('business.common_status'), //状态
  //   colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  //   componentProps: {
  //     options: [],
  //   },
  // },
  // {
  //   field: 'username',
  //   component: 'Input',
  //   slot: 'usernameSlot',
  // },
];
//佣金审核汇总列表
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_settlement_currency'), //结算币种
    dataIndex: 'currency_id',
    width: 200,
    customRender: ({ record }) => {
      return currentyOptions[record.currency_id];
    },
  },
  {
    title: t('table.system.system_statistical_time'), //统计时间
    dataIndex: 'statistics_time',
    width: 400,
    slots: { customRender: 'system_time' },
  },
  {
    title: t('table.risk.report_settlement_time'), //结算时间
    dataIndex: 'created_at',
    width: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_total_performance'), //总业绩
    dataIndex: 'valid_bet_amount_total',
    width: 200,
  },
  {
    title: t('table.system.system_clearing_commission'), //结算佣金
    dataIndex: 'amount_total',
    width: 200,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: '#E91134' } },
        t('common.percentPeople', [record.amount_total, record.user_count]),
      );
    },
  },
  {
    title: t('table.system.system_locked_commission'), //锁定佣金
    dataIndex: 'lock_amount_total',
    width: 200,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: '#f5a036' } },
        t('common.percentPeople', [record.lock_amount_total, record.lock_user_count]),
      );
    },
  },
];

export const dateGroupButtonList = [
  { label: t('table.member.member_month'), value: 'month' },
  { label: t('table.member.member_week'), value: 'week' },
];
