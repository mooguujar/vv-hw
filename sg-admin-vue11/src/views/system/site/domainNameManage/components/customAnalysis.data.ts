import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { customizeOptions } from '../common/const';
import eventBus from '/@/utils/eventBus';
import { useI18n } from '/@/hooks/web/useI18n';
import { isControlValueSet } from '/@/utils/domUtils';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    label: '',
    slot: 'typeid',
    // colProps: { xxl: 3, xl: 3, lg: 3, md: 4, sm: 5 },
    colProps: { class: 'mr-10px' },
  },
  {
    field: 'start_time',
    labelPrefix: t('business.common_period_start'),
    labelPrefixWidth: 75,
    colProps: { xxl: 7, xl: 7, lg: 8, md: 9, sm: 9, class: 'ml-10px' },
    component: 'DatePicker',
    componentProps: ({ formActionType, formModel }) => {
      const { setFieldsValue } = formActionType;
      return {
        getPopupContainer: () => document.body,
        placeholder: t('business.common_period_start'),
        onChange: async (e) => {
          await setFieldsValue({ field: 'start_time', e });
          eventBus.emit('mittChange', [formModel.start_time, formModel.end_time]);
        },
      };
    },
  },
  {
    field: 'end_time',
    labelPrefix: t('business.common_period_end'),
    labelPrefixWidth: 75,
    colProps: { xxl: 7, xl: 7, lg: 8, md: 9, sm: 9 },
    component: 'DatePicker',
    componentProps: ({ formActionType, formModel }) => {
      const { setFieldsValue } = formActionType;
      return {
        getPopupContainer: () => document.body,
        placeholder: t('business.common_period_end'),
        onChange: async (e) => {
          await setFieldsValue({ field: 'start_time', e });
          eventBus.emit('mittChange', [formModel.start_time, formModel.end_time]);
        },
      };
    },
  },
  {
    field: 'resolve_type',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('business.common_type'),
    colProps: { xxl: 6, xl: 6, lg: 6, sm: 6 },
    componentProps: {
      options: customizeOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'customAnalysisSearch',
  },
  // {
  //   field: 'search_type',
  //   labelPrefix: '',
  //   labelPrefixWidth: 10,
  //   component: 'Select',
  //   defaultValue: 1,
  //   componentProps: {
  //     class: 't-form-label-com',
  //     allowClear: false,
  //     options: [
  //       { label: t('table.system.system_domain_main'), value: 1 },
  //       { label: t('table.system.system_domain_record'), value: 2 },
  //       { label: t('table.system.system_parse_record'), value: 3 },
  //       { label: t('table.risk.report_operate_people'), value: 4 },
  //     ],
  //   },
  //   colProps: { xxl: 2, xl: 2, lg: 5, md: 6, sm: 7 },
  // },
  // {
  //   field: 'search_value',
  //   label: '',
  //   component: 'Input',
  //   colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  //   componentProps: {
  //     class: 't-form-label-com',
  //     placeholder: t('table.member.member_inquiry_input'),
  //   },
  // },
];
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_cdn_node'),
    dataIndex: 'cdn_name',
    minWidth: 100,
  },
  {
    title: t('table.system.system_domain_main'),
    dataIndex: 'domain_name',
    minWidth: 156,
  },
  {
    title: t('table.system.system_domain_record'),
    dataIndex: 'host_record',
    minWidth: 156,
  },
  {
    title: t('table.system.system_parse_values'),
    dataIndex: 'resolve_type',
    minWidth: 156,
  },
  {
    title: t('table.system.system_parse_record'),
    dataIndex: 'record_value',
    minWidth: 156,
  },
  {
    title: 'TTL',
    dataIndex: 'ttl',
    minWidth: 156,
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'address',
    slots: { customRender: 'customizeAction' },
    minWidth: 156,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'operate_name',
    minWidth: 156,
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'operate_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.operate_at);
    },
  },
];
