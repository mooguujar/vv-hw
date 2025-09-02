import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import dayjs from 'dayjs';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'createIp',
  },
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
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('month').toDate(), dayjs().endOf('day').toDate()],
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
  {
    field: 'state',
    component: 'Input',
    label: '',
    show: false,
    defaultValue: '1',
  },
];
useAutoLabelWidth(searchForm);
export const columns: BasicColumn[] = [
  {
    title: t('table.member.member_creat_time'), //创建时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.system.system_expired_time'), //过期时间
    dataIndex: 'expire_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.expire_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    width: 120,
    slots: { customRender: 'currency_id' },
  },
  {
    title: t('table.report.report_amount'), //金额
    dataIndex: 'amount',
    minWidth: 150,
  },
  {
    title: t('table.discountActivity.discount_audit_multiple'), //金额
    dataIndex: 'multiple',
    minWidth: 150,
    customRender: ({ record }) => {
      return record.multiple ? record.multiple : '-';
    },
  },
  {
    title: t('common.code_num'), //数量
    dataIndex: 'code',
    minWidth: 80,
    slots: { customRender: 'code' },
  },
  {
    title: t('common.code_used'), //已使用
    dataIndex: 'codeNum',
    minWidth: 150,
    slots: { customRender: 'codeNum' },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
    minWidth: 150,
  },
  {
    title: t('table.risk.report_operating_time'), //操作时间
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('modalForm.common.yesterday'), value: 'yesterday' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
