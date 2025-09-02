import { BasicColumn, FormSchema } from '/@/components/Table';
import { Tag, Tooltip } from 'ant-design-vue';
import { h, unref } from 'vue';
import { RechargeOrderItem } from '/@/api/model/financeModel';
import dayjs from 'dayjs';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

import {
  searchTypeDepositList,
  searchTypeWithdrawalList,
  stateList,
  AUDIT_TYPE,
  searchCurrencyWithdrawalList,
  stateCurrencyDepositData,
  stateRenderWithdrawalData,
  stateRenderCompanyData,
  stateRenderCurrencyDepositData,
} from '../../const';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useMemberStore } from '/@/store/modules/member';
import { getBankcardListAll, getDepositCoinAll, getwithdrawList } from '/@/api/finance';
import { useClientFinanceSelect } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { convertStateDataToList } from '/@/utils/common';
import { currentProtocolNameMap } from '/@/settings/currencySetting';
import { getTreeList } from '/@/api/member';
import { useLocale } from '@/locales/useLocale';

const { clientFinanceSelect } = useClientFinanceSelect();
const { getCurrencyList } = useCurrencyStore();
const { getLocale } = useLocale();
const { t } = useI18n();

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'orderNo',
    width: 80,
    customRender: ({ record }) => {
      return h(
        Tooltip,
        {
          title: record.orderNo,
        },
        () =>
          h(
            'div',
            {
              style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
            },
            record.orderNo,
          ),
      );
    },
  },
  {
    title: t('common.Membershiplevel'),
    dataIndex: 'memberId',
    width: 80,
  },
  {
    title: t('common.Member_ID'),
    dataIndex: 'memberId',
    width: 80,
  },
  {
    title: t('business.common_actual_name'),
    dataIndex: 'memberId',
    width: 80,
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'agentName',
    width: 120,
  },
  {
    title: t('modalForm.finance.common_income.currency'),
    dataIndex: 'agentName',
    width: 120,
  },
  {
    title: t('table.finance.finance_Deposit_method'),
    width: 100,
    dataIndex: 'way',
    customRender: ({ record }) => {
      const way = (record as RechargeOrderItem).way;
      let text = '';
      switch (way) {
        case -2:
          text = t('common.translate.word56');
          break;
        case -1:
          text = t('common.balance');
          break;
        case 0:
          text = t('common.translate.word57');
          break;
        case 1:
          text = t('common.translate.word58');
          break;
        case 2:
          text = t('table.member.member_bank_card');
          break;
        case 3:
          text = t('common.translate.word59');
          break;
      }
      return h('span', null, text);
    },
  },
  {
    title: t('common.translate.word60'),
    dataIndex: '',
    width: 140,
    customRender: ({ record }) => {
      const data = record as RechargeOrderItem;
      return h('span', null, `${data.cardName}/${data.cardHolder}`);
    },
  },
  {
    title: t('modalForm.finance.common_income.income_amount'),
    dataIndex: 'moneyStr',
    width: 100,
    // sorter: (a, b) => parseFloat(a.moneyStr) - parseFloat(b.moneyStr),

    customRender: ({ record }) => {
      return h(
        Tooltip,
        {
          title: record.moneyStr,
        },
        () =>
          h(
            'div',
            {
              style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
            },
            record.moneyStr,
          ),
      );
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      const status = (record as RechargeOrderItem).state;
      // const text = '';
      let color = '';
      switch (status) {
        case 0:
          // text = '待审核';
          color = 'blue';
          break;
        case 1:
          // text = '成功';
          color = 'green';
          break;
        case 2:
          color = 'red';
          // text = '失败';
          break;
      }
      return h(Tag, { color: color }, () => record.stateName);
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'status',
    width: 150,
    slots: { customRender: 'action' },
  },
  {
    title: `${t('business.common_submission_time')}/${t('business.common_auditors_time')}`,
    dataIndex: 'createTime',
    width: 150,
    slots: { customRender: 'time' },
  },
  {
    title: t('common.translate.word61'),
    dataIndex: 'handName',
    width: 100,
    customRender: ({ record }) => {
      const handName = record.handName;
      return h('P', null, handName ? handName : '-');
    },
  },
];

export async function processBankcardList(value, updateSchema, setFieldsValue) {
  let params = {};
  if (value != 'all') params['currency_id'] = value;
  const { d } = await getBankcardListAll(params);

  const mappedList = d.map((el) => ({
    value: el.currency_id == '702' ? el.bank_account : el.id,
    label: `${el.bank_id}/${el.currency_id == '702' ? el.bank_account : el.open_name}`,
  }));
  const list = [...mappedList];

  await updateSchema({
    field: 'bank_card_id',
    componentProps: {
      options: list,
    },
  });
  setFieldsValue && setFieldsValue({ bank_card_id: [] });
}

export async function processwalletdescList(value, updateSchema, setFieldsValue) {
  let params = {};
  if (value != 'all') params['currency_id'] = value;
  const res = await getDepositCoinAll(params);
  res.forEach((el) => {
    el.label = `${el.contract_type_name}/${el.remarks}`;
    el.value = el.id;
  });
  const list = [...res];

  updateSchema({
    field: 'wallet_desc',
    componentProps: {
      options: list,
    },
  });
  setFieldsValue && setFieldsValue({ wallet_desc: [] });
}

