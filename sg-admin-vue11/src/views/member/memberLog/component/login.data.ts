import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { deviceMap } from '/@/views/common/commonSetting';
import eventBus from '/@/utils/eventBus';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';

const { t } = useI18n();
export const searchFormSchema: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    slot: 'typeid',
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
    label: '',
    component: 'Input',
    slot: 'custom',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    minWidth: 100,
  },
  {
    title: t('table.member.member_login_device'),
    dataIndex: 'logindevice',
    customRender: ({ record }) => {
      return deviceMap[record.logindevice];
    },
    minWidth: 100,
  },
  {
    title: t('table.member.member_device_no'),
    dataIndex: 'deviceno',
    minWidth: 100,
  },
  {
    title: t('table.member.member_login_demond'),
    dataIndex: 'logindomain',
    minWidth: 100,
  },
  {
    title: t('table.system.system_login_ip'),
    dataIndex: 'loginip',
    minWidth: 100,
  },
  {
    title: t('table.risk.report_ip_location'),
    dataIndex: 'ipaddress',
    minWidth: 100,
  },
  {
    title: t('table.member.member_login_time'),
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
    minWidth: 260,
  },
];
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
