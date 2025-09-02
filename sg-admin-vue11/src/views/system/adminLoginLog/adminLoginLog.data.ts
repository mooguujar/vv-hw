import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const adminData: BasicColumn[] = [
  {
    title: t('table.system.system_root_user'), //会员账号
    dataIndex: 'username',
  },
  {
    title: t('table.risk.report_login_ip'), //登录ip
    dataIndex: 'ip',
  },
  {
    title: t('table.risk.report_ip_location'), //注册地址
    dataIndex: 'address',
  },
  {
    title: t('table.member.member_login_time'), //创建时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];

export const loginForm: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    labelPrefix: '',
    slot: 'grupButton',
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    //colProps: { xxl: 8, xl: 8, lg: 8, md: 7, sm: 8 },
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
];

export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
