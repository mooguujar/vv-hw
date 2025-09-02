import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { stateOptions, stateLockOptions } from '../../common/const';
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

  {
    field: 'state',
    component: 'Select',
    labelPrefixWidth: '45',
    labelPrefix: t('business.common_status'), //状态
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    defaultValue: 0,
    componentProps: {
      options: stateLockOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
];
//佣金审核汇总列表
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_statistical_time'), //统计时间
    dataIndex: 'start_time',
    minWidth: 220,
    titleHelpPlacement: 'top',
    slots: { customRender: 'system_time' },
  },
  {
    title: t('table.member.member_agent_account'), //代理账号
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('business.common_super_agent'), //上级代理
    dataIndex: 'parent_name',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.parent_name ? record.parent_name : '-';
    },
  },
  {
    title: t('table.system.system_direct_number'), //直属人数
    dataIndex: 'direct_user_count',
    minWidth: 100,
  },
  {
    title: t('table.report.report_team_user'), //团队人数
    dataIndex: 'other_user_count',
    minWidth: 120,
    helpMessage: `<p>${t('business.current_2')}</p>`,
  },
  {
    title: t('table.system.system_settlement_currency'),
    dataIndex: 'currency_id',
    minWidth: 100,
    slots: { customRender: 'currency_id' },
  },
  {
    title: t('table.system.system_clearing_commission'), //结算佣金
    titleHelpPlacement: 'top',
    dataIndex: 'commission_amount_total',
    minWidth: 100,
    slots: { customRender: 'commissionSlots' },
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'state',
    minWidth: 100,
    customRender: ({ record }) => {
      const color = record.state === 1 ? '#63a104' : '#db212b';
      if (record.commission_state === 2) {
        return h('span', { style: { color: '#E91134' } }, t('business.common_off'));
      } else {
        return h('span', { style: { color: color } }, stateOptions[record.state]);
      }
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
