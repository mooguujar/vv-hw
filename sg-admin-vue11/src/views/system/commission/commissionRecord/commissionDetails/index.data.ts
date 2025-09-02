import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { useSystemIssueWay } from '/@/views/common/const';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import dayjs from 'dayjs';
import { h } from 'vue';

const { t } = useI18n();
const { systemIssueWayObject, systemIssueWayOptions } = useSystemIssueWay();

export const searchForm: FormSchema[] = [
  {
    field: 'summary',
    component: 'Input',
    label: '',
    slot: 'commissionSummary',
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'time_type',
    component: 'Select',
    defaultValue: 1,
    colProps: {
      class: 'time-type-sty',
      style: { marginRight: '10px' },
    },
    componentProps: {
      allowClear: false,
      getPopupContainer: () => document.body,
      options: [
        { label: t('table.risk.report_settlement_time'), value: 1 },
        { label: t('table.system.system_delivery_time'), value: 2 },
      ],
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('month').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'send_type',
    component: 'Select',
    labelPrefix: t('table.system.system_issue_way'), //发放方式
    required: false,
    defaultValue: 0,
    componentProps: {
      options: systemIssueWayOptions,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
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
    title: t('table.system.system_statistical_time'), //统计时间
    dataIndex: 'name',
    minWidth: 220,
    customRender: ({ record }) => {
      return h(
        'div',
        {
          style: {
            whiteSpace: 'pre-line',
          },
        },
        [
          h(
            'div',
            toTimezone(record.start_time, 'YYYY-MM-DD') +
              ' ~ ' +
              toTimezone(record.end_time, 'YYYY-MM-DD'),
          ),
        ],
      );
    },
  },
  {
    title: t('table.member.member_agent_account'), //代理账号
    dataIndex: 'username',
    minWidth: 100,
    slots: { customRender: 'usernameSlot' },
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
    title: t('table.system.system_issue_way'), //发放方式
    dataIndex: 'send_type',
    minWidth: 100,
    customRender: ({ record }) => {
      return systemIssueWayObject[record.send_type];
    },
  },
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    minWidth: 100,
    slots: { customRender: 'currency_id' },
  },
  {
    title: t('table.system.system_delivery_commission'), //发放佣金
    dataIndex: 'commission_amount_total',
    minWidth: 100,
    slots: { customRender: 'commissionSlots' },
  },
  {
    title: t('table.risk.report_settlement_time'), //结算时间
    dataIndex: 'created_at',
    minWidth: 150,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_delivery_time'), //发放时间
    dataIndex: 'send_time',
    minWidth: 150,
    customRender: ({ record }) => {
      return toTimezone(record.send_time);
    },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'operator_name',
    minWidth: 120,
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
