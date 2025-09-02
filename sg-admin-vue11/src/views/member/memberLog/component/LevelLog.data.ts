import { BasicColumn, FormSchema } from '/@/components/Table';
import eventBus from '/@/utils/eventBus';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import dayjs from 'dayjs';

const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    slot: 'typeid',
  },
  {
    field: 'change_type_id',
    labelPrefix: t('table.finance.finance_Change_type'), //变更类型
    labelPrefixWidth: 72,
    component: 'Select',
    defaultValue: '',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    componentProps: () => {
      return {
        placeholder: t('business.common_all'),
        options: [
          { label: t('business.common_all'), value: '' },
          { label: t('table.member.memer_auto_upgrade'), value: '18687' },
          { label: t('table.member.memer_backend_adjust'), value: '18688' },
        ],
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 80,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        getPopupContainer: () => document.body,
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        onChange: async (e) => {
          eventBus.emit('mittChange', [formModel.time[0], formModel.time[1]]);
        },
      };
    },
  },
  {
    field: 'search_type',
    label: '',
    component: 'Select',
    //colProps: { xxl: 1, xl: 1, lg: 1 },
    defaultValue: 1,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('business.common_member_account'), value: 1 }, //会员账号
        { label: t('table.risk.report_operate_people'), value: 2 }, //操作人员
      ],
      getPopupContainer: () => document.body,
      class: 't-form-label-com',
    },
  },
  {
    field: 'search_value',
    label: '', //会员账号
    colProps: { xxl: 3, xl: 3, lg: 3 },
    component: 'Input',
    componentProps: {
      class: 't-form-label-com !m-r-4',
    },
  },
];
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'), //会员账号
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('table.finance.finance_Change_type'), //变更类型
    dataIndex: 'change_type_text',
    width: '20%',
    minWidth: 200,
  },
  {
    title: t('table.member.member_rate_level'), //变更等级
    dataIndex: 'after',
    slots: { customRender: 'slotsLevels' },
    minWidth: 100,
  },
  {
    title: t('table.member.member_change_time'), //变更时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
    width: '20%',
    minWidth: 200,
  },
  {
    title: t('table.member.member_oprate_people'), //操作人员
    dataIndex: 'operation_username',
    width: '20%',
    minWidth: 200,
  },
];
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
