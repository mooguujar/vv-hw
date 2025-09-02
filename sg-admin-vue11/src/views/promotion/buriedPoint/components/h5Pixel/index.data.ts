import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { isHasAuth } from '/@/utils/authFunction';

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
export const schemas: FormSchema[] = [
  // {
  //   field: 'bind',
  //   component: 'RadioGroup',
  //   label: 'Google埋点类型',
  // },
  // {
  //   field: 'created',
  //   label: 'Google埋点类型',
  //   component: 'Input',
  //   slot: 'created',
  // },
  {
    field: 'setting_bind',
    component: 'Input',
    label: '',
    slot: 'settingBind',
  },
  {
    field: 'start_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_start'), //开始时间
    labelPrefixWidth: 70,
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    slot: 'startDate',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'end_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_end'), //结束时间
    labelPrefixWidth: 70,
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    slot: 'endDate',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },

  // {
  //   field: 'category',
  //   component: 'InputNumber',
  //   defaultValue: 2,
  //   show: false,
  // },
  // {
  //   field: 'content',
  //   component: 'Input',
  //   show: false,
  // },
  // {
  //   field: 'updated_name',
  //   component: 'Input',
  //   show: false,
  // },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.promotion.promotion_bind_time'), // todo 未使用的模块
    dataIndex: 'content',
    width: 200,
    editRow: true,
    customRender: ({ record }) => {
      return setTooltip(record.content);
    },
  },
  {
    title: t('table.promotion.promotion_corresponding'),
    dataIndex: 'content',
    width: 200,
    editRow: true,
    customRender: ({ record }) => {
      return setTooltip(record.content);
    },
  },
  {
    title: 'TikTok Pixel ID',
    dataIndex: 'content',
    width: 200,
    editRow: true,
    customRender: ({ record }) => {
      return setTooltip(record.content);
    },
    ifShow: true,
  },
  {
    title: t('table.google.report_columns_APP_operator'),
    dataIndex: 'content',
    width: 200,
    editRow: true,
    customRender: ({ record }) => {
      return setTooltip(record.content);
    },
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'content',
    minWidth: 220,
    editRow: true,
    customRender: ({ record }) => {
      return setTooltip(record.content);
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'action',
    width: 200,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
  },
];
