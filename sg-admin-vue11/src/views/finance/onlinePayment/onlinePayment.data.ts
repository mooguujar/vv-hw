import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';
import { RechargeOrderItem } from '/@/api/model/financeModel';
import { Client, useClientFinanceSelect } from '/@/views/common/commonSetting';
import { stateRenderColor, stateOnlineRenderData } from '../common/const';
import { useCurrencyStore } from '/@/store/modules/currency';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFinancePlatformList, getFinanceMethodList } from '/@/api/select';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { currentProtocolNameMap } from '/@/settings/currencySetting';
import { getTreeList } from '/@/api/member';
import { isVirtualCurrency } from '/@/utils/common';
import { SetTooltip } from '/@/views/common/component';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
const { t } = useI18n();
const { clientFinanceSelect } = useClientFinanceSelect();
const { getCurrencyList } = useCurrencyStore();

// 表格内容
clientFinanceSelect[0] = { label: t('business.common_all'), value: '' };
export const columns: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'order_number',
    customRender: ({ record }) => {
      return SetTooltip(record.order_number, 15);
    },
  },
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
  },
  {
    title: t('table.finance.finance_platform'),
    dataIndex: 'pay_company_name',
    customRender: ({ record }) => {
      const pay_company_name = record.pay_company_name;
      return h('span', null, pay_company_name ? pay_company_name : '-');
    },
  },
  {
    title: t('table.finance.finance_Way'),
    dataIndex: 'pay_method_name',
    customRender: ({ record }) => {
      const pay_method_name = record.pay_method_name;
      return h('span', null, pay_method_name ? pay_method_name : '-');
    },
  },
  {
    title: t('table.finance.finance_Deposit_currency'),
    dataIndex: 'currency_name',
    customRender: ({ record }) => h(cdBlockCurrency, { currencyName: record.currency_name }),
  },
  {
    title: t('table.finance.finance_Deposit_amount'),
    dataIndex: 'pay_amount',
  },
  {
    title: t('table.finance.finance_Discounted_price'),
    dataIndex: 'discount_amount',
  },
  {
    title: t('table.finance.finance_total_points'),
    dataIndex: 'finally_amount',
    customRender: ({ record }) => {
      return h(() =>
        h(
          'div',
          {
            style: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              color: '#E91134',
            },
          },
          record.finally_amount,
        ),
      );
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      const state = (record as RechargeOrderItem).state;
      return h('div', { style: { color: stateRenderColor[state] } }, stateOnlineRenderData[state]);
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    slots: { customRender: 'action' },
    ifShow: auths(['20102']),
  },
  {
    title: `${t('business.common_submission_time')} / ${t('business.common_auditors_time')}`,
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.created_at ? toTimezone(record.created_at) : '-',
        line2: record.review_at ? toTimezone(record.review_at) : '-',
      });
    },
  },
  {
    title: t('business.common_auditors'),
    dataIndex: 'review_name',
    customRender: ({ record }) => {
      const review_name = record.review_name;
      return h('span', null, review_name ? review_name : '-');
    },
  },
  {
    title: t('business.common_client'),
    dataIndex: 'device',
    customRender: ({ record }) => {
      return Client[record.device];
    },
  },
];
useAutoTableLabelWidth(columns);
export function setcolumns() {
  return;
}

export async function processwalletdescList(value, updateSchema) {
  const params = {};
  if (value != 'all') params['currency_id'] = value;
  const response = await getFinancePlatformList({
    state: 0,
    ...params,
  });
  const companyList: [{ label: any; value: any }] =
    response?.d?.map((item) => {
      return { label: item.name, value: item.id };
    }) || [];
  const list = [...[{ label: t('business.common_all'), value: '' }], ...companyList];

  updateSchema({
    field: 'pay_company_id',
    componentProps: {
      options: list,
    },
  });
}

export async function processFinanceMethodList(value, updateSchema) {
  const params = {};
  if (value != 'all') params['currency_id'] = value;
  const response = await getFinanceMethodList({
    state: 1,
    ...params,
  });
  const methodList: [{ label: any; value: any }] =
    response?.map((item) => {
      return { label: item.name, value: item.id };
    }) || [];
  const list = [...[{ label: t('business.common_all'), value: '' }], ...methodList];

  updateSchema({
    field: 'pay_method_id',
    componentProps: {
      options: list,
    },
  });
}

