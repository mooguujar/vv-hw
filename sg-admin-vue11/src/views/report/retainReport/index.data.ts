import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { currentyOptions } from '/@/settings/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    labelPrefix: '',
    slot: 'grupButton',
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'),
    dataIndex: 'name',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_count_date'),
    dataIndex: 'count_date',
    width: 160,
    customRender: ({ record }) => {
      return toTimezone(record.count_date, 'YYYY-MM-DD ');
    },
  },
  {
    title: t('table.report.report_firstdepositors_number'),
    dataIndex: 'deposit_num_total',
  },
  {
    title: t('table.report.report_first_deposit_amount'),
    dataIndex: 'deposit_amount_total',
  },
  {
    title: t('table.report.report_day2_retain_t'),
    dataIndex: 'th2_deposit_amount',
    width: 300,
    children: [
      {
        title: t('table.report.report_deposit_amount_total'),
        dataIndex: 'th2_deposit_amount',
      },
      {
        title: t('table.report.report_retain_num_total'),
        dataIndex: 'th2_deposit_num',
      },
      {
        title: t('table.report.report_retain_percent'),
        dataIndex: 'th2_deposit_rate',
        customRender: ({ record }) => {
          return h('span', { class: 'text-red' }, `${record.th2_deposit_rate}%`);
        },
      },
    ],
  },
  {
    title: t('table.report.report_day3_retain'),
    dataIndex: 'th3_deposit_amount',
    width: 300,
    children: [
      {
        title: t('table.report.report_deposit_amount_total'),
        dataIndex: 'th3_deposit_amount',
      },
      {
        title: t('table.report.report_retain_num_total'),
        dataIndex: 'th3_deposit_num',
      },
      {
        title: t('table.report.report_retain_percent'),
        dataIndex: 'th3_deposit_rate',
        customRender: ({ record }) => {
          return h('span', { class: 'text-red' }, `${record.th3_deposit_rate}%`);
        },
      },
    ],
  },
  {
    title: t('table.report.report_day5_retain'),
    dataIndex: 'th5_deposit_amount',
    width: 300,
    children: [
      {
        title: t('table.report.report_deposit_amount_total'),
        dataIndex: 'th5_deposit_amount',
      },
      {
        title: t('table.report.report_retain_num_total'),
        dataIndex: 'th5_deposit_num',
      },
      {
        title: t('table.report.report_retain_percent'),
        dataIndex: 'th5_deposit_rate',
        customRender: ({ record }) => {
          return h('span', { class: 'text-red' }, `${record.th5_deposit_rate}%`);
        },
      },
    ],
  },
  {
    title: t('table.report.report_day7_retain'),
    dataIndex: 'th7_deposit_amount',
    width: 300,
    children: [
      {
        title: t('table.report.report_deposit_amount_total'),
        dataIndex: 'th7_deposit_amount',

        customRender: ({ record }) => {
          return record.th7_deposit_amount;
        },
      },
      {
        title: t('table.report.report_retain_num_total'),
        dataIndex: 'th7_deposit_num',

        customRender: ({ record }) => {
          return record.th7_deposit_num;
        },
      },
      {
        title: t('table.report.report_retain_percent'),
        dataIndex: 'th7_deposit_rate',
        customRender: ({ record }) => {
          return h('span', { class: 'text-red' }, `${record.th7_deposit_rate}%`);
        },
      },
    ],
  },
  {
    title: t('table.report.report_day15_retain'),
    dataIndex: 'th15_deposit_amount',
    width: 300,
    children: [
      {
        title: t('table.report.report_deposit_amount_total'),
        dataIndex: 'th15_deposit_amount',

        customRender: ({ record }) => {
          return record.th15_deposit_amount;
        },
      },
      {
        title: t('table.report.report_retain_num_total'),
        dataIndex: 'th15_deposit_num',
        customRender: ({ record }) => {
          return record.th15_deposit_num;
        },
      },
      {
        title: t('table.report.report_retain_percent'),
        dataIndex: 'th15_deposit_rate',
        customRender: ({ record }) => {
          return h('span', { class: 'text-red' }, `${record.th15_deposit_rate}%`);
        },
      },
    ],
  },
  {
    title: t('table.report.report_day30_retain'),
    dataIndex: 'th30_deposit_amount',
    children: [
      {
        title: t('table.report.report_deposit_amount_total'),
        dataIndex: 'th30_deposit_amount',

        customRender: ({ record }) => {
          return record.th30_deposit_amount;
        },
      },
      {
        title: t('table.report.report_retain_num_total'),
        dataIndex: 'th30_deposit_num',
        customRender: ({ record }) => {
          return record.th30_deposit_num;
        },
      },
      {
        title: t('table.report.report_retain_percent'),
        dataIndex: 'th30_deposit_rate',
        customRender: ({ record }) => {
          return h('span', { class: 'text-red' }, `${record.th30_deposit_rate}%`);
        },
      },
    ],
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
