import { BasicColumn, FormSchema } from '/@/components/Table';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
        },
        text,
      ),
  );
};
// 表格内容
export const pixColumns: BasicColumn[] = [
  {
    title: t('modalForm.finance.common_income.menber_id'),
    dataIndex: 'username',
    width: 150,
  },
  {
    title: t('modalForm.system.system_username'),
    dataIndex: 'name',
    width: 150,
    customRender: ({ record }) => {
      return setTooltip(record.name);
    },
  },
  {
    title: t('common.tripartitey'),
    dataIndex: 'cardNumber',
    width: 150,
  },
  {
    title: t('modalForm.finance.finance_collection_way'),
    dataIndex: 'openLevelInfo',
    width: 120,
  },
  {
    title: t('modalForm.member.member_payment_account_number'),
    dataIndex: 'openTerminal',
    width: 120,
  },
  {
    title: 'CPF',
    dataIndex: 'todayDeposit',
    width: 80,
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'totalDeposit',
    width: 80,
  },
  {
    title: t('table.system.system_table_header_status'),
    dataIndex: 'createTime',
    width: 80,
  },
];
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    component: 'Select',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
    componentProps: {
      placeholder: t('common.All'),
      options: [
        { label: t('common.All'), value: '' },
        { label: t('table.common.normal'), value: 1 },
        { label: t('table.system.deactivate'), value: 0 },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    labelPrefix: t('modalForm.member.member_payment_account_number'),
    labelPrefixWidth: 70,
    component: 'Input',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
  },
  {
    field: 'cfo',
    labelPrefix: 'CFO',
    labelPrefixWidth: 45,
    component: 'Input',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
  },
  {
    field: '',
    label: '',
    labelWidth: 0,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 12, sm: 16 },
  },
];
export const vndFormSchema: FormSchema[] = [
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    component: 'Select',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
    componentProps: {
      placeholder: t('common.All'),
      options: [
        { label: t('common.All'), value: '' },
        { label: t('table.common.normal'), value: 1 },
        { label: t('table.system.deactivate'), value: 0 },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'type',
    labelPrefix: t('common.bankType'),
    labelPrefixWidth: 70,
    component: 'Select',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    componentProps: {
      placeholder: t('common.All'),
      options: [
        { label: t('common.All'), value: 0 },
        { label: t('common.nybank'), value: 1 },
        { label: t('common.zgbank'), value: 2 },
        { label: t('common.gsbank'), value: 3 },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    label: '',
    labelWidth: 0,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 12, sm: 16 },
  },
];