async function udatesearchFormSchema(value, setFieldsValue, updateSchema) {
  if (value == 'all') {
    setFieldsValue({ isShow: 0 });
    updateSchema({
      field: 'time',
      colProps: { class: 'ant-col-auto-width' },
    });
    return false;
  }
  const all = { label: t('business.common_all'), value: '0' };
  const id = value;
  const level = currentProtocolNameMap[id];
  const response = await getTreeList({ level });

  if (response.length > 1) {
    setFieldsValue({ isShow: 1 });
    updateSchema({
      field: 'time',
      colProps: { class: 'ant-col-auto' },
    });
  } else {
    setFieldsValue({ isShow: 0 });
    updateSchema({
      field: 'time',
      colProps: { class: 'ant-col-auto-width' },
    });
  }

  setFieldsValue({ contract_id: '0' });

  const list = response.map((item: any) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  updateSchema({
    field: 'contract_id',
    componentProps: {
      options: [all, ...list],
    },
  });
}

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: '_reload',
    labelPrefix: t('search.finance.finance_refresh'),
    component: 'Select',
    slot: 'reloadTime',
    // colProps: {
    //   xxl: 3,
    //   xl: 3,
    //   lg: 4,
    //   md: 4,
    //   sm: 4,
    //   style: {
    //     width: '140px',
    //   },
    // },
  },
  {
    field: 'currency_id',
    labelPrefix: t('business.common_currency'),
    component: 'ApiSelect',
    defaultValue: 'all',
    componentProps: ({ formActionType }) => {
      const { updateSchema, setFieldsValue } = formActionType;
      return {
        api: async () => {
          const outputArray: any = getCurrencyList;
          return [...[{ label: t('business.common_all'), value: 'all' }], ...outputArray];
        },
        labelField: 'label',
        valueField: 'value',
        showIcon: true,
        onChange: async (value) => {
          setFieldsValue({ pay_company_id: '', pay_method_id: '' });
          processwalletdescList(value, updateSchema);
          processFinanceMethodList(value, updateSchema);
          if (value && isVirtualCurrency(value))
            udatesearchFormSchema(value, setFieldsValue, updateSchema);
          else setFieldsValue({ isShow: 0 });
        },
        getPopupContainer: () => document.body,
      };
    },
    // colProps: {
    //   xxl: 4,
    //   xl: 4,
    //   lg: 4,
    //   md: 4,
    //   sm: 4,
    //   style: {
    //     width: '160px',
    //   },
    // },
  },
  {
    field: 'contract_id',
    component: 'Select',
    labelPrefixWidth: 45,
    labelPrefix: t('business.common_protocol'),
    // colProps: {
    //   xxl: 4,
    //   xl: 4,
    //   lg: 5,
    //   md: 6,
    //   sm: 7,
    //   style: {
    //     minWidth: '185px',
    //   },
    // },
    defaultValue: '0',
    componentProps: {
      placeholder: t('business.common_all'), //全部
      dropdownMatchSelectWidth: false,
      options: [],
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => {
      return values.isShow == 1;
    },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    defaultValue: 0,
    component: 'Select',
    componentProps: {
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: stateOnlineRenderData[1], value: 1 },
        { label: stateOnlineRenderData[2], value: 2 },
        { label: stateOnlineRenderData[3], value: 3 },
      ],
      getPopupContainer: () => document.body,
    },
    // colProps: { xxl: 3, xl: 3, lg: 3, md: 5, sm: 5 },
    // colProps: { class: 'ant-col-auto-width' },  //注释修复过长
  },
  {
    field: 'device',
    labelPrefix: t('business.common_client'),
    component: 'Select',
    defaultValue: '',
    componentProps: {
      options: clientFinanceSelect,
      getPopupContainer: () => document.body,
    },
    // colProps: { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 },
  },
  {
    field: 'pay_company_id',
    component: 'Select',
    labelPrefix: t('business.common_platform'),
    labelPrefixWidth: '45',
    defaultValue: '',
    componentProps: {
      options: [],
      allowClear: true,
      showSearch: true,
      getPopupContainer: () => document.body,
      dropdownMatchSelectWidth: false,
    },
    // colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 8 },
  },
  {
    field: 'pay_method_id',
    component: 'Select',
    labelPrefix: t('business.common_way'),
    labelPrefixWidth: '45',
    defaultValue: '',
    componentProps: {
      options: [],
      allowClear: true,
      showSearch: true,
      getPopupContainer: () => document.body,
      dropdownMatchSelectWidth: false,
    },
    // colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 8 },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
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
    colProps: {
      xxl: 7,
      xl: 7,
      lg: 7,
      md: 8,
      sm: 8,
      style: {
        minWidth: '520px',
      },
    },
  },
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
  },
];
