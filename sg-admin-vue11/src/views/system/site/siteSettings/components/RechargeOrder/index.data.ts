import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Divider, Tag, Tooltip } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
// import { useCurrencyStore } from '/@/store/modules/currency';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import dayjs from 'dayjs';
import {
  rechargeOrderColor,
  rechargeOrderStatus,
  virtualCurrency,
} from '/@/views/system/common/const';
import { toTimezone } from '/@/utils/dateUtil';
import { getPaymentList } from '/@/api/sys';
import { currentyOptions } from '/@/settings/commonSetting';

const { t } = useI18n();

// const { getCurrencyList } = useCurrencyStore();

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
  {
    field: 'currency_id',
    labelPrefix: t('business.common_currency'),
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    componentProps: {
      api: async () => {
        // const outputArray: any = getCurrencyList;
        return [...[{ label: t('business.common_all'), value: '' }], ...virtualCurrency];
      },
      labelField: 'label',
      valueField: 'value',
      showIcon: true,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  },
  // {
  //   field: 'start_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_period_start'), //开始时间
  //   labelPrefixWidth: 75,
  //   colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
  //   slot: 'startDate',
  //   defaultValue: dayjs().subtract(2, 'day').startOf('day').toDate(),
  //   componentProps: {
  //     getPopupContainer: () => document.body,
  //   },
  // },
  // {
  //   field: 'end_time',
  //   component: 'DatePicker',
  //   labelPrefix: t('business.common_period_end'), //结束时间
  //   labelPrefixWidth: 75,
  //   colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
  //   slot: 'endDate',
  //   defaultValue: dayjs().endOf('day').toDate(),
  //   componentProps: {
  //     getPopupContainer: () => document.body,
  //   },
  // },
	{
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().subtract(2, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    defaultValue: 0,
    component: 'Select',
    componentProps: {
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: rechargeOrderStatus[1], value: 1 },
        { label: rechargeOrderStatus[2], value: 2 },
        { label: rechargeOrderStatus[3], value: 3 },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'pay_company_id',
    component: 'ApiSelect',
    labelPrefix: t('business.common_platform'), //支付平台
    labelPrefixWidth: '45',
    defaultValue: '',
    componentProps: {
      allowClear: false,
      api: async () => {
        const companyList = await getPaymentList({
          available: 1,
        });
        return [...[{ name: t('business.common_all'), id: '' }], ...companyList]; //全部
      },
      showSearch: true,
      optionFilterProp: 'label',
      labelField: 'name',
      valueField: 'id',
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
  },
  {
    field: 'order_number',
    labelPrefix: t('business.common_order_number'),
    labelPrefixWidth: 60,
    component: 'Input',
    colProps: { xxl: 3, xl: 5, lg: 6, md: 6, sm: 7 },
    componentProps: {},
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'order_number',
    minWidth: 172,
    //width: 140,
    // customRender: ({ record }) => {
    //   return setTooltip(record.order_number);
    // },
  },
  {
    title: t('table.system.system_table_header_affiliated_group'),
    dataIndex: 'site_group',
    minWidth: 132,
    //width: 80,
    // customRender: ({ record }) => {
    //   return setTooltip(record.site_group);
    // },
  },
  {
    title: t('business.common_site_name'),
    dataIndex: 'site_name',
    minWidth: 132,
    //width: 80,
    // customRender: ({ record }) => {
    //   return setTooltip(record.site_name);
    // },
  },
  // {
  //   title: '站点编号',
  //   dataIndex: 'site_id',
  //   width: 60,
  //   customRender: ({ record }) => {
  //     return setTooltip(record.site_id);
  //   },
  // },
  {
    title: t('business.common_site_number'),
    dataIndex: 'site_code',
    minWidth: 132,
    // customRender: ({ record }) => {
    //   return setTooltip(record.site_code);
    // },
  },
  {
    title: t('modalForm.finance.finance_platform_pay'),
    dataIndex: 'pay_company_name',
    minWidth: 132,
    // customRender: ({ record }) => {
    //   return setTooltip(record.pay_company_name);
    // },
  },
  {
    title: t('table.report.report_deposit_currency'),
    dataIndex: 'currency_name',
    minWidth: 132,
    //width: 80,
    // customRender: ({ record }) => {
    //   return setTooltip(record.currency_name);
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.finance.finance_Deposit_amount'),
    dataIndex: 'pay_amount',
    minWidth: 132,
    //width: 80,
    // customRender: ({ record }) => {
    //   return setTooltip(record.pay_amount);
    // },
  },
  {
    title: t('table.finance.finance_Discounted_price'),
    dataIndex: 'discount_amount',
    minWidth: 132,
    //width: 80,
    // customRender: ({ record }) => {
    //   return setTooltip(record.discount_amount);
    // },
  },
  {
    title: t('table.finance.finance_total_points'),
    dataIndex: 'finally_amount',
    minWidth: 132,
    //width: 80,
    // customRender: ({ record }) => {
    //   return setTooltip(record.finally_amount);
    // },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 135,
    //width: 90,
    customRender: ({ record }) => {
      const state = record.state;
      return h(Tag, { color: rechargeOrderColor[state] }, () => rechargeOrderStatus[state]);
    },
  },
  {
    title: `${t('business.common_submission_time')} / ${t('business.common_auditors_time')}`,
    dataIndex: 'created_at',
    minWidth: 230,
    customRender: ({ record }) => {
      return h('div', null, [
        h('div', null, record.created_at ? toTimezone(record.created_at) : '-'),
        h(Divider),
        h('div', null, record.review_at ? toTimezone(record.review_at) : '-'),
      ]);
    },
  },
];
