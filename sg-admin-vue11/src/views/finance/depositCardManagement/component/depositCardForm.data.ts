import { FormSchema } from '/@/components/Form';
import { isVirtualCurrency } from '/@/utils/common';
import { useCurrencyStore } from '/@/store/modules/currency';
import { currentProtocolNameMap } from '/@/settings/currencySetting';
import { getTreeList } from '/@/api/member';
import { useI18n } from '/@/hooks/web/useI18n';
import { InputNumber } from 'ant-design-vue';
import { h, ref } from 'vue';
import { isValid } from '/@/utils/is';
import Big from 'big.js';
import { getBankList } from '/@/api/finance';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
const colSpan = 24;
export const min_amount = ref<any>(null);

export function schemasFun() {
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: 'id',
      show: false,
    },
    {
      field: 'currency_type',
      component: 'Select',
      label: t('modalForm.finance.finance_collection_way') + ':',
      colProps: { span: colSpan },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.chooseText') +
                  t('modalForm.finance.finance_collection_way').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      defaultValue: 1,
      componentProps: () => {
        return {
          options: [
            { label: t('business.Fiat_currency'), value: 1 },
            { label: t('business.cryptocurrency_currency'), value: 2 },
          ],
          getPopupContainer: () => document.body,
        };
      },
      dynamicDisabled: ({ values }) => {
        return !!values.id;
      },
    },
    {
      field: 'currency_id',
      component: 'IconSelect',
      label: t('modalForm.finance.finance_collection_currency') + ':', //收款币种
      colProps: { span: colSpan },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.chooseText') +
                  t('modalForm.finance.finance_collection_currency').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      dynamicDisabled: ({ values }) => {
        return !!values.id;
      },
      componentProps: ({ formActionType, formModel }) => {
        const currencyList = getCurrencyList.filter((el) => el.attr == formModel['currency_type']);
        return {
          options: currencyList,
          labelField: 'name',
          valueField: 'id',
          allowClear: false,
          getPopupContainer: () => document.body,
          onChange: async (value) => {
            if (isVirtualCurrency(value)) {
              const level = currentProtocolNameMap[value];
              const response = await getTreeList({ level });
              const list = response.map((item: any) => {
                return {
                  label: item?.name,
                  value: `${item?.id}/${item?.name}`,
                  key: item?.id,
                };
              });
              const { updateSchema } = formActionType;
              updateSchema({
                field: 'contract_type',
                componentProps: {
                  getPopupContainer: () => document.body,
                  options: list,
                },
              });
            } else {
              if (!value) return false;
              const response = await getBankList({ currency_id: value });
              const list = response.bank_list.map((item: any) => {
                return {
                  label: item?.name,
                  value: `${item?.id}/${item?.name}`,
                  key: item?.id,
                  img: `${response?.icon_uri_prefix}/${item?.id}.webp`,
                };
              });
              const { updateSchema, setFieldsValue } = formActionType;
              updateSchema({
                field: 'bank_data',
                label:
                  value == 702
                    ? t('table.member.bank_id')
                    : t('modalForm.finance.finance_bank_name') + ':', //银行名称
                componentProps: {
                  getPopupContainer: () => document.body,
                  options: list,
                  placeholder:
                    value == 702
                      ? t('modalForm.finance.finance_pix_name_tip')
                      : t('modalForm.finance.finance_bank_name_tip'), //请输入银行名称
                },
              });
              if (!formModel['id']) setFieldsValue({ bank_data: list[0].value });
            }
          },
        };
      },
    },
    {
      field: 'bank_data',
      component: 'IconSelect',
      label: t('modalForm.finance.finance_bank_name') + ':', //银行名称
      colProps: { span: colSpan },
      rules: [
        {
          required: true,
          message: t('common.chooseText') + t('modalForm.finance.finance_bank_name').toLowerCase(),
        },
      ],
      ifShow: ({ values }) => !isVirtualCurrency(values.currency_id),
      componentProps: {
        autoComplete: 'off',
        showImg: true,
        placeholder: t('modalForm.finance.finance_bank_name_tip'), //请输入银行名称
      },
    },
    {
      // USDT
      field: 'contract_type',
      component: 'Select',
      label: t('business.common_agreement_type') + ':',
      colProps: { span: colSpan },
      rules: [
        {
          required: true,
          message: t('common.chooseText') + t('business.common_agreement_type').toLowerCase(),
        },
      ],
      ifShow: ({ values }) => isVirtualCurrency(values.currency_id),
    },
    {
      field: 'remarks',
      component: 'Input',
      label: t('business.common_note_name') + ':',
      colProps: { span: colSpan },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.inputText') + t('business.common_note_name').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      ifShow: ({ values }) => isVirtualCurrency(values.currency_id),
      componentProps: {
        autoComplete: 'off',
        placeholder: t('business.common_note_name_p'),
      },
    },
    {
      // USDT
      field: 'wallet_address',
      component: 'Input',
      label: t('table.finance.finance_Payment_address') + ':',
      colProps: { span: colSpan },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.inputText') + t('table.finance.finance_Payment_address').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      ifShow: ({ values }) => isVirtualCurrency(values.currency_id),
      componentProps: {
        autoComplete: 'off',
        placeholder: t('table.finance.finance_Payment_address_p_placeholder'),
      },
    },
    {
      field: 'bank_account',
      component: 'Input',
      colProps: { span: colSpan },
      label: t('modalForm.finance.bank_account') + ':', //持卡姓名
      rules: [{ required: true }],
      ifShow: ({ values }) => {
        return values.currency_id === '702';
      },
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.bank_account_p'), //请输入持卡姓名
      },
    },
    {
      field: 'open_name2',
      component: 'Input',
      colProps: { span: colSpan },
      label: t('business.common_actual_name') + ':', //持卡姓名
      rules: [{ required: true }],
      ifShow: ({ values }) => values.currency_id == '702',
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.open_name'), //请输入持卡姓名
      },
    },
    {
      field: 'open_name',
      component: 'Input',
      colProps: { span: colSpan },
      label: t('modalForm.finance.finance_card_name') + ':', //持卡姓名
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.inputText') + t('modalForm.finance.finance_card_name').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      ifShow: ({ values }) => !isVirtualCurrency(values.currency_id) && values.currency_id != '702',
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.finance_card_name_tip'), //请输入持卡姓名
      },
    },
    {
      field: 'bank_account2',
      component: 'Input',
      colProps: { span: colSpan },
      label: t('modalForm.finance.finance_band_number') + ':', //银行卡号
      ifShow: ({ values }) => !isVirtualCurrency(values.currency_id) && values.currency_id != '702',
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.finance.finance_band_number_tip'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.finance_band_number_tip'), //请输入银行卡号
      },
    },
    {
      field: 'bank_area_cpf',
      component: 'Input',
      colProps: { span: colSpan },
      label: t('modalForm.finance.finance_opening_outlets') + ':', //开户网点
      ifShow: ({ values }) => values.currency_id == '701',
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.finance_opening_outlets_tip'), //请输入开户网点
      },
    },
    {
      field: 'min_amount',
      component: 'Input',
      show: false,
    },
    {
      label: t('business.Amount range') + ':',
      field: 'max_amount',
      component: 'Input',
      colProps: { span: colSpan },
      render({ model, field }) {
        return h('div', { class: 'flex items-center gap-4' }, [
          h(InputNumber, {
            style: 'padding: 4px 0px',
            value: model['min_amount'],
            'onUpdate:value': (value0) => {
              model['min_amount'] = value0;
              min_amount.value = value0;
            },
            min: 0,
            max: 9999999999,
            stringMode: true,
            placeholder: t('common.inputText'),
          }),
          h('div', { class: 'mx-2' }, '-'),
          h(InputNumber, {
            style: 'padding: 4px 0px',
            value: model[field],
            'onUpdate:value': (value) => (model[field] = value),
            min: 0,
            max: 9999999999,
            stringMode: true,
            placeholder: t('common.inputText'),
          }),
        ]);
      },
      rules: [
        {
          required: true,
          validator() {
            return Promise.resolve();
          },
        },
        {
          validator(_rule, max_amount) {
            if (!isValid(min_amount.value) || !isValid(max_amount))
              return Promise.reject(t('business.Amount range_p1'));
            if (new Big(min_amount.value).cmp(max_amount) !== -1)
              return Promise.reject(t('business.Amount range_p2'));
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'quick_amount',
      component: 'Input',
      colProps: { span: colSpan },
      label: t('modalForm.finance.finance_common_amount') + ':', //常用金额
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.finance_common_amount_tip'), //请输入常用金额，多个逗号隔开
      },
    },
    {
      field: 'level',
      component: 'ApiSelect',
      label: t('business.common_member_level') + ':', //会员层级
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.inputText') + t('business.common_member_level').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      slot: 'selectMember',
      colProps: { span: colSpan },
      componentProps: {
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'client_type',
      component: 'CheckboxGroup',
      colProps: { span: colSpan },
      label: t('table.finance.finance_opening_terminal') + ':', //开放终端
      rules: [{ required: true }],
      slot: 'terminalSlot',
    },
    {
      field: 'state',
      label: t('modalForm.finance.finance_now_status') + ':', //当前状态
      component: 'RadioGroup',
      colProps: { span: colSpan },
      defaultValue: 1,
      componentProps: {
        options: [
          { label: t('business.common_normal'), value: 1 }, //正常
          { label: t('business.common_deactivate'), value: 2 }, //停用
        ],
      },
    },
  ];
  useAutoLabelWidth(schemas);
  return schemas;
}
