import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { virtualCurrency } from '/@/views/system/common/const';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'currency_id',
    labelPrefix: t('business.common_currency'),
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    componentProps: {
      api: async () => {
        return [...[{ label: t('business.common_all'), value: '' }], ...virtualCurrency];
      },
      labelField: 'label',
      valueField: 'value',
      showIcon: true,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
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
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [
      dayjs().subtract(2, 'day').startOf('day').toDate(),
      dayjs().endOf('day').toDate(),
    ],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_table_header_site_name'), //站点名称
    dataIndex: 'site_name',
    minWidth: 80,
  },
  {
    title: t('business.common_site_number'), //站点编号
    dataIndex: 'site_code',
    minWidth: 80,
  },
  {
    title: t('table.finance.finance_business_type'),
    dataIndex: 'business_type',
    minWidth: 80,
    customRender: ({ record }) => {
      return record.business_type;
    },
  },
  {
    title: t('table.finance.finance_Change_type'),
    dataIndex: 'cash_type',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.cash_type;
    },
  },
  {
    title: t('table.finance.finance_Change_currency'),
    dataIndex: 'currency_name',
    minWidth: 80,
    customRender: ({ record }) => h(cdBlockCurrency, { currencyName: record.currency_name }),
  },
  {
    title: t('common.ChangeAmount'),
    dataIndex: 'amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return record.amount;
    },
  },
  {
    title: t('table.finance.finance_before_balance'),
    dataIndex: 'before_amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return record.before_amount;
    },
  },
  {
    title: t('table.finance.finance_after_balance'),
    dataIndex: 'after_amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return record.after_amount;
    },
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
    title: t('table.member.member_change_time'),
    dataIndex: 'created_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];
useAutoTableLabelWidth(columns);
