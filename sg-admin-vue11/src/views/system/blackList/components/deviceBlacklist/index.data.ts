import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useLimitOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { setIpType1 } from '../../common/ipLocation';
import { auths } from '/@/utils/authFunction';
const { limitOptions } = useLimitOptions();
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
      dropdownMatchSelectWidth: false,
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
    defaultValue: 2,
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
    title: t('table.member.member_device_no'), //设备号
    dataIndex: 'val',
    minWidth: 280,
  },
  {
    title: t('modalForm.risk.risk_limit_type'), //限制类型
    dataIndex: 'created_at',
    minWidth: 145,
    customRender: ({ record }) => {
      return setIpType1(record);
    },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remark',
    minWidth: 310,
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'action',
    minWidth: 275,
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
    minWidth: 330,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
