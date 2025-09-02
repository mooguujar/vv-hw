import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';

import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getbonusTypeList, getbusinessTypeList } from '/@/api/activity';
import { toTimezone } from '/@/utils/dateUtil';
import { currentyOptions } from '/@/settings/commonSetting';
import { automaticList } from '../common/const';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

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

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    labelPrefix: '',
    slot: 'grupButton',
    colProps: { style: { width: '190px' } },
  },
  // {
  //   field: 'start_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_start'),
  //   labelPrefixWidth: '45',
  //   defaultValue: dayjs().startOf('day'),

  //   colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  //   componentProps: {
  //     placeholder: t('business.common_start_time'),
  //   },
  //   slot: 'startDate',
  // },
  // {
  //   field: 'end_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_end'),
  //   labelPrefixWidth: '45',
  //   defaultValue: dayjs().endOf('day'),
  //   colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  //   componentProps: {
  //     placeholder: t('business.common_end_time'),
  //   },
  //   slot: 'endDate',
  // },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    // colProps: { xxl: 8, xl: 8, lg: 8, md: 7, sm: 8 },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },

  {
    field: 'cash_type',
    labelPrefix: t('table.discountActivity.discountActivity_type'),
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    componentProps: {
      api: async () => {
        const res = await getbonusTypeList({});
        const mappedList = res.map((item) => {
          let key = Object.keys(item)[0]; // 获取对象的键名
          let value = Object.values(item)[0]; // 获取对象的键值

          return { value: parseInt(key), label: value };
        });
        const list = [{ value: '', label: t('business.common_all') }, ...mappedList];
        return list;
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'business_type',
    labelPrefix: t('table.discountActivity.discountActivity_source'), //来源
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    componentProps: {
      api: async () => {
        const res = await getbusinessTypeList({});
        const mappedList = res.map((item) => {
          let key = Object.keys(item)[0]; // 获取对象的键名
          let value = Object.values(item)[0]; // 获取对象的键值

          return { value: parseInt(key), label: value };
        });
        const list = [{ value: '', label: t('business.common_all') }, ...mappedList];
        return list;
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'method',
    labelPrefix: t('table.discountActivity.discountActivity_method'), //方式
    labelPrefixWidth: 45,
    defaultValue: 0,
    component: 'Select',
    componentProps: {
      options: automaticList,
      allowClear: false,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];

/** 优惠明细列表 */
export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.discount_order'), //优惠单号
    dataIndex: 'bill_no',
    minWidth: 100,
  },
  {
    title: t('table.discountActivity.discount_type'), //优惠类型
    dataIndex: 'cash_type_name',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.cash_type_name ? record.cash_type_name : '-';
    },
  },
  {
    title: t('table.discountActivity.discountActivity_member'), //会员账号
    dataIndex: 'username',
    minWidth: 100,
    // customRender: ({ record }) => {
    //   return setTooltip(record.first_deposit_amount);
    // },
  },
  {
    title: t('table.discountActivity.discountActivity_currency'), //领取币种
    dataIndex: 'currency_id',
    minWidth: 100,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.discountActivity.discount_source'), //优惠来源
    dataIndex: 'business_type_name',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.business_type_name ? record.business_type_name : '-';
    },
  },
  {
    title: t('table.discountActivity.discount_way'), //领取方式
    dataIndex: 'automatic',
    minWidth: 100,
    customRender: ({ record }) => {
      let _method = '';
      automaticList.forEach((element) => {
        if (element.value == +record.automatic) _method = element.label;
      });
      return _method;
    },
  },
  {
    title: t('table.discountActivity.discount_amount'), //赠送金额
    dataIndex: 'bonus',
    minWidth: 100,
    // customRender: ({ record }) => {
    //   return setTooltip(record.bonus);
    // },
  },
  {
    title: t('table.discountActivity.discount_getting_time'), //获取时间
    dataIndex: 'apply_at',
    customRender: ({ record }) => {
      return toTimezone(record.apply_at, 'YYYY-MM-DD HH:mm:ss');
    },
    minWidth: 200,
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'review_name',
    minWidth: 120,
    // customRender: ({ record }) => {
    //   return setTooltip(record.review_name);
    // },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remark',
    minWidth: 120,
    // customRender: ({ record }) => {
    //   return setTooltip(record.remark);
    // },
  },
];

export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
