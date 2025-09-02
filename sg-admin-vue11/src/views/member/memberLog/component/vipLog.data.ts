import { BasicColumn, FormSchema } from '/@/components/Table';
import eventBus from '/@/utils/eventBus';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { changeOptions } from '../common/const';
import dayjs from 'dayjs';

const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    slot: 'typeid',
  },
  {
    field: 'type',
    labelPrefix: t('table.finance.finance_Change_type'), //变更类型
    labelPrefixWidth: 72,
    component: 'Select',
    defaultValue: '',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: () => {
      return {
        placeholder: t('business.common_all'),
        options: [
          { label: t('business.common_all'), value: '' },
          ...changeOptions.filter((a) => a.value !== 3),
        ],
        getPopupContainer: () => document.body,
      };
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
        onChange: async (e) => {
          eventBus.emit('mittChange', [formModel.time[0], formModel.time[1]]);
        },
      };
    },
  },
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
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
    dataIndex: 'type',
    customRender: ({ record }) => {
      return changeOptions.find((a) => a.value === record.type)?.label ?? '-';
    },
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
    minWidth: 220,
  },
  {
    title: t('table.member.member_oprate_people'), //操作人员
    dataIndex: 'created_name',
    width: '20%',
    minWidth: 200,
  },
];
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
