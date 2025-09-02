import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'aplication',
    label: '',
    component: 'Input',
    slot: 'aplication',
    colProps: { xxl: 2, xl: 2, lg: 2, md: 3, sm: 4 },
  },
  {
    field: 'upload',
    label: '',
    component: 'Input',
    slot: 'upload',
    colProps: { xxl: 2, xl: 2, lg: 2, md: 3, sm: 4 },
  },
  {
    field: 'start_time',
    labelPrefix: t('business.common_start_time'),
    labelPrefixWidth: 60,
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    component: 'DatePicker',
    componentProps: () => {
      return {
        getPopupContainer: () => document.body,
        placeholder: t('business.common_start_time'),
      };
    },
  },
  {
    field: 'end_time',
    labelPrefix: t('business.common_end_time'),
    labelPrefixWidth: 60,
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    component: 'DatePicker',
    componentProps: () => {
      return {
        placeholder: t('business.common_end_time'),
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'state',
    component: 'Select',
    labelPrefix: t('business.common_status'),
    componentProps: {
      //options: optionsStates,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'search_type',
    labelPrefix: '',
    labelPrefixWidth: 10,
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.system_valid_domain'), value: 1 },
        { label: t('table.google.report_columns_APP_operator'), value: 2 },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 1, xl: 1, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'search_value',
    label: '',
    component: 'Input',
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    componentProps: {
      placeholder: t('table.member.member_inquiry_input'),
    },
  },
];
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'name',
  },
  {
    title: t('common.certName'),
    dataIndex: 'address',
  },
  {
    title: t('common.supplier'),
    dataIndex: 'address',
  },
  {
    title: t('table.system.system_verify_way'),
    dataIndex: 'address',
  },
  {
    title: t('common.crtFile'),
    dataIndex: 'address',
  },
  {
    title: t('common.keyFile'),
    dataIndex: 'address',
  },
  {
    title: t('business.common_type'),
    dataIndex: 'address',
  },
  {
    title: t('common.certStatus'),
    dataIndex: 'address',
  },
  {
    title: t('table.system.system_expired_time'),
    dataIndex: 'address',
  },
  {
    title: t('common.wildcard'),
    dataIndex: 'address',
  },
  {
    title: t('common.CorrespondingDomain'),
    dataIndex: 'address',
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'address',
  },
  {
    title: t('table.google.report_columns_APP_operator'),
    dataIndex: 'address',
  },
  {
    title: t('table.risk.report_operating_time'),
    minWidth: 220,
    dataIndex: 'address',
  },
];
