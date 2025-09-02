import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { h } from 'vue';
import { useCurrencyStore } from '/@/store/modules/currency';
import { Client } from '/@/views/common/commonSetting';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { SetTooltip } from '/@/views/common/component';

const { t } = useI18n();

const { getCurrencyList, getAllCurrencyList } = useCurrencyStore();

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    customRender: ({ record }) => {
      return SetTooltip(record.username, 12);
    },
  },
  {
    title: t('table.finance.finance_business_type'),
    dataIndex: 'business_type_name',
    customRender: ({ record }) => {
      const businessTypeName = record.business_type_name;
      return h('div', null, businessTypeName ? businessTypeName : '-');
    },
  },
  {
    title: t('table.finance.finance_Change_type'),
    dataIndex: 'cash_type_name',
    customRender: ({ record }) => {
      const styleName = record.cash_type_name;
      return h('div', null, styleName ? styleName : '-');
    },
  },
  {
    title: t('business.common_client'),
    dataIndex: 'device',
    customRender: ({ record }) => {
      const device = Client[record.device];
      return h('div', null, device ? device : '-');
    },
  },
  {
    title: t('table.finance.finance_Change_currency'),
    dataIndex: 'currency_id',
    customRender: ({ record }) => {
      const itemFind = getAllCurrencyList?.find((item) => {
        return item.id == record?.currency_id;
      });
      const styleName = itemFind?.label || '-';
      return h(cdBlockCurrency, { currencyName: styleName });
    },
  },
  {
    title: t('table.finance.finance_Change_amount'),
    dataIndex: 'amount',
  },
  {
    title: t('table.finance.finance_before_balance'),
    dataIndex: 'before_amount',
  },
  {
    title: t('table.finance.finance_after_balance'),
    dataIndex: 'after_amount',
  },
  {
    title: t('business.common_submission_time'),
    dataIndex: 'apply_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.apply_at);
    },
  },
  {
    title: t('business.common_change_time'),
    dataIndex: 'created_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('business.common_auditors'),
    dataIndex: 'operator_name',
    customRender: ({ record }) => {
      return record.operator_name ? record.operator_name : '-';
    },
  },
  {
    title: t('business.common_remarks_infor'),
    dataIndex: 'remark',
    customRender: ({ record }) => (record.remark ? SetTooltip(record.remark, 16) : '-'),
  },
];

useAutoTableLabelWidth(columns);
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'currency_id',
    labelPrefix: t('business.common_currency'),
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    componentProps: {
      api: async () => {
        const outputArray: any = getCurrencyList;
        return [...[{ label: t('business.common_all'), value: '' }], ...outputArray];
      },
      labelField: 'label',
      valueField: 'value',
      showIcon: true,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'cash_type',
    labelPrefix: t('table.finance.finance_business_type'),
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    slot: 'businessTypeModal',
  },
  {
    field: 'business_type',
    labelPrefix: t('table.finance.finance_business_type'),
    labelPrefixWidth: 70,
    defaultValue: '',
    component: 'Input',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    show: false,
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [
      dayjs().subtract(2, 'day').startOf('day').toDate(),
      dayjs().endOf('day').toDate(),
    ],
    // colProps: { xxl: 5, xl: 5, lg: 6, md: 6, sm: 7 },
    componentProps: {
      allowClear: false,
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: {
        hideDisabledOptions: true,
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
      },
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    labelPrefix: t('business.common_member_account'),
    component: 'Input',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: {},
  },
];
