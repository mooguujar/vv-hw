import { FormSchema, BasicColumn } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import dayjs from 'dayjs';
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
// 表格搜索条件
export const searchForm: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'grupList',
    colProps: { style: { marginRight: '10px' } },
    // colProps: { style: { width: '200px' } },
  },

  {
    field: 'deposit_type',
    component: 'Select',
    labelPrefixWidth: 75,
    defaultValue: '',
    labelPrefix: t('business.common_deposit_type'),
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: {
      allowClear: false,

      options: [
        {
          label: t('business.common_all'),
          value: '',
        },
        {
          label: t('business.common_deposit1'),
          value: 1,
        },
        {
          label: t('business.common_deposit2'),
          value: 2,
        },
        {
          label: t('business.common_deposit3'),
          value: 3,
        },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    label: '',
    slot: 'usernameSlot',
  },
];
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_account_type'),
    dataIndex: 'account_type',
    customRender: ({ record }: any) => {
      return record.account_type == 0
        ? t('table.member.member_partner')
        : `${record.account_type}${t('business.common_account_type_1')}`;
    },
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
  },
  {
    title: t('table.report.report_deposit_currency'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.report_first_deposit_amount'),
    dataIndex: 'first_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_first_deposit_time'),
    minWidth: 150,
    dataIndex: 'first_deposit_time',
    customRender: ({ record }) => {
      return toTimezone(record.first_deposit_time);
    },
  },
  {
    title: t('table.report.report_second_deposit_amount'),
    dataIndex: 'second_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_second_deposit_time'),
    dataIndex: 'second_deposit_time',
    customRender: ({ record }) => {
      return toTimezone(record.second_deposit_time);
    },
  },
  {
    title: t('table.report.report_third_deposit_amount'),
    dataIndex: 'third_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_third_deposit_time'),
    dataIndex: 'third_deposit_time',
    customRender: ({ record }) => {
      return toTimezone(record.third_deposit_time);
    },
  },
  {
    title: t('table.report.report_first_day_deposit'),
    dataIndex: 'first_day_deposit',
    customRender: ({ record }) => {
      const classNmae = record.first_day_deposit > 0 ? 'text-red' : '';
      return h('div', { class: classNmae }, record.first_day_deposit);
    },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_reg_time'),
    dataIndex: 'reg_time',
    minWidth: 150,
    customRender: ({ record }) => {
      return toTimezone(record.reg_time);
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