async function udatesearchFormSchema(value, setFieldsValue, updateSchema, type) {
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

  if (type == 'currency_withdrawal') {
    if (response.length > 1) {
      updateSchema({
        field: 'search_type',
        colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
      });
    } else {
      updateSchema({
        field: 'search_type',
        colProps: { xxl: 2, xl: 2, lg: 4, md: 5, sm: 6 },
      });
    }
  }
}

export const updateCurrencyList = async (
  currency_id,
  updateSchema,
  setFieldsValue,
  getFieldsValue,
) => {
  // const { updateSchema, setFieldsValue, getFieldsValue } = getForm();
  // let { currency_id } = getFieldsValue();
  setFieldsValue && setFieldsValue({ withdraw_merchant_id: '' });

  if (currency_id === 'all') {
    currency_id = '';
    return updateSchema({
      field: 'withdraw_merchant_id',
      componentProps: {
        options: [{ label: t('business.common_all'), value: '' }],
        getPopupContainer: () => document.body,
      },
    });
  }
  const res_companyList = await getwithdrawList({
    page_size: 111,
    page: 1,
    state: 1,
    currency_id: currency_id,
    // type_id: props.type_id,
  });

  const companyList = res_companyList.d;

  const mappedList =
    companyList?.map((el) => ({
      value: el.id,
      label: el.company_name,
    })) || [];

  const list = [...[{ label: t('business.common_all'), value: '' }], ...mappedList]; //全部
  updateSchema({
    field: 'withdraw_merchant_id',
    componentProps: {
      options: list,
      getPopupContainer: () => document.body,
    },
  });
};
// form内容
export function getSearchFormSchema(type: number, financeType: string, route: any): FormSchema[] {
  const order = route.query.order;
  let defaultOrder = 1;
  if (order) {
    if (financeType == 'company_deposit' || financeType == 'currency_deposit') {
      defaultOrder = 3;
    }
    if (financeType == 'online_withdrawal' || financeType == 'currency_withdrawal') {
      defaultOrder = 2;
    }
  }
  const schema = [
    {
      field: '_reload',
      labelPrefix: t('search.finance.finance_refresh'),
      component: 'Select',
      slot: 'reloadTime',
      colProps: {
        xxl: 3,
        xl: 3,
        lg: 3,
        md: 3,
        sm: 3,
      },
    },
    {
      field: 'currency_id',
      labelPrefix: t('business.common_currency'),
      component: 'ApiSelect',
      defaultValue: 'all',
      componentProps: ({ formActionType }) => {
        const { updateSchema, setFieldsValue, getFieldsValue } = formActionType;
        // updateCurrencyList('', updateSchema, setFieldsValue, getFieldsValue);
        return {
          api: async () => {
            const filterAttr =
              financeType === 'company_deposit' || financeType === 'online_withdrawal' ? 1 : 2;
            const outputArray = getCurrencyList.filter((el) => el.attr == filterAttr);
            return [{ label: t('business.common_all'), value: 'all' }, ...outputArray];
          },
          onChange: async (value) => {
            if (financeType === 'company_deposit') {
              // setFieldsValue({ bank_card_id: [] });
              processBankcardList(value, updateSchema, setFieldsValue);
            }
            if (financeType === 'currency_deposit') {
              // setFieldsValue({ wallet_desc: [] });
              await processwalletdescList(value, updateSchema, setFieldsValue);
            }
            if (financeType === 'currency_deposit') {
              // setFieldsValue({ wallet_desc: '' });
              udatesearchFormSchema(value, setFieldsValue, updateSchema, 'currency_deposit');
            }
            if (financeType === 'currency_withdrawal') {
              // setFieldsValue({ wallet_desc: '' });
              udatesearchFormSchema(value, setFieldsValue, updateSchema, 'currency_withdrawal');
            }
            if (financeType === 'online_withdrawal') {
              // setFieldsValue({ wallet_desc: '' });
              updateCurrencyList(value, updateSchema, setFieldsValue, getFieldsValue);
            }
          },
          onsearch: async (value) => {
            if (financeType == 'online_withdrawal') {
              // setFieldsValue({ wallet_desc: '' });
              updateCurrencyList(value, updateSchema, setFieldsValue, getFieldsValue);
            }
          },
          labelField: 'label',
          valueField: 'value',
          immediate: true,
          showIcon: true,
          allowClear: false,
          getPopupContainer: () => document.body,
        };
      },
      colProps: {
        xxl: 4,
        xl: 4,
        lg: 4,
        md: 4,
        sm: 4,
      },
    },
    {
      field: 'contract_id',
      component: 'Select',
      labelPrefixWidth: 45,
      labelPrefix: t('business.common_protocol'),
      colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
      defaultValue: '0',
      componentProps: {
        getPopupContainer: () => document.body,
        placeholder: t('business.common_all'), //全部
        options: [],
        dropdownMatchSelectWidth: false,
      },
      ifShow: ({ values }) => {
        return (
          (financeType == 'currency_deposit' || financeType == 'currency_withdrawal') &&
          values.isShow == 1
        );
      },
    },
    {
      field: 'level_id',
      labelPrefix: t('business.common_hierarchy'),
      labelPrefixWidth: 45,
      component: 'ApiSelect',
      defaultValue: '',
      colProps:
        financeType == 'online_withdrawal'
          ? { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 }
          : { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
      componentProps: {
        api: async () => {
          const memberStore = useMemberStore();
          const outputArray: { label: string; value: string }[] = [];
          outputArray.push({ label: t('business.common_all'), value: '' });
          for (const key in memberStore.levelSelect) {
            outputArray.push({ label: memberStore.levelSelect[key], value: key });
          }
          return outputArray;
        },
        labelField: 'label',
        valueField: 'value',
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'wallet_desc',
      labelPrefix: t('business.common_address'),
      component: 'Select',
      labelPrefixWidth: 45,
      colProps: { class: 'ant-col-auto multiole_select_m' },
      defaultValue: [],
      componentProps: {
        options: [],
        getPopupContainer: () => document.body,
        style: {
          width: '180px',
        },
        dropdownMatchSelectWidth: false,
        mode: 'multiple',
        maxTagCount: 1,
        maxTagTextLength: 10,
      },
      ifShow: () => {
        return financeType === 'currency_deposit';
      },
    },
    {
      field: 'bank_card_id',
      labelPrefix: t('business.common_account'),
      labelPrefixWidth: 45,
      component: 'Select',
      defaultValue: [],
      colProps: { class: 'ant-col-auto multiole_select_m' },
      componentProps: {
        options: [],
        getPopupContainer: () => document.body,
        style: {
          width: '180px',
        },
        dropdownMatchSelectWidth: false,
        mode: 'multiple',
        maxTagCount: 1,
        maxTagTextLength: 10,
      },
      ifShow: () => {
        return financeType === 'company_deposit';
      },
    },
    {
      field: 'state',
      labelPrefix: t('business.common_status'),
      defaultValue: ProcessingDefaultValue(financeType),
      component: 'ApiSelect',
      componentProps: {
        options: ProcessingStatus(financeType),
        labelField: 'label',
        valueField: 'value',
        getPopupContainer: () => document.body,
      },
      colProps: ['zh_CN'].includes(unref(getLocale))
        ? financeType == 'online_withdrawal'
          ? { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 }
          : { xxl: 5, xl: 5, lg: 4, md: 5, sm: 6 }
        : { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    },
    {
      field: 'withdraw_merchant_id',
      labelPrefix: t('business.pay_platform'),
      component: 'ApiSelect',
      componentProps: {
        labelField: 'label',
        valueField: 'value',
        getPopupContainer: () => document.body,
        dropdownMatchSelectWidth: false,
      },
      ifShow: () => {
        return financeType === 'online_withdrawal';
      },
      colProps: ['zh_CN'].includes(unref(getLocale))
        ? { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 }
        : { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    },
    {
      field: 'device',
      labelPrefix: t('business.common_client'),
      labelPrefixWidth: 60,
      component: 'Select',
      defaultValue: '',
      componentProps: {
        options: clientFinanceSelect,
        getPopupContainer: () => document.body,
      },
      colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
      ifShow: () => {
        return financeType === 'currency_deposit' || financeType === 'company_deposit';
      },
    },
    {
      field: 'time',
      labelPrefix: t('business.time_limite'),
      component: 'RangePicker',
      defaultValue: [
        dayjs().subtract(2, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate(),
      ],
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
      field: 'search_type',
      labelPrefix: '',
      component: 'Select',
      defaultValue: defaultOrder,
      colProps: {
        style: {
          width: '170px',
        },
      },
      componentProps: {
        class: 't-form-label-com',
        options:
          type === AUDIT_TYPE.DEPOSIT
            ? searchTypeDepositList
            : financeType == 'currency_withdrawal'
            ? searchCurrencyWithdrawalList
            : searchTypeWithdrawalList,
        allowClear: false,
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'search_value',
      label: '',
      component: 'Input',
      defaultValue: order ? order : '',
      colProps: {
        style: {
          marginRight: '10px',
        },
      },
      componentProps: {
        class: 't-form-label-com bl-none',
        placeholder: t('common.inputText'), //请输入查询内容
      },
    },
  ];
  useAutoLabelWidth(schema);
  return schema;
}
// 状态处理
const ProcessingStatus = (financeType: string) =>
  ({
    currency_withdrawal: convertStateDataToList(stateCurrencyDepositData),
    online_withdrawal: convertStateDataToList(stateRenderWithdrawalData),
    company_deposit: convertStateDataToList(stateRenderCompanyData),
    currency_deposit: convertStateDataToList(stateRenderCurrencyDepositData),
  }[financeType] || stateList);

// 处理默认值
const ProcessingDefaultValue = (financeType: string) =>
  ({
    currency_withdrawal: 3,
    online_withdrawal: 3,
    company_deposit: 5,
    currency_deposit: 5,
  }[financeType] || 3);
