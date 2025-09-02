import { BasicColumn } from '/@/components/Table';
import { deviceMap } from '/@/views/common/commonSetting';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.member.member_login_device'),
    dataIndex: 'logindevice',
    customRender: ({ record }) => {
      return deviceMap[record.logindevice];
    },
  },
  {
    title: t('table.member.member_login_demond'),
    dataIndex: 'logindomain',
  },
  {
    title: t('table.system.system_login_ip'),
    dataIndex: 'loginip',
  },
  {
    title: t('table.member.member_adress_tip'),
    dataIndex: 'ipaddress',
  },
  {
    title: t('table.member.member_login_time'),
    dataIndex: 'created_at',
    minWidth: 260,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
