import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getDepositBankList, getwithdrawTypeCurrency } from '/@/api/finance';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

let typeList = {};

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

// CNY 表格内容
export const pixColumns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 150,
  },
  {
    title: t('modalForm.system.system_username'),
    dataIndex: 'open_name',
    minWidth: 150,
    customRender: ({ record }) => {
      return setTooltip(record.open_name);
    },
  },
  // {
  //   title: t('table.member.member_country_'),
  //   dataIndex: 'country',
  //   minWidth: 100,
  // },
  // {
  //   title: t('table.member.member_city_'),
  //   dataIndex: 'city',
  //   minWidth: 100,
  // },
  // {
  //   title: t('table.member.member_adress_'),
  //   dataIndex: 'adress',
  //   width: 150,
  // },
  {
    title: t('table.finance.finance_Payment_method1'),
    dataIndex: 'type_name',
    minWidth: 150,
  },
  {
    title: t('table.finance.withdraw_merchant'),
    dataIndex: 'bank_name',
    minWidth: 150,
  },
  {
    title: t('table.member.member_recive_account'),
    dataIndex: 'bank_account',
    minWidth: 200,
    // customRender: ({ record }) => {
    //   return setTooltip(record.bank_account);
    // },
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'is_default',
    minWidth: 80,
    customRender: ({ record }) => {
      const { is_default } = record;
      let color = '';
      let text = '';
      switch (is_default) {
        case 1:
          color = 'text-green';
          text = t('business.common_yes');
          break;
        case 2:
          text = t('business.common_no');
          break;
      }
      return h('div', { class: color }, text);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 80,
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h('span', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(pixColumns);
// CNYform内容

export const searchFormSchema: FormSchema[] = [
  {
    field: 'currency_id',
    show: false,
    component: 'Select',
    defaultValue: '701',
  },
  {
    field: 'showType',
    show: false,
    component: 'Select',
    defaultValue: true,
  },
  {
    field: 'typeId',
    show: false,
    component: 'Select',
    defaultValue: '',
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    // labelPrefixWidth: 45,
    component: 'Select',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 6, sm: 7 },
    defaultValue: 0,
    componentProps: {
      placeholder: t('business.common_all'),
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_normal'), value: 1 },
        { label: t('business.common_deactivate'), value: 2 },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'type_id',
    labelPrefix: t('table.finance.finance_Payment_method1'),
    // labelPrefixWidth: 75,
    component: 'ApiSelect',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    defaultValue: '',
    show: true,
    componentProps: ({ formModel, formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        placeholder: t('business.common_all'),
        api: async () => {
          const currency_id = formModel['currency_id'] || '701';
          const all = { label: t('business.common_all'), value: '' };
          const res = await getwithdrawTypeCurrency({
            state: 1,
          });
          typeList = res;
          const bank_list1 = res[currency_id];
          const arr1 = bank_list1.map((item: any) => {
            return { label: item.name, value: item.id };
          });
          return [all, ...arr1];
        },
        onChange: async (value) => {
          const currency_id = formModel['currency_id'] || '701';
          let itemConfig = typeList[currency_id].find((el) => el.id == value);
          if (itemConfig) {
            setFieldsValue({ typeId: itemConfig.type });
            setFieldsValue({ showType: false });
            setTimeout(() => {
              setFieldsValue({ showType: true });
            });
          } else {
            setFieldsValue({ typeId: '' });
          }
        },
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'bank_name',
    labelPrefix: t('table.member.member_bank_type'),
    // labelPrefixWidth: 75,
    component: 'ApiSelect',
    colProps: { xxl: 6, xl: 5, lg: 5, md: 6, sm: 7 },
    defaultValue: '',
    componentProps: ({ formModel }) => {
      return {
        placeholder: t('business.common_all'),
        api: async () => {
          const all = { label: t('business.common_all'), value: '' };
          const { bank_list } = await getDepositBankList({
            currency_id: formModel['currency_id'] || '701',
            type_id: formModel['typeId'],
          });
          const arr = bank_list.map((item: any) => {
            return { label: item.name, value: item.name };
          });
          return [all, ...arr];
        },
        getPopupContainer: () => document.body,
      };
    },
    ifShow: ({ values }) => {
      return values.showType;
    },
  },
  {
    field: 'bank_account',
    component: 'Input',
    labelPrefix: t('table.member.member_recive_account'),
    // labelPrefixWidth: '75',
    colProps: { xxl: 6, xl: 5, lg: 5, md: 6, sm: 7 },
  },
  {
    field: '',
    label: '',
    labelWidth: 0,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 12, sm: 16 },
  },
];

// PBL 表格内容
export const pblColumns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 150,
  },
  {
    title: t('modalForm.system.system_username'),
    dataIndex: 'open_name',
    minWidth: 150,
  },
  // {
  //   title: t('table.member.member_country_'),
  //   dataIndex: 'country',
  //   minWidth: 100,
  // },
  // {
  //   title: t('table.member.member_city_'),
  //   dataIndex: 'city',
  //   minWidth: 100,
  // },
  // {
  //   title: t('table.member.member_adress_'),
  //   dataIndex: 'adress',
  //   width: 150,
  // },
  {
    title: t('table.finance.finance_Payment_method1'),
    dataIndex: 'type_name',
    minWidth: 150,
  },
  // {
  //   title: t('table.finance.withdraw_merchant'),
  //   dataIndex: 'withdraw_merchant',
  //   minWidth: 150,
  // },
  {
    title: t('table.finance.withdraw_merchant'),
    dataIndex: 'bank_name',
    minWidth: 150,
  },
  {
    title: t('table.member.member_recive_account'),
    dataIndex: 'bank_account',
    minWidth: 200,
    // customRender: ({ record }) => {
    //   return setTooltip(record.bank_account);
    // },
  },
  {
    title: 'CPF',
    dataIndex: 'bank_area_cpf',
    minWidth: 150,
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'is_default',
    minWidth: 80,
    customRender: ({ record }) => {
      const { is_default } = record;
      let color = '';
      let text = '';
      switch (is_default) {
        case 1:
          color = 'text-green';
          text = t('business.common_yes');
          break;
        case 2:
          text = t('business.common_no');
          break;
      }
      return h('div', { class: color }, text);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 80,
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h('span', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(pblColumns);
// CNY
export const CNYColumns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 150,
  },
  {
    title: t('modalForm.system.system_username'),
    dataIndex: 'open_name',
    minWidth: 150,
  },
  {
    title: t('table.finance.finance_Payment_method1'),
    dataIndex: 'type_name',
    minWidth: 150,
  },
  // {
  //   title: t('table.member.member_country_'),
  //   dataIndex: 'country',
  //   minWidth: 100,
  // },
  // {
  //   title: t('table.member.member_city_'),
  //   dataIndex: 'city',
  //   minWidth: 100,
  // },
  // {
  //   title: t('table.member.member_adress_'),
  //   dataIndex: 'adress',
  //   width: 150,
  // },
  {
    title: t('table.finance.withdraw_merchant'),
    dataIndex: 'bank_name',
    minWidth: 150,
  },
  {
    title: t('modalForm.finance.finance_opening_outlets'),
    dataIndex: 'address',
    minWidth: 150,
  },
  {
    title: t('table.member.member_recive_account'),
    dataIndex: 'bank_account',
    minWidth: 200,
    // customRender: ({ record }) => {
    //   return setTooltip(record.bank_account);
    // },
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'is_default',
    minWidth: 80,
    customRender: ({ record }) => {
      const { is_default } = record;
      let color = '';
      let text = '';
      switch (is_default) {
        case 1:
          color = 'text-green';
          text = t('business.common_yes');
          break;
        case 2:
          text = t('business.common_no');
          break;
      }
      return h('div', { class: color }, text);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 80,
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h('span', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(CNYColumns);
// PBLform内容
export const pblSearchFormSchema: FormSchema[] = [
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    component: 'Select',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
    defaultValue: 0,
    componentProps: {
      placeholder: t('business.common_all'),
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_normal'), value: 1 },
        { label: t('business.common_deactivate'), value: 2 },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'bank_name',
    labelPrefix: t('table.member.member_bank_type'),
    labelPrefixWidth: 75,
    component: 'ApiSelect',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    defaultValue: '',
    componentProps: () => {
      return {
        placeholder: t('business.common_all'),
        api: async () => {
          const all = { label: t('business.common_all'), value: '' };
          const data = await getDepositBankList({ currency_id: 701 });
          // const { getBankCurrencyTreeList } = useTreeListStore();
          // const arr = getBankCurrencyTreeList.map((item: any) => {
          //   return { label: item.name, value: item.name };
          // });
          // return [all, ...arr];
        },
        // labelField: 'name',
        // valueField: 'name',
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'bank_account',
    component: 'Input',
    labelPrefix: t('table.member.member_recive_account'),
    labelPrefixWidth: '75',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  },
  {
    field: '',
    label: '',
    labelWidth: 0,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 12, sm: 16 },
  },
];
