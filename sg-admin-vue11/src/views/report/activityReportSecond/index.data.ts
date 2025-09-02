import { h, ref } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
import eventBus from '/@/utils/eventBus';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
const ShowState = ref(true);
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
const cashTypeList = ref([] as any);

eventBus.on('emitCashTypeListOption', (data) => {
  cashTypeList.value = data;
});

const getMethodsList = [
  { label: t('business.common_all'), value: '' },
  { label: t('business.common_auto_1'), value: 1 },
  { label: t('business.common_auto_2'), value: 2 },
  { label: t('business.common_auto_3'), value: 3 },
];
export const searchForm = [
  {
    field: 'backButton',
    component: 'Input',
    label: '',
    slot: 'backButton',
    colProps: {
      style: {
        marginRight: '10px',
      },
    },
  },
  {
    field: 'currency_id',
    component: 'Input',
    labelPrefix: t('business.common_currency'),
    labelPrefixWidth: 60,
    slot: 'currencySlot',
    componentProps: {
      defaultValue: '',
    },
    ifShow: ({ values }) => values.backButton?.[1] == 1,
  },

  {
    field: 'cash_type',
    component: 'ApiSelect',
    labelPrefix: t('business.common_type'),
    labelPrefixWidth: 60,
    defaultValue: '',
    componentProps: () => {
      return {
        api: async () => cashTypeList.value,
        style: 'width:100px',
        labelField: 'name',
        valueField: 'id',
        allowClear: false,

        getPopupContainer: () => document.body,
      };
    },
    ifShow: ({ values }) => values.backButton?.[0] == 1,
  },
  {
    field: 'receive_type',
    component: 'Select',
    labelPrefix: t('table.discountActivity.discount_way'),
    defaultValue: '',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    componentProps: () => {
      return {
        options: getMethodsList,
        allowClear: false,
        getPopupContainer: () => document.body,
        onChange: (value) => {
          !value || value == 3 ? (ShowState.value = true) : (ShowState.value = false);
        },
      };
    },
  },
  {
    field: 'bill_no',
    component: 'Input',
    labelPrefixWidth: 90,
    labelPrefix: t('table.discountActivity.discount_order'),
  },
  {
    field: 'username',
    component: 'Input',
    labelPrefixWidth: 90,
    labelPrefix: t('business.common_agent_account'),
  },
  {
    field: 'operator_name',
    component: 'Input',
    labelPrefixWidth: 90,
    labelPrefix: t('table.google.report_columns_APP_operator'),

    ifShow: ShowState,
  },
];

export const columns = [
  {
    title: t('table.discountActivity.discount_order'),
    dataIndex: 'bill_no',
    customRender: ({ record }) => {
      return record.bill_no.length > 18 ? setTooltip(record.bill_no) : record.bill_no;
    },
  },
  {
    title: t('table.discountActivity.discount_type'),
    dataIndex: 'cash_type',
    customRender: ({ record }) => {
      return record.cash_type_name ? record.cash_type_name : '-';
    },
  },
  {
    title: t('business.common_agent_account'),
    dataIndex: 'username',
  },
  {
    title: t('table.member.member_recive_coin'),
    dataIndex: 'currency_name',
    customRender: ({ record }) => {
      return h(
        'div',
        { style: { display: 'flex', 'justify-content': 'center', 'align-items': 'center' } },
        [
          h(cdIconCurrency, {
            icon: record.currency_name,
            style: {
              width: '18px',
              marginRight: '3px',
            },
          }), // 使用 cdIconCurrency 组件，并传递 icon 属性
          h('span', {}, record.currency_name), // 显示币种名称
        ],
      );
    },
  },
  {
    title: t('table.discountActivity.discount_way'),
    dataIndex: 'receive_type',
    customRender: ({ record }) => {
      const name = getMethodsList.filter((item) => item.value == record.receive_type);
      return record.bill_no == '总计' ? '-' : name[0].label; // todo
    },
  },
  {
    title: t('business.common_member_discount_money'),
    dataIndex: 'amount',
  },
  {
    title: t('table.discountActivity.discount_getting_time'),
    dataIndex: 'username',
    minWidth: 200,
    customRender: ({ record }) => {
      return record.bill_no == '总计' ? '-' : toTimezone(record.apply_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.google.report_columns_APP_operator'),
    dataIndex: 'operator_name',
  },
];
useAutoTableLabelWidth(columns);
