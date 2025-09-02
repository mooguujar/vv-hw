import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { detailsList } from '../../../common/const';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { useTreeListStore } from '/@/store/modules/treeList';
import { currentyOptions } from '/@/settings/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import dayjs from 'dayjs';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});

const { t } = useI18n();
const setTooltip = (text) => {
  return h(
    // Tooltip,
    // {
    //   title: text,
    // },
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
    // colProps: { style: { width: '190px' } },
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      allowClear: false,
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'cash_type',
    labelPrefix: t('business.common_type'), //类型
    //defaultValue: null,
    component: 'Select',
    componentProps: {
      placeholder: t('business.common_all'),
      options: detailsList,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },

  {
    field: 'username',
    labelPrefix: t('business.common_member_account'),
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },
  {
    field: 'business_type',
    component: 'Input',
    defaultValue: '837',
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.bill_no'), //单号
    dataIndex: 'bill_no',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    minWidth: 70,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id]
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_member_account'), //会员账号
    dataIndex: 'username',
    minWidth: 80,
    customRender: ({ record }) => {
      return setTooltip(record.username);
    },
  },
  {
    title: t('table.discountActivity.variation_type'), //变动类型
    dataIndex: 'cash_type_name',
    minWidth: 80,
  },
  {
    title: t('table.member.member_change_before'), //变更前金额
    dataIndex: 'before_amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return setTooltip(record.before_amount);
    },
  },
  {
    title: t('table.finance.finance_Change_amount'), //变更金额
    dataIndex: 'amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return h('div', {}, setTooltip(record.amount));
    },
  },
  {
    title: t('table.member.member_change_after'), //变更后金额
    dataIndex: 'after_amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return setTooltip(record.after_amount);
    },
  },
  {
    title: t('table.discountActivity.trading_hours'), //交易时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
