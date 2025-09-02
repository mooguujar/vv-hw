import { BasicColumn, FormSchema } from '/@/components/Table';
import { useCurrencyStore } from '/@/store/modules/currency';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import eventBus from '/@/utils/eventBus';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useI18n } from '/@/hooks/web/useI18n';
import { currentyOptions } from '/@/settings/commonSetting';
import dayjs from 'dayjs';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { initBusinessType, businessTypeTreeList } = useTreeListStore();
initBusinessType();

const { getCurrencyList, getCurrencyObj } = useCurrencyStore();
let arrayTypeOption: any = [];
eventBus.on('mitttypeArray', (array: any) => {
  arrayTypeOption = array;
});
export const searchFormSchema: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    slot: 'typeid',
  },
  {
    field: 'currency_id',
    labelPrefix: t('table.member.member_money_'),
    component: 'IconSelect',
    defaultValue: '',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    componentProps: () => {
      const list = [{ label: t('business.common_all'), value: '' }, ...getCurrencyList];
      return {
        placeholder: t('business.common_all'),
        options: list,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'business_type',
    labelPrefix: t('table.finance.finance_business_type'),
    component: 'Select',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    slot: 'business_type',
    defaultValue: '',
    componentProps: ({ formModel }) => {
      const list = [{ label: t('business.common_all'), value: '' }, ...businessTypeTreeList];
      return {
        placeholder: t('business.common_all'),
        options: list,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'cash_type',
    labelPrefix: t('table.finance.finance_Change_type'),
    component: 'Select',
    colProps: { xxl: 6, xl: 5, lg: 4, md: 5, sm: 6 },
    slot: 'change_type',
    ifShow: ({ values }) => {
      return !!values.business_type;
    },
    componentProps: () => {
      return {
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        getPopupContainer: () => document.body,
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        onChange: async (e) => {
          eventBus.emit('mittChange', [formModel.time[0], formModel.time[1]]);
        },
      };
    },
  },
  {
    field: 'username',
    labelPrefix: t('table.system.system_member_account'),
    component: 'Input',
    componentProps: {
      placeholder: t('common.inputText'), //请输入
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
  },
  {
    title: t('table.member.member_money_'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
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
    title: t('table.finance.finance_Change_amount'),
    dataIndex: 'amount',
  },
  {
    title: t('table.member.member_change_before'),
    dataIndex: 'before_amount',
  },
  {
    title: t('table.member.member_change_after'),
    dataIndex: 'after_amount',
  },
  {
    title: t('business.common_change_time'),
    dataIndex: 'created_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'operator_name',
    customRender: ({ record }) => {
      return record.operator_name ? record.operator_name : '-';
    },
  },
  {
    title: t('business.common_remark'),
    dataIndex: 'remark',
    minWidth: 120,
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
