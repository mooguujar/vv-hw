import { BasicColumn, FormSchema } from '/@/components/Table';
import { useLimitOptions } from '/@/views/common/commonSetting';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { SetTooltip } from '/@/views/common/component';
import { setIpType } from '../../common/ipLocation';
import { auths } from '/@/utils/authFunction';
const { limitOptions } = useLimitOptions();
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
    ifShow: auths(['60111', '60109']),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'limit_type',
    component: 'Select',
    labelPrefix: t('modalForm.risk.risk_limit_type'), //限制类型
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    defaultValue: 0,
    componentProps: {
      options: limitOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
  {
    field: 'cate',
    component: 'InputNumber',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'content',
    component: 'Input',
    show: false,
  },
  {
    field: 'updated_name',
    component: 'Input',
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.risk.report_ip_address'), //IP地址
    dataIndex: 'val',
    minWidth: 150,
  },
  {
    title: t('table.risk.report_ip_location'), //IP归属地
    dataIndex: 'ip_info',
    minWidth: 200,
    customRender: ({ record }) => {
      return record.ip_info ? SetTooltip(record.ip_info, 25) : '-';
    },
  },
  {
    title: t('modalForm.risk.risk_limit_type'), //限制类型
    dataIndex: 'created_at',
    minWidth: 145,
    customRender: ({ record }) => {
      return setIpType(record);
    },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remark',
    minWidth: 200,
    customRender: ({ record }) => {
      return record.remark ? SetTooltip(record.remark, 15) : '-';
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'action',
    minWidth: 160,
    ifShow: auths(['60110', '60111']),
    slots: { customRender: 'action', style: { textAlign: 'center' } },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
    minWidth: 150,
  },
  {
    title: t('business.common_update_time'), //更新时间
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
