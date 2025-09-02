import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { masterDemainState } from '../common/const';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { isControlValueSet } from '/@/utils/domUtils';

const { t } = useI18n();
masterDemainState[0].label = t('business.common_all'); //全部
masterDemainState[1].label = t('table.system.system_wait_verify'); //待验证
masterDemainState[2].label = t('business.common_normal'); //正常
masterDemainState[3].label = t('table.system.system_expired'); //已过期
export const schemas: FormSchema[] = [
  {
    field: 'created_at',
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
    field: 'state',
    component: 'Select',
    defaultValue: 0,
    labelPrefixWidth: 45,
    labelPrefix: t('business.common_status'),
    componentProps: {
      options: masterDemainState,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'domainManageSearch',
  },
];

export const columns: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 1,
    customCell: () => ({
      style: 'display:none',
    }),
    customHeaderCell: () => ({ style: 'display:none' }),
  },
  {
    title: t('table.system.system_cdnname'),
    dataIndex: 'cdn_name',
    minWidth: 120,
  },
  {
    title: t('table.system.system_demain_count'),
    dataIndex: 'child_count',
    minWidth: 100,
    slots: { customRender: 'domindChild1' },
  },
  {
    title: t('table.system.system_verify_way'),
    dataIndex: 'state',
    minWidth: 100,
    slots: { customRender: 'nameServer' },
  },
  {
    title: t('table.system.system_demain_state'),
    dataIndex: 'state',
    minWidth: 100,
    customRender: ({ record }) => {
      const text =
        record.state === 1
          ? t('business.common_normal')
          : record.state === 2
          ? t('table.system.system_wait_verify')
          : t('table.system.system_expired');
      const color =
        record.state === 1 ? '#1CD91C' : record.state === 2 ? '#1475E1' : 'rgba(68,68,68,0.27)'; //域名状态：1：正常，2：待验证，3：已过期
      return h('div', { style: { color: color } }, text);
    },
  },
  {
    title: t('table.system.system_expired_time'),
    minWidth: 100,
    dataIndex: 'expired_time',
    customRender: ({ record }) => {
      return toTimezone(record.expired_time);
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'operate',
    slots: { customRender: 'action' },
    minWidth: 160,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('table.system.remark'),
    dataIndex: 'remark',
    minWidth: 80,
    edit: !isControlValueSet(),
    className: 'edit-changeLine',
    editValueMap: (value) => {
      return value ? value : '-';
    },
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'operate_name',
    minWidth: 100,
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'operate_at',
    customRender: ({ record }) => {
      return toTimezone(record.operate_at);
    },
    minWidth: 220,
  },
];
useAutoTableLabelWidth(columns);
export const objectArr = {
  test1: '4546',
  field1a: '212313',
  field2a: '78978',
  field3a: '78979897',
};

//JS的objectArr对象循环取出来212313，78978，78979897的值
export const objectArr1 = {
  test1: '4546',
  field1a: '212313',
  field2a: '78978',
  field3a: '78979897',
};
//JS的objectArr1 含field1a，field2a，field3a筛选出来
