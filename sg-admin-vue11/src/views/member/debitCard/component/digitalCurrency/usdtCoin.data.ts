import { BasicColumn, FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { currentyOptions } from '/@/views/common/commonSetting';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useI18n } from '/@/hooks/web/useI18n';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { getTreeList } from '/@/api/member';
import { currentProtocolNameMap } from '/@/settings/currencySetting';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();

export const usdtData: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
    minWidth: 100,
  },
  {
    title: t('modalForm.finance.finance_contract_type'),
    dataIndex: 'contract_type',
    customRender: ({ record }) => {
      return record.contract_name ? record.contract_name : '-';
    },
  },
  {
    title: t('table.member.member_wallet_adress'),
    dataIndex: 'address',
    minWidth: 120,
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
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h(Tag, { color: color }, () => text);
    },
    minWidth: 100,
  },
];
useAutoTableLabelWidth(usdtData);
export const usdtForm: FormSchema[] = [
  {
    field: 'currency_id',
    show: false,
    defaultValue: '706',
    component: 'Select',
  },
  {
    field: 'state',
    component: 'Select',
    labelPrefix: t('business.common_status'),
    defaultValue: 0,
    componentProps: {
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_normal'), value: 1 },
        { label: t('business.common_deactivate'), value: 2 },
      ],
      getPopupContainer: () => document.body,
      placeholder: t('business.common_all'),
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  },
  {
    field: 'contract_type',
    component: 'ApiSelect',
    labelPrefix: t('business.common_protocol'),
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    defaultValue: 0,
    componentProps: ({ formModel }) => {
      return {
        placeholder: t('business.common_all'),
        api: async () => {
          const all = { name: t('business.common_all'), id: 0 };
          const id = formModel['currency_id'] || '706';
          const level = currentProtocolNameMap[id];
          const response = await getTreeList({ level });

          const list = response.map((item: any) => {
            return {
              name: item?.name,
              id: Number(item?.id),
            };
          });
          return [all, ...list];
        },
        labelField: 'name',
        valueField: 'id',
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'address',
    component: 'Input',
    labelPrefix: t('table.member.member_wallet_adress'),
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 7, md: 8, sm: 9 },
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
export const btcForm: FormSchema[] = [
  {
    field: 'state',
    component: 'Select',
    labelPrefix: t('business.common_status'),
    defaultValue: 0,
    labelPrefixWidth: 45,
    componentProps: {
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_normal'), value: 1 },
        { label: t('business.common_deactivate'), value: 2 },
      ],
      getPopupContainer: () => document.body,
      placeholder: t('business.common_all'),
    },
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
  },
  {
    field: 'contract_type',
    component: 'ApiSelect',
    labelPrefix: t('business.common_protocol'),
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
    defaultValue: 0,
    labelPrefixWidth: 45,
    componentProps: () => {
      return {
        placeholder: t('business.common_all'),
        api: () => {
          const { protocoTreeList } = useTreeListStore();
          const all = { name: t('business.common_all'), id: 0 };
          const list = protocoTreeList.map((item: any) => {
            return {
              name: item?.name,
              id: Number(item?.id),
            };
          });
          return [all, ...list];
        },
        labelField: 'name',
        valueField: 'id',
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'address',
    component: 'Input',
    labelPrefix: t('table.member.member_wallet_adress'),
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 7, md: 8, sm: 9 },
  },
  {
    field: 'username',
    component: 'Input',
    labelPrefixWidth: 75,
    labelPrefix: t('business.common_member_account'),
    colProps: { xxl: 5, xl: 5, lg: 6, md: 7, sm: 8 },
  },
];
