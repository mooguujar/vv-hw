import { ipSettingMap } from '../../common/const';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { SetTooltip } from '/@/views/common/component';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { isControlValueSet } from '/@/utils/domUtils';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.risk.report_ip_address'), //IP地址
    dataIndex: 'ip',
    minWidth: 200,
  },
  {
    title: t('table.risk.report_ip_location'), //IP归属地
    dataIndex: 'vest',
    minWidth: 240,
  },
  {
    title: t('table.system.system_access_authority'), //访问权限
    dataIndex: 'flags',
    minWidth: 100,
    customRender: ({ record }) => {
      const { flags } = record;
      return ipSettingMap[flags];
    },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'note',
    width: 240,
    customRender: ({ record }) => {
      return record.note ? SetTooltip(record.note, 18) : '-';
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'agency_commission',
    minWidth: 100,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
    ifShow: isControlValueSet() ? false : auths(['70253', '70254']),
  },

  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
    minWidth: 100,
  },
  {
    title: t('business.common_update_time'), //更新时间
    dataIndex: 'updated_at',
    minWidth: 170,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
];
useAutoTableLabelWidth(columns);
export const searchFormSchema: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'createIpb',
  },
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'createIp',
  },

  {
    field: 'start_time',
    labelPrefix: t('business.common_start_time'), // 开始日期
    labelPrefixWidth: 75,
    component: 'DatePicker',
    colProps: { xxl: 6, xl: 6, lg: 6, sm: 6 },
    componentProps: {
      placeholder: t('business.common_time_please'),
    },
    slot: 'startDate',
  },
  {
    field: 'end_time',
    labelPrefix: t('business.common_end_time'), // 结束日期
    labelPrefixWidth: 75,
    component: 'DatePicker',
    colProps: { xxl: 6, xl: 6, lg: 6, sm: 6 },
    componentProps: {
      placeholder: t('business.common_time_please'),
    },
    slot: 'endDate',
  },
  {
    field: '',
    labelPrefix: '',
    labelPrefixWidth: 35,
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { xxl: 6, xl: 6, lg: 6, sm: 6 },
  },
];
