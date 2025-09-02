import { BasicColumn, FormSchema } from '/@/components/Table';
import { h, unref } from 'vue';
import { Tag, FormItemRest, InputNumber, Divider } from 'ant-design-vue';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useFormSetting } from '/@/hooks/setting/useFormSetting';
import { amountType } from '/@/views/finance/common/const';
import { getCompanyCurrencyList, getMethodCompanyList, getAllCurrencyList } from '/@/api/finance';
// import { useTreeListStore } from '/@/store/modules/treeList';
import { useValidateAmount, useValidateAmountNoLimit } from '/@/utils/validator';
// import { isVirtualCurrency } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { COLORS } from '/@/views/common/const';
import { SetTooltip, setClounmsWidth } from '/@/views/common/component';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
const validateAmount = useValidateAmount();
const validateAmountNoLimit = useValidateAmountNoLimit();
const { getCurrencyList } = useCurrencyStore();

const FORM_SIZE = useFormSetting().getFormSize;

const { t } = useI18n();

export function paymentForm(currencyId): FormSchema[] {
  return [
    {
      field: 'button',
      component: 'Input',
      slot: 'created',
      // colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    },
    {
      field: 'state',
      component: 'Select',
      labelPrefix: t('business.common_status'), //状态
      defaultValue: 0,
      colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
      componentProps: {
        allowClear: false,
        options: [
          { label: ' ' + t('business.common_all'), value: 0 }, //全部
          { label: ' ' + t('business.common_normal'), value: 1 }, //正常
          { label: ' ' + t('business.common_deactivate'), value: 2 }, //停用
        ],
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'company_id',
      component: 'Select',
      labelPrefix: t('modalForm.finance.finance_platform_pay'), //支付平台
      colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
      defaultValue: '',
      componentProps: ({ formActionType }) => {
        return {
          dropdownMatchSelectWidth: false,
          options: [],
          getPopupContainer: () => document.body,
          onChange: (value) => {},
        };
      },
    },
    {
      field: 'method_id',
      component: 'Select',
      labelPrefix: t('modalForm.finance.finance_pay_way'), //支付方式
      colProps: { xxl: 7, xl: 7, lg: 7, md: 7, sm: 7 },
      defaultValue: '',
      componentProps: {
        dropdownMatchSelectWidth: false,
        options: [],
        getPopupContainer: () => document.body,
      },
    },
  ];
}

export const columnsPaymentList: BasicColumn[] = [
  {
    title: t('table.finance.finance_Merchant_number'),
    dataIndex: 'account',
    customRender: ({ record }) => SetTooltip(record.account, 15),
  },
  {
    title: t('table.finance.finance_platform'),
    dataIndex: 'name',
  },
  {
    title: t('table.finance.finance_Way'),
    dataIndex: 'method_ids',
    customRender: ({ record }) => {
      const methods = record.methods;
      return h('div', null, [
        methods
          ? methods.map((item, index) => {
              return [
                h('div', null, item.name + (item.contract_name ? `-${item.contract_name}` : '')),
                index < methods.length - 1 ? h(Divider, { style: { margin: '10px 0' } }) : '',
              ];
            })
          : '-',
      ]);
    },
  },
  {
    title: t('table.finance.finance_platform_code'),
    dataIndex: 'channel_code',
    // customRender: ({ record }) => {
    //   return record.methods.channel_code ? record.methods.channel_code : '-';
    // },
    customRender: ({ record }) => {
      const methods = record.methods;
      return h('div', null, [
        methods
          ? methods.map((item, index) => {
              return [
                h('div', null, item.channel_code ? item.channel_code : '-'),
                index < methods.length - 1 ? h(Divider, { style: { margin: '10px 0' } }) : '',
              ];
            })
          : '-',
      ]);
    },
  },
  {
    title: t('table.finance.finance_amount'),
    dataIndex: 'payMoney',
    customRender: ({ record }) => {
      const methods = record.methods;
      return h('div', null, [
        methods
          ? methods.map((item, index) => {
              let text: any = [];
              if (item.amount_type === 1) {
                text = [
                  h(
                    'label',
                    { style: { flex: 1, width: setClounmsWidth(80, 120) + 'px' } },
                    `${t('table.finance.finance_amount_fixed')}：`,
                  ), //固定金额
                  h(
                    'span',
                    { style: { width: '120px', 'text-align': 'left' } },
                    `${item.amount_fixed}`,
                  ),
                ];
              }
              if (item.amount_type === 2) {
                text = [
                  h(
                    'label',
                    { style: { flex: 1, width: setClounmsWidth(80, 120) + 'px' } },
                    `${t('table.finance.finance_amount_any')}：`,
                  ), //任意金额
                  h(
                    'span',
                    { style: { width: '120px', 'text-align': 'left' } },
                    `${item.amount_min}-${item.amount_max}`,
                  ),
                ];
              }
              return [
                h('div', { style: { display: 'flex', 'justify-content': 'center' } }, text),
                index < methods.length - 1 ? h(Divider, { style: { margin: '10px 0' } }) : '',
              ];
            })
          : '-',
      ]);
    },
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? COLORS.ERROR : COLORS.SUCCESS;
      const text = enable ? t('business.common_deactivate') : t('business.common_normal'); //停用，正常
      return h('div', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(columnsPaymentList);
export const usdtPaymentList: BasicColumn[] = [
  {
    title: t('table.finance.finance_Merchant_number'),
    dataIndex: 'account',
    customRender: ({ record }) => SetTooltip(record.account, 15),
  },
  {
    title: t('table.finance.finance_platform'),
    dataIndex: 'name',
  },
  {
    title: t('table.finance.finance_Way'),
    dataIndex: 'method_ids',
    customRender: ({ record }) => {
      const methods = record.methods;
      return h('div', null, [
        methods
          ? methods.map((item, index) => {
              return [
                h('div', null, item.name + (item.contract_name ? `-${item.contract_name}` : '')),
                index < methods.length - 1 ? h(Divider, { style: { margin: '10px 0' } }) : '',
              ];
            })
          : '-',
      ]);
    },
  },
  {
    title: t('table.finance.finance_amount'),
    dataIndex: 'payMoney',
    customRender: ({ record }) => {
      const methods = record.methods;
      return h('div', null, [
        methods
          ? methods.map((item, index) => {
              let text: any = [];
              if (item.amount_type === 1) {
                text = [
                  h(
                    'label',
                    { style: { flex: 1 } },
                    `${t('table.finance.finance_amount_fixed')}：`,
                  ), //固定金额
                  h(
                    'span',
                    { style: { width: '180px', 'text-align': 'left' } },
                    `${item.amount_fixed}`,
                  ),
                ];
              }
              if (item.amount_type === 2) {
                text = [
                  h('label', { style: { flex: 1 } }, `${t('table.finance.finance_amount_any')}：`), //任意金额
                  h(
                    'span',
                    { style: { width: '180px', 'text-align': 'left' } },
                    `${item.amount_min}-${item.amount_max}`,
                  ),
                ];
              }
              return [
                h('div', { style: { display: 'flex', 'justify-content': 'center' } }, text),
                index < methods.length - 1 ? h(Divider, { style: { margin: '10px 0' } }) : '',
              ];
            })
          : '-',
      ]);
    },
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? COLORS.ERROR : COLORS.SUCCESS;
      const text = enable ? t('business.common_deactivate') : t('business.common_normal'); //停用，正常
      return h('div', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(usdtPaymentList);

export function getPlateForm(payMethodIds, _, companyName): FormSchema[] {
  return [
    {
      field: 'id',
      component: 'Input',
      label: ' ' + 'id',
      show: false,
    },
    {
      field: 'currency_type',
      component: 'Select',
      label: ' ' + t('modalForm.finance.finance_collection_currency_type') + ':', //收款币种类型
      colProps: { span: 22 },
      required: true,
      defaultValue: 1,
      componentProps: () => {
        return {
          allowClear: false,
          getPopupContainer: () => document.body,
          options: [
            { label: ' ' + t('business.Fiat_currency'), value: 1 },
            { label: ' ' + t('business.cryptocurrency_currency'), value: 2 },
          ],
        };
      },
      dynamicDisabled: ({ values }) => {
        return !!values.id;
      },
    },
    {
      field: 'methodsOptions',
      component: 'Select',
      label: ' ' + 'methodsOptions',
      show: false,
    },
    ...getPayPlateForm(payMethodIds, true, companyName),
    {
      field: 'state',
      component: 'RadioGroup',
      label: ' ' + t('modalForm.finance.finance_now_status') + ':', //当前状态
      defaultValue: 1,
      // colProps: { span: 22 },
      componentProps: {
        options: [
          { label: ' ' + t('business.common_normal'), value: 1 }, //正常
          { label: ' ' + t('business.common_deactivate'), value: 2 }, //停用
        ],
      },
    },
  ];
}

export function getPayPlateForm(payMethodIds, isShow = true, companyName): FormSchema[] {
  return [
    {
      field: 'id',
      component: 'Input',
      label: ' ' + 'id',
      show: false,
    },
    {
      field: 'currency_id',
      component: 'IconSelect',
      label: ' ' + t('modalForm.finance.finance_platform_currency') + ':',
      colProps: { span: 22 },
      dynamicDisabled: ({ values }) => {
        return !!values.id;
      },
      componentProps: ({ formActionType, formModel }) => {
        const currencyList = getCurrencyList.filter((el) => el.attr == formModel['currency_type']);
        return {
          allowClear: false,
          options: currencyList,
          getPopupContainer: () => document.body,
          onChange: async (value) => {
            formModel.company_id = null;
            formModel.method_ids = [];
            payMethodIds.value = [];
            if (!value) return;
            const companyList = await getCompanyCurrencyList({
              withdraw: 1,
              filter: formModel.id ? 2 : 1,
              currency_id: value,
            });
            const companyOptions =
              companyList &&
              companyList.map((item) => {
                return {
                  ...item,
                  label: ' ' + item.name,
                  value: item.id,
                };
              });

            const { updateSchema } = formActionType;

            updateSchema(
              {
                field: 'company_id',
                componentProps: {
                  allowClear: false,
                  options: companyOptions,
                  getPopupContainer: () => document.body,
                  onChange: async (value) => {
                    //判断用户选择的支付平台是不是Crypto-pay
                    const validCompanyName = companyList.find((item) => {
                      return item.id === value;
                    });
                    companyName.value = validCompanyName?.name === 'Crypto-pay' ? true : false;
                    formModel.method_ids = [];
                    payMethodIds.value = [];

                    if (!value) return;
                    const methodsList: any = await getMethodCompanyList({
                      withdraw: 1,
                      currency_id: formModel.currency_id,
                      company_id: value,
                    });
                    const methodsOptions =
                      methodsList &&
                      methodsList.map((item) => {
                        return {
                          ...item,
                          label:
                            ' ' + item.name + (item.contract_name ? `-${item.contract_name}` : ''),
                          // value: `${item.method_id},${item.type_id}`,
                          value: item.id,
                        };
                      });
                    const { updateSchema, setFieldsValue } = formActionType;
                    await setFieldsValue({ methodsOptions: methodsOptions });

                    updateSchema(
                      {
                        field: 'method_ids',
                        componentProps: {
                          mode: 'multiple',
                          showSearch: true,
                          optionFilterProp: 'label',
                          options: methodsOptions,
                          getPopupContainer: (triggerNode) => triggerNode.parentNode,
                          onChange: (value) => {
                            payMethodIds.value = value;
                          },
                        },
                      },
                      false,
                    );
                  },
                },
              },
              false,
            );
          },
        };
      },
      required: true,
      show: isShow,
    },

    {
      field: 'company_id',
      component: 'Select',
      label: ' ' + t('modalForm.finance.finance_platform_pay') + ':',
      colProps: { span: 22 },
      required: true,
      dynamicDisabled: ({ values }) => {
        return !!values.id;
      },
      componentProps: ({ formActionType, formModel }) => {
        return {
          getPopupContainer: () => document.body,
          allowClear: false,
          onChange: async (value) => {
            formModel.method_ids = [];
            payMethodIds.value = [];
            if (!value) return;
            const methodsList: any = await getMethodCompanyList({
              withdraw: 1,
              currency_id: formModel.currency_id,
              company_id: value,
            });

            const methodsOptions =
              methodsList &&
              methodsList.map((item) => {
                return {
                  ...item,
                  label: ' ' + item.name + (item.contract_name ? `-${item.contract_name}` : ''),
                  value: item.id,
                };
              });

            const { updateSchema, setFieldsValue } = formActionType;
            await setFieldsValue({ methodsOptions: methodsOptions });

            updateSchema(
              {
                field: 'method_ids',
                componentProps: {
                  mode: 'multiple',
                  showSearch: true,
                  optionFilterProp: 'label',
                  options: methodsOptions,
                  getPopupContainer: () => document.body,
                  onChange: (value) => {
                    payMethodIds.value = value;
                  },
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
      label: ' ' + t('modalForm.finance.finance_merchant_number') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
      show: isShow,
    },
    {
      field: 'app_key',
      component: 'Input',
      label: ' ' + `${t('modalForm.finance.finance_merchant_key')} 1` + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
      show: isShow,
    },
    {
      field: 'secret_key',
      component: 'Input',
      label: ' ' + `${t('modalForm.finance.finance_merchant_key')} 2` + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
      show: isShow,
    },
    {
      field: 'gateway',
      component: 'Input',
      label: ' ' + t('modalForm.finance.finance_domain_name') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
      show: isShow,
    },
    {
      field: 'method_ids',
      component: 'ApiSelect',
      label: ' ' + t('modalForm.finance.finance_pay_way') + ':',
      colProps: { span: 22 },
      required: true,
      componentProps: {
        showArrow: true,
        mode: 'multiple',
        showSearch: true,
        optionFilterProp: 'label',
        options: [],
        getPopupContainer: () => document.body,
        onChange: (value) => {
          payMethodIds.value = value;
        },
      },
    },
    {
      field: 'methods',
      component: 'Input',
      slot: 'pay_method_extra',
    },
  ];
}

export const tabSchema: FormSchema[] = [
  {
    field: 'amount_type',
    component: 'RadioGroup',
    label: ' ' + t('modalForm.finance.finance_amount_set') + ':', //金额设置
    labelWidth: setClounmsWidth(120, 180),
    defaultValue: 1,
    componentProps: {
      options: [
        { label: ' ' + amountType[1], value: 1 },
        { label: ' ' + amountType[2], value: 2 },
      ],
    },
    colProps: { span: 24 },
    required: true,
  },
  {
    field: 'amount_fixed',
    component: 'Input',
    label: ' ' + amountType[1] + ':', //固定金额
    labelWidth: setClounmsWidth(120, 180),
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('table.report.report_segmentation'),
      stringMode: true,
    },
    // rules: [
    //   {
    //     required: true,
    //   },
    //   validateAmountNoLimit,
    // ],
    ifShow: ({ values }) => values.amount_type === 1,
  },
  {
    field: `_amount_all`,
    label: ' ' + amountType[2] + ':',
    labelWidth: setClounmsWidth(120, 180),
    component: 'Select',
    defaultValue: ['', ''],
    colProps: { span: 24 },
    ifShow: ({ values }) => values.amount_type === 2,
    // rules: [
    //   { type: 'array' },
    //   {
    //     required: true,
    //     validator: async (rule, value) => {
    //       if (!value || value.length <= 0 || value.some((n) => n === '')) {
    //         return Promise.reject('请输入限额上下限');
    //       }

    //       // if (value.some((n) => n <= 0)) {
    //       //   return Promise.reject('金额不得为 0');
    //       // }

    //       return Promise.resolve();
    //     },
    //   },
    //   {
    //     validator: async (rule, value) => {
    //       if (!value || !Array.isArray(value)) return;
    //       const [moneyStart, moneyEnd] = value;
    //       if (parseInt(moneyEnd) < parseInt(moneyStart)) {
    //         return Promise.reject('限额上限需高于限额下限');
    //       } else {
    //         return Promise.resolve();
    //       }
    //     },
    //     trigger: 'change',
    //   },
    // ],
    render: ({ model, field }) => {
      return h(FormItemRest, null, () =>
        h('div', { class: 'flex justify-between items-center' }, [
          h(InputNumber, {
            stringMode: true,
            size: unref(FORM_SIZE),
            style: { width: '45%' },
            placeholder: t('modalForm.finance.finance_help_down'),
            value: model[field] ? model[field][0] : '',
            onChange: (e) => {
              model[field][0] = e;
              model.amount_min = e;
            },
          }),
          h('span', null, '—'),
          h(InputNumber, {
            stringMode: true,
            size: unref(FORM_SIZE),
            style: { width: '45%' },
            placeholder: t('modalForm.finance.finance_help_up'),
            value: model[field] ? model[field][1] : '',
            max: 9999999999,
            onChange: (e) => {
              model[field][1] = e;
              model.amount_max = e;
            },
          }),
        ]),
      );
    },
  },
  {
    field: 'often_amount',
    component: 'Input',
    label: ' ' + t('modalForm.finance.finance_common_amount') + ':', //常用金额
    labelWidth: setClounmsWidth(120, 180),
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('table.report.report_segmentation'),
      stringMode: true,
    },
    // rules: [
    //   {
    //     required: true,
    //   },
    //   validateAmount,
    // ],
  },
];
useAutoLabelWidth(tabSchema);
