import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import dayjs from 'dayjs';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
//佣金审核汇总查询条件
export const searchForm: FormSchema[] = [
  {
    field: 'summary',
    component: 'Input',
    label: '',
    slot: 'commissionSummary',
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [
      dayjs().subtract(2, 'day').startOf('day').toDate(),
      dayjs().endOf('day').toDate(),
    ],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
];
//佣金审核汇总列表
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_settlement_currency'), //结算币种
    dataIndex: 'currency_id',
    minWidth: 200,
    slots: { customRender: 'currency_id' },
  },
  {
    title: t('table.system.system_statistical_time'), //统计时间
    dataIndex: 'statistics_time',
    minWidth: 200,
    slots: { customRender: 'system_time' },
  },
  {
    title: t('table.risk.report_settlement_time'), //结算时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_total_performance'), //总业绩
    dataIndex: 'valid_bet_amount_total',
    minWidth: 120,
  },
  {
    title: t('table.system.system_clearing_commission'), //结算佣金
    dataIndex: 'amount_total',
    minWidth: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: '#E91134' } },
        t('table.common.amount_frequency', [record.amount_total, record.user_count]),
      );
    },
  },
  {
    title: t('table.system.system_locked_commission'), //锁定佣金
    dataIndex: 'lock_amount_total',
    minWidth: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: '#f5a036' } },
        t('table.common.amount_frequency', [record.lock_amount_total, record.lock_user_count]),
      );
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_month'), value: 'month' },
  { label: t('table.member.member_week'), value: 'week' },
];
