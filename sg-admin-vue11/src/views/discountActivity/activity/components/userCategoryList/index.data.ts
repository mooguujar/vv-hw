import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
    colProps: {
      style: {
        width: '120px',
      },
    },
  },
  {
    field: 'start_time',
    component: 'DatePicker',
    labelPrefix: '开始时间',
    labelPrefixWidth: 70,
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'end_time',
    component: 'DatePicker',
    labelPrefix: '结束时间',
    labelPrefixWidth: 70,
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'field1',
    component: 'Select',
    labelPrefixWidth: 70,
    labelPrefix: '限制类型',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  },
];
export const columns: BasicColumn[] = [
  {
    title: '邮箱账号',
    dataIndex: 'email',
  },
  {
    title: '限制类型',
    dataIndex: 'address',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: t('v.discount.activity.operation'),
    dataIndex: 'remark',
  },
  {
    title: '操作人员',
    dataIndex: 'remark',
  },
  {
    title: '更新时间',
    dataIndex: 'remark',
  },
];
