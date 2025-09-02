import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { useSystemIssueWay } from '/@/views/common/const';
import dayjs from 'dayjs';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { systemIssueWayObject } = useSystemIssueWay();
const { t } = useI18n();
//佣金审核汇总查询条件
export const searchForm: FormSchema[] = [
  {
    field: 'summary',
    component: 'Input',
    label: '',
    slot: 'commissionSummary',
    colProps: { style: { minWidth: '130px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('month').toDate(), dayjs().endOf('day').toDate()],
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
    minWidth: 50,
    slots: { customRender: 'currency_id' },
  },
  {
    title: t('table.system.system_statistical_time'), //统计时间
    dataIndex: 'name',
    customRender: ({ record }) => {
      return (
        toTimezone(record.start_time, 'YYYY-MM-DD') +
        ' ~ ' +
        toTimezone(record.end_time, 'YYYY-MM-DD')
      );
    },
  },
  {
    title: t('table.system.system_settlement_time'), //结算时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_issue_way'), //发放方式
    dataIndex: 'send_type',
    minWidth: 120,
    customRender: ({ record }) => {
      return systemIssueWayObject[record.send_type];
    },
  },
  {
    title: t('table.system.system_total_performance'), //总业绩
    dataIndex: 'valid_bet_amount_total',
  },
  {
    title: t('table.report.report_transfer_commission'), //已发佣金
    dataIndex: 'amount_total',
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: '#E91134' } },
        t('common.percentPeople', [record.amount_total, record.user_count]),
      );
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
