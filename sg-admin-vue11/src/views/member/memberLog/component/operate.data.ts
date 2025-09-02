import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { operationEventOptions } from '../../common/const';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
export const searchFormSchema: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    slot: 'typeid',
  },
  {
    field: 'operation_event_id',
    labelPrefix: t('table.member.member_oprate_event'), //操作事件
    labelPrefixWidth: 75,
    component: 'Select',
    colProps: { xxl: 7, xl: 7, lg: 7, md: 7, sm: 7 },
    componentProps: {
      placeholder: t('business.common_all'), //全部
      options: operationEventOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        getPopupContainer: () => document.body,
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        onChange: async (e) => {},
      };
    },
  },
  {
    field: 'custom',
    label: '',
    component: 'Input',
    slot: 'custom',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
  },
  {
    title: t('table.member.member_login_demond'),
    dataIndex: 'domain',
  },
  {
    title: t('table.risk.report_login_ip'),
    dataIndex: 'login_ip',
  },
  {
    title: t('table.member.member_oprate_event'),
    dataIndex: 'operation_event',
  },
  {
    title: t('table.member.member_action'),
    dataIndex: 'operation_action',
    customRender: ({ record }) => {
      return record.operation_action === 'Update'
        ? t('modalForm.member.member_authorized_update')
        : t('table.system.system_insert_button');
    },
  },
  {
    title: t('table.member.member_before'),
    dataIndex: 'operation_before',
  },
  {
    title: t('table.member.member_after'),
    dataIndex: 'operation_after',
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'created_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
