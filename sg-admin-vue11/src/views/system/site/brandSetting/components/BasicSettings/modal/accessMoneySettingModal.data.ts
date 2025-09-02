import { FormSchema } from '/@/components/Table';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { useI18n } from '/@/hooks/web/useI18n';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';

// 判断是否为中文简体
export const isZhCN = () => locale === 'zh_CN';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
const currentLanguage = useLocaleStoreWithOut();
const locale = currentLanguage.getLocale;
const labelWidth = (() => {
  switch (locale) {
    case 'vi_VN':
    case 'en_US':
      return '360';
    default:
      return '200';
  }
})();
export const getSchemaBase = (type: string) => {
  if (type == 'bet_limit') {
    // return [
    //   ...currencyTreeList.map(item => {
    //     return {
    //       field: 'c'+item.id,
    //       label: item.name + '投注限额',
    //       component: 'InputNumber',
    //       defaultValue: [null, null],
    //       colProps: {
    //         span: 18,
    //       },
    //       componentProps: {
    //         placeholder:'最低投注额'
    //       },
    //       render: ({ model, field }) => {
    //       return h(FormItemRest, null, () =>
    //         h('div', { class: 'flex justify-between items-center' }, [
    //           h(InputNumber, {
    //             stringMode: true,
    //             size: unref(FORM_SIZE),
    //             style: { width: '45%' },
    //             placeholder: '最低投注金额',
    //             value: model[field],
    //             onChange: (e) => {
    //               model[field]= e;
    //               //model.amount_min = e;
    //             },
    //           }),
    //           h('span', null, '—'),
    //           h(InputNumber, {
    //             stringMode: true,
    //             size: unref(FORM_SIZE),
    //             style: { width: '45%' },
    //             placeholder: '最高投注金额',
    //             value: model[field],
    //             max: 999999999,
    //             onChange: (e) => {
    //               model[field] = e;
    //               //model.amount_max = e;
    //             },
    //           }),
    //     ]),
    //   );
    // },
    //     }
    //   })
    // ]
  } else {
    return [
      {
        field: 'min_withdraw',
        label: t('modalForm.system.system_min_withdrawal'),
        component: 'InputNumber',
        required: true,
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: t('common.enterLowerestAmountNoLimit0'),
        },
        renderComponentContent: () => {
          return {
            addonAfter: () => 'USDT',
          };
        },
      },
      {
        field: 'min_deposit',
        label: t('modalForm.system.system_min_deposit'),
        component: 'InputNumber',
        required: true,
        componentProps: {
          placeholder: t('common.enterLowerestDepositNoLimit0'),
        },
        colProps: {
          span: 24,
        },
        renderComponentContent: () => {
          return {
            addonAfter: () => 'USDT',
          };
        },
      },
    ];
  }
};

export const schema: FormSchema[] = [
  {
    field: 'title',
    label: '',
    component: 'Input',
    slot: 'site-form',
    colProps: {
      span: 24,
    },
  },
];

export const schemaTable: FormSchema[] = [
  {
    field: 'min_withdraw',
    label: t('modalForm.system.system_min_withdrawal'),
    component: 'InputNumber',
    slot: 'minWithdraw',
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'min_deposit',
    label: t('modalForm.finance.finance_min_deposit'),
    component: 'InputNumber',
    slot: 'minDeposit',
    required: true,
    colProps: {
      span: 24,
    },
  },
];

