import { BasicColumn, FormSchema } from '/@/components/Table';
import { optionsStates } from '../common/const';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import suo from '/@/assets/webp/suo.webp';
import { SetTooltip } from '/@/views/common/component';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { isControlValueSet } from '/@/utils/domUtils';

const { t } = useI18n();
optionsStates[0].label = t('business.common_all'); //全部
optionsStates[1].label = t('table.system.system_started_ed'); //待启用
optionsStates[2].label = t('table.system.system_start_'); //启用中
optionsStates[3].label = t('table.system.system_susess_start'); //启用成功
optionsStates[4].label = t('table.system.system_deact_ing'); //停用中
export const schemas: FormSchema[] = [
  {
    field: '',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('common.redo'),
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    slot: 'reloadTime',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'use_state',
    component: 'Select',
    labelPrefix: t('business.common_status'),
    defaultValue: 0,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: {
      options: optionsStates,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'webLobbySearch',
  },
  // {
  //   field: 'search_type',
  //   labelPrefix: '',
  //   labelPrefixWidth: 10,
  //   component: 'Select',
  //   defaultValue: 3,
  //   componentProps: {
  //     allowClear: false,
  //     class: 't-form-label-com',
  //     options: [
  //       { label: t('table.system.system_valid_domain'), value: 3 },
  //       { label: t('table.risk.report_operate_people'), value: 2 },
  //     ],
  //   },
  //   colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 7 },
  // },
  // {
  //   field: 'search_value',
  //   label: '',
  //   component: 'Input',
  //   // colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  //   componentProps: {
  //     class: 't-form-label-com',
  //     placeholder: t('table.member.member_inquiry_input'),
  //   },
  // },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_cdnname'),
    dataIndex: 'cdn_name',
    minWidth: 100,
    // customRender: ({ record }) => {
    //   return record.cdn_name ? SetTooltip(record.cdn_name, 6) : '-';
    // },
  },
  {
    title: t('table.system.system_valid_domain'),
    dataIndex: 'domain_name',
    slots: { customRender: 'domainNameSlots' },
    minWidth: 100,
  },
  {
    title: t('table.system.system_valid_state'),
    dataIndex: 'valid_state',
    customRender: ({ record }) => {
      const color = record.valid_state === 1 ? '#1CD91C' : '#E91134';
      const text =
        record.valid_state === 1
          ? t('table.system.system_no_force')
          : t('table.system.system_force');
      return h('span', { style: { color: color } }, text);
    },
    minWidth: 100,
  },
  {
    title: t('table.system.system_use_state'),
    dataIndex: 'use_state',
    minWidth: 160,
    customRender: ({ record }) => {
      const text =
        record.use_state === 1
          ? t('table.system.system_start_up')
          : record.use_state === 2
          ? t('table.system.system_susess_start')
          : record.use_state === 3
          ? t('table.system.system_deact_ing')
          : t('table.system.system_started_ed');
      const color =
        record.use_state === 3 ? '#E91134' : record.use_state === 4 ? '#FF9724' : '#1CD91C'; //使用状态：1：启用中，2：启用成功，3：停用中,4:待启用
      return h('span', { style: { color: color } }, text);
    },
  },
  {
    title: t('table.system.system_https'),
    dataIndex: 'https',
    minWidth: 100,
    customRender: () => {
      return h('img', { src: suo, style: { width: '20px' } });
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'oprate',
    minWidth: 160,
    slots: { customRender: 'action' },
    ifShow: !isControlValueSet(),
  },
  {
    title: t('table.risk.report_operate_people'),
    minWidth: 100,
    dataIndex: 'operate_name',
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
useAutoTableLabelWidth(columns);
