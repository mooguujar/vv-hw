import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { optionsStates } from '../common/const';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: '',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('common.redo'),
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    slot: 'reloadTime',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'state',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('business.common_status'),
    defaultValue: 0,
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    componentProps: {
      options: optionsStates,
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
      class: 't-form-label-com',
      options: [
        { label: t('table.system.system_domain_main'), value: 1 },
        { label: t('table.risk.report_operate_people'), value: 2 },
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
      class: 't-form-label-com',
      placeholder: t('table.member.member_inquiry_input'),
    },
  },
];
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_cdn_name'),
    dataIndex: 'cdn_name',
    width: 120,
  },
  {
    title: t('table.system.system_valid_domain'),
    dataIndex: 'domain_name',
    slots: { customRender: 'domainNameSlots' },
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
  },
  {
    title: t('table.system.system_use_state'),
    dataIndex: 'use_state',
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
        record.use_state === 3 ? '#d9001b' : record.use_state === 4 ? '#d9001b' : '#63a103';
      return h('span', { style: { color: color } }, text);
    },
  },
  {
    title: t('table.system.system_https'),
    dataIndex: 'https',
    customRender: () => {
      return '-';
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'oprate',
    slots: { customRender: 'action' },
  },
  {
    title: t('table.risk.report_operate_people'),
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