export const schemaPwaSetting: FormSchema[] = [
  {
    field: 'pwaEnabled',
    component: 'RadioGroup',
    label: t('common.pwa') + ':',
    defaultValue: false,
    colProps: { span: 24 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.close'), value: false }, //
        { label: t('table.system.open'), value: true }, //
      ],
    },
    required: false,
  },
  {
    field: 'minAmount',
    label: t('common.h5_user_popup_condition') + ':' + t('common.active_text10') + '≥',
    component: 'InputNumber',
    required: false,
    itemProps: {
      labelAlign: 'left',
      labelCol: { style: { width: isZhCN() ? '150px' : 'auto' } },
    },
    colProps: {
      span: isZhCN() ? 11 : 20,
    },
    componentProps: {
      placeholder: t('v.discount.activity.please_tip'),
      precision: 0,
      step: 1,
      min: 0,
    },
    ifShow: ({ values }) => {
      return values.pwaEnabled;
    },
  },
  {
    field: 'minBalance',
    label: t('common.time_bonus') + '≥',
    component: 'InputNumber',
    required: false,
    itemProps: {
      labelAlign: 'left',
      labelCol: { style: { width: isZhCN() ? '90px' : 'auto', marginLeft: '10px' } },
    },
    colProps: {
      span: isZhCN() ? 9 : 16,
    },
    componentProps: {
      placeholder: t('v.discount.activity.please_tip'),
      precision: 0,
      step: 1,
      min: 0,
      style: { borderRight: 'none !important', borderRadius: '4px 0 0 4px' },
    },
    ifShow: ({ values }) => {
      return values.pwaEnabled;
    },
  },
  {
    field: 'minCurrency',
    label: '',
    component: 'ApiSelect',
    rules: [
      {
        required: true,
        message: t('modalForm.member.member_currency_selection'),
      },
    ],
    componentProps: {
      placeholder: t('modalForm.member.member_currency_selection'),
      options: [...getCurrencyList],
      showIcon: true,
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => {
      return values.pwaEnabled;
    },
  },
  {
    field: 'bonusEnabled',
    component: 'RadioGroup',
    label: t('common.h5_user_conversion_pwa_bonus') + ':',
    defaultValue: false,
    itemProps: {
      labelAlign: 'left',
      labelCol: { style: { width: labelWidth, textAlign: 'right' } },
    },
    colProps: { span: 24 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('v.discount.activity.payConfig2'), value: false }, //
        { label: t('v.discount.activity.payConfig1'), value: true }, //
      ],
    },
    required: false,
    ifShow: ({ values }) => {
      return values.pwaEnabled;
    },
  },
  {
    field: 'bonusAmount',
    label: t('common.free_bonus') + ':',
    component: 'InputNumber',
    required: false,
    itemProps: {
      labelAlign: 'left',
      labelCol: { style: { width: isZhCN() ? '70px' : 'auto' } },
    },
    colProps: {
      span: isZhCN() ? 8 : 16,
    },
    componentProps: {
      placeholder: t('v.discount.activity.please_tip'),
      precision: 0,
      step: 1,
      min: 0,
      style: { borderRight: 'none !important', borderRadius: '4px 0 0 4px' },
    },
    ifShow: ({ values }) => {
      return values.bonusEnabled && values.pwaEnabled;
    },
  },
  {
    field: 'bonusCurrency',
    label: '',
    component: 'ApiSelect',
    rules: [
      {
        required: true,
        message: t('modalForm.member.member_currency_selection'),
      },
    ],
    componentProps: {
      placeholder: t('modalForm.member.member_currency_selection'),
      options: [...getCurrencyList],
      showIcon: true,
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => {
      return values.bonusEnabled && values.pwaEnabled;
    },
  },
  {
    field: 'bonusMultiplier',
    label: t('common.bonus_multiplier') + ':',
    component: 'InputNumber',
    required: false,
    itemProps: {
      labelCol: {
        style: { width: isZhCN() ? '160px' : 'auto', marginLeft: '10px', marginRight: '10px' },
      },
    },
    colProps: {
      span: isZhCN() ? 12 : 16,
    },
    componentProps: {
      placeholder: t('v.discount.activity.please_tip'),
      precision: 0,
      step: 1,
      min: 0,
    },
    ifShow: ({ values }) => {
      return values.bonusEnabled && values.pwaEnabled;
    },
  },
];

useAutoLabelWidth(schemaTable);
