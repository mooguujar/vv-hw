import { FormSchema } from '/@/components/Form';
import { getCompanyCurrencyList, getMethodCompanyList } from '/@/api/finance';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import eventBus from '/@/utils/eventBus';

const { t } = useI18n();
const colSpan = 24;
const { getCurrencyList } = useCurrencyStore();
let isToAddDepositCardPage = false;

eventBus.on('isToAddDepositCardPage', (e: any) => {
  isToAddDepositCardPage = e;
});

export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: t('common.translate.word77'),
    colProps: { span: colSpan },
    show: false,
  },
  {
    field: 'currency_id',
    component: 'IconSelect',
    label: t('modalForm.finance.finance_help_currency') + '：',
    colProps: { span: colSpan },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        getPopupContainer: () => document.body,
        options: getCurrencyList,
        onChange: async (value) => {
          formModel.company_id = '';
          formModel.method_id = '';
          if (!value) return;
          const currency_id_ = value;
          // await eventBus.emit('diamondsuccess', {
          //   currency_id_: value,
          //   methodsOptions: '',
          // });
          const companyList = await getCompanyCurrencyList({
            withdraw: 2,
            filter: formModel.id ? 2 : 1,
            currency_id: value,
          });
          const companyOptions =
            companyList &&
            companyList.map((item) => {
              return {
                ...item,
                label: item.name,
                value: item.id,
              };
            });

          const { updateSchema, setFieldsValue } = formActionType;

          await updateSchema(
            {
              field: 'company_id',
              componentProps: {
                allowClear: false,
                options: companyOptions,
                getPopupContainer: () => document.body,
                onChange: async (value) => {
                  if (!value) return;
                  const { updateSchema, setFieldsValue } = formActionType;

                  formModel.method_id = '';
                  const methodsList: any = await getMethodCompanyList({
                    withdraw: 2,
                    currency_id: formModel.currency_id,
                    company_id: value,
                  });
                  const methodsOptions =
                    methodsList &&
                    methodsList.map((item) => {
                      return {
                        ...item,
                        label: item.name + (item.contract_name ? `-${item.contract_name}` : ''),
                        // value: `${item.method_id},${item.type_id}`,
                        value: item.id,
                      };
                    });

                  await setFieldsValue({ methodsOptions: methodsOptions });

                  // GetWithdrawMerchantMist({
                  //   company_id: value,
                  //   currency_id: currency_id_,
                  //   page: 1,
                  //   state: 1,
                  //   page_size: 10,
                  // }).then((data) => {
                  //   // if (!!!data.d) return;
                  //   let type_id = !!data.d ? data.d[0]?.type_id : '';
                  //   eventBus.emit('diamondsuccess', {
                  //     currency_id_,
                  //     methodsOptions: type_id,
                  //   });
                  // });

                  await updateSchema(
                    {
                      field: 'method_id',
                      componentProps: {
                        showSearch: true,
                        optionFilterProp: 'label',
                        options: methodsOptions,
                        getPopupContainer: () => document.body,
                        onChange: (value) => {},
                      },
                    },
                    false,
                  );
                  if (isToAddDepositCardPage) {
                    await setFieldsValue({ method_id: methodsOptions[0].value });
                  }
                },
              },
            },
            false,
          );

          if (isToAddDepositCardPage) {
            await setFieldsValue({ company_id: companyOptions[0].value });
          }
        },
      };
    },
    required: true,
  },
  {
    field: 'company_id',
    component: 'Select',
    label: t('modalForm.finance.finance_help_payplatform') + '：',
    colProps: { span: colSpan },
    required: true,
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        getPopupContainer: () => document.body,
        onChange: async (value) => {
          formModel.method_id = '';
          if (!value) return;
          const methodsList: any = await getMethodCompanyList({
            withdraw: 2,
            currency_id: formModel.currency_id,
            company_id: value,
          });

          const methodsOptions =
            methodsList &&
            methodsList.map((item) => {
              return {
                ...item,
                label: item.name + (item.contract_name ? `-${item.contract_name}` : ''),
                value: item.id,
              };
            });

          const { updateSchema, setFieldsValue } = formActionType;
          await setFieldsValue({ methodsOptions: methodsOptions });

          updateSchema(
            {
              field: 'method_id',
              componentProps: {
                showSearch: true,
                optionFilterProp: 'label',
                options: methodsOptions,
                getPopupContainer: () => document.body,
                onChange: (value) => {},
              },
            },
            false,
          );
        },
      };
    },
  },
  {
    field: 'account',
    component: 'Input',
    colProps: { span: colSpan },
    label: t('modalForm.finance.finance_merchant_number') + '：',
    rules: [{ required: true, message: t('modalForm.finance.finance_input_merchant_number_tip') }],
    componentProps: {
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_merchant_number_tip'), //请输入商户编号
    },
  },
  {
    field: 'app_key',
    component: 'Input',
    colProps: { span: colSpan },
    label: t('modalForm.finance.finance_merchant_key') + ' 1：', //商户密钥1
    rules: [
      { required: true, message: t('modalForm.finance.finance_input_merchant_key_tip') + ' 1' },
    ],
    componentProps: {
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_merchant_key_tip'), //请输入商户密钥
    },
  },
  {
    field: 'secret_key',
    component: 'Input',
    colProps: { span: colSpan },
    label: t('modalForm.finance.finance_merchant_key') + ' 2：', //商户密钥2
    rules: [
      { required: true, message: t('modalForm.finance.finance_input_merchant_key_tip') + ' 2' },
    ],
    componentProps: {
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_merchant_key_tip'), //请输入商户密钥
    },
  },
  {
    field: 'gateway',
    component: 'Input',
    colProps: { span: colSpan },
    label: t('modalForm.finance.finance_help_domain') + '：', //代付域名
    rules: [{ required: true, message: t('modalForm.finance.finance_input_help_domain_tip') }],
    componentProps: {
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_help_domain_tip'), //请输入代付域名
    },
  },
  {
    field: 'method_id',
    component: 'ApiSelect',
    label: t('modalForm.finance.finance_help_way') + '：', //代付方式
    colProps: { span: colSpan },
    required: true,
    rules: [{ required: true, message: t('modalForm.finance.finance_input_type_tips') }],
    componentProps: {
      placeholder: t('modalForm.finance.finance_input_type_tips'), //请输入
      showSearch: true,
      optionFilterProp: 'label',
      options: [],
      getPopupContainer: () => document.body,
      onChange: (value) => {
        // payMethodIds.value = value;
      },
    },
  },
  {
    field: 'credit_amount',
    component: 'Input',
    colProps: { span: colSpan },
    label: t('modalForm.finance.finance_help_amount') + '：', //授权额度
    rules: [{ required: true, message: t('modalForm.finance.finance_input_help_amount_tip') }],
    componentProps: {
      maxlength: 12,
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_help_amount_tip'), //请输入授权额度
    },
  },
  {
    field: 'min_amount',
    component: 'Input',
    colProps: { span: colSpan },
    label: t('modalForm.finance.finance_help_down') + '：', //单笔下限
    rules: [{ required: true, message: t('modalForm.finance.finance_input_help_down_tip') }],
    componentProps: {
      maxlength: 12,
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_help_down_tip'), //请输入单笔下限
    },
  },
  {
    field: 'max_amount',
    component: 'Input',
    colProps: { span: colSpan },
    rules: [{ required: true, message: t('modalForm.finance.finance_input_help_up_tip') }],
    label: t('modalForm.finance.finance_help_up') + '：', //单笔上限
    componentProps: {
      maxlength: 12,
      autoComplete: 'off',
      placeholder: t('modalForm.finance.finance_input_help_up_tip'), //请输入单笔上限
    },
  },
  {
    field: 'level_ids',
    component: 'Input',
    slot: 'level_ids',
    label: t('modalForm.finance.finance_available_level') + '：', //开放层级
    colProps: { span: colSpan },
    // required: true,
    // rules: [
    //   {
    //     required: true,
    //     message: '请选择开放层级',
    //     trigger: 'change',
    //   },
    // ],
    rules: [
      {
        type: 'array',
      },
      {
        required: true,
        validator: async (rule, value) => {
          setTimeout(() => {
            // if (!Array.isArray(value)) return Promise.resolve();
            if (value && value.length > 0) {
              eventBus.emit('addReceiveCardForm_clearValidate_');
              // clearValidate();
              return Promise.resolve();
            } else {
              return Promise.reject(t('modalForm.finance.finance_choose_application_level1'));
            }
          }, 111);
        },
        trigger: 'change',
      },
    ],
    componentProps: {
      maxlength: 12,
      autoComplete: 'off',
      placeholder: t('modalForm.discountActivity.member_tip0'), //请输入
    },
  },
  {
    field: 'state',
    label: t('modalForm.finance.finance_now_status') + '：', //当前状态
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
