<template>
  <div>
    <BasicForm
      :submitButtonOptions="{
        text:
          submitText === 2
            ? t('modalForm.member.member_confirm_add')
            : t('modalForm.member.member_confirm_reduce'),
        size: FORM_SIZE,
        loading: loadingValue,
      }"
      style="margin-left: 20px"
      @register="moreMoney"
    >
      <template #cashType="{ model, field }">
        <Select
          :placeholder="`${t('common.chooseText')}${
            model['action'] === 1
              ? t('modalForm.member.member_add_add')
              : t('modalForm.member.member_reduce')
          }${t('business.common_type')}`"
          :size="FORM_SIZE"
          v-model:value="model[field]"
          :notFoundContent="t('common.noPermission')"
          :options="optionsList(model['action'], model['wallet_type'])"
        >
          <template #option="{ label: label, name: name }">
            <div class="flex justify-between">
              <span>{{ label }}</span>
              <span style="color: #aaa">{{ name }}</span>
            </div>
          </template>
        </Select>
      </template>
    </BasicForm>
    <moreMoneyModal @register="moreRegitser" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { Select, Modal } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import moreMoneyModal from './moreModal.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { batchBalanceUpdate } from '/@/api/member/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { getAttrValues } from '/@/views/common/common';
  import { isHasAuth } from '/@/utils/authFunction';
  //import { getCurrentCode } from '/@/utils/auth/index';
  const {
    initCashTypeList,
    currencyCashTypeListAdd,
    currencyCashTypeListRemove,
    currencyCashTypeListcommissionAdd,
    currencyCashTypeListcommissionRemove,
  } = useTreeListStore();
  initCashTypeList();
  //getCurrentCode();
  const { createInfoModal, createMessage } = useMessage();
  const emit = defineEmits(['moreModalEmit']);
  const { t } = useI18n();
  const { getCurrencyObj, getCurrencyList } = useCurrencyStore();
  const colProps = 24;
  const FORM_SIZE = useFormSetting().getFormSize;
  const [moreRegitser, { openModal }] = useModal();
  const loadingValue = ref(false as any);
  const currencyList = ref<any>([]);
  const seletIndex =
    getAttrValues(getCurrencyList).length > 0 ? getAttrValues(getCurrencyList)[0]?.value : 1;
  filterCurrency(seletIndex);

  const initOptionsList = [
    { label: t('table.member.member_wallet'), value: 1, id: '10404' },
    { label: t('table.member.member_commision'), value: 2, id: '10405' },
  ];

  const calcOptionsList = computed(() => {
    return initOptionsList.filter((item) => isHasAuth(item.id));
  });

  //批量加款
  const moreAddmoney: FormSchema[] = [
    {
      field: 'wallet_type',
      label: t('modalForm.member.member_add_content') + ':',
      component: 'Select',
      colProps: { span: colProps },
      required: true,
      defaultValue: calcOptionsList.value?.[0]?.value,
      ifShow: ({ values }) => values.action === 1,
      componentProps: ({ formModel }) => {
        return {
          notFoundContent: t('common.noPermission'),
          allowClear: false,
          placeholder: t('modalForm.member.member_add_tip3'),
          options: calcOptionsList.value.length > 0 ? calcOptionsList.value : [],
          disabled: calcOptionsList.value.length < 2 && calcOptionsList.value.length != 0,
          getPopupContainer: () => document.body,
          onChange: () => {
            //submitFuntion(formModel);
            formModel.batch_lines = '';
            formModel.remark = '';
            formModel.bet_multiplier = null;
            if (formModel.action === 1) {
              if (formModel.wallet_type === 2) {
                setFieldsValue({ cash_type: currencyCashTypeListAdd[0]?.value });
              } else {
                setFieldsValue({ cash_type: currencyCashTypeListcommissionAdd[0]?.value });
              }
            } else {
              if (formModel.wallet_type === 2) {
                setFieldsValue({ cash_type: currencyCashTypeListRemove[0]?.value });
              } else {
                setFieldsValue({ cash_type: currencyCashTypeListcommissionRemove[0]?.value });
              }
            }
          },
        };
      },
    },
    {
      field: 'Select_currency',
      label: t('modalForm.member.Select_currency') + ':',
      component: 'Select',
      // rules: [{ required: true }],
      colProps: { span: colProps },
      ifShow: ({ values }) => values.action === 1,
      defaultValue: seletIndex,
      componentProps: ({ formModel }) => {
        return {
          allowClear: false,
          options: getAttrValues(getCurrencyList),
          getPopupContainer: () => document.body,
          onChange: (e) => {
            filterCurrency(e);
            setFieldsValue({
              currency_id: currencyList.value.length > 0 ? currencyList.value[0].id : null,
            });
          },
        };
      },
    },
    {
      field: 'currency_id',
      component: 'IconSelect',
      label: t('modalForm.member.member_currency_add') + ':',
      colProps: { span: colProps },
      defaultValue: currencyList.value.length > 0 ? currencyList.value[0].id : null,
      // required: true,
      ifShow: ({ values }) => values.action === 1,
      componentProps: () => {
        return {
          allowClear: false,
          placeholder: t('modalForm.member.member__currency_tip'),
          options: currencyList.value,
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'cash_type',
      label: t('modalForm.member.member_type_add') + ':',
      component: 'Select',
      rules: [{ required: true }],
      colProps: { span: colProps },
      slot: 'cashType',
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
        };
      },
      ifShow: ({ values }) => values.action === 1,
    },
    {
      field: 'bet_multiplier',
      label: t('modalForm.member.member_multiple') + ':',
      colProps: { span: colProps },
      required: true,
      component: 'InputNumber',
      componentProps: {
        placeholder: t('modalForm.member.bet_multiplier_tip'),
        stringMode: true,
      },
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.member.bet_multiplier_tip'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      ifShow: ({ values }) => values.action === 1 && values.wallet_type === 1,
    },
    {
      field: 'batch_lines',
      label: t('modalForm.member.member_add_money1') + ':',
      component: 'InputTextArea',
      colProps: { span: colProps },
      componentProps: {
        placeholder: t('modalForm.member.member_add_money1_tip'),
        rows: 4,
      },
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.member.member_add_money_remove'));
            }
            const pattern = /^[a-zA-Z0-9\r\n,]+$/gm;
            const hasSpace = /[^\S\r\n]/;
            const chinese = /[^\w\s\r\n,]/;

            const lines = value.split(/\r?\n/);
            const lineCount = lines.length;
            if (lineCount > 2000) {
              return Promise.reject(t('modalForm.member.member_add_money1_tip_1'));
            }
            if (!pattern.test(value) || hasSpace.test(value) || chinese.test(value)) {
              return Promise.reject(t('modalForm.member.member_add_money1_tip_2'));
            }
            if (hasDuplicates(moreAmount(value))) {
              return Promise.reject(t('modalForm.member.member_add_money1_tip_3'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      ifShow: ({ values }) => values.action === 1,
    },
    {
      field: 'remark',
      label: t('business.common_remarks_infor') + ':',
      component: 'InputTextArea',
      colProps: { span: colProps },
      componentProps: {
        placeholder: t('modalForm.member.member_remark_tip1'),
        rows: 4,
      },
      required: true,
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.member.member_remark_tip1'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      ifShow: ({ values }) => values.action === 1,
    },
  ];
  //批量减款
  const moreReduce: FormSchema[] = [
    {
      field: 'wallet_type',
      label: t('modalForm.member.member_reduce_content') + ':',
      component: 'Select',
      required: true,
      colProps: { span: colProps },
      defaultValue: calcOptionsList.value?.[0]?.value,
      ifShow: ({ values }) => values.action === 2,
      componentProps: ({ formModel }) => {
        return {
          notFoundContent: t('common.noPermission'),
          placeholder: t('modalForm.member.member_add_tip3'),
          options: calcOptionsList.value.length > 0 ? calcOptionsList.value : [],
          disabled: calcOptionsList.value.length < 2 && calcOptionsList.value.length != 0,
          getPopupContainer: () => document.body,
          onChange: () => {
            formModel.batch_lines = '';
            formModel.remark = '';
            //formModel.cash_type = null;
            formModel.bet_multiplier = null;
            //submitFuntion(formModel);
            if (formModel.action === 1) {
              if (formModel.wallet_type === 2) {
                setFieldsValue({ cash_type: currencyCashTypeListAdd[0]?.value });
              } else {
                setFieldsValue({ cash_type: currencyCashTypeListcommissionAdd[0]?.value });
              }
            } else {
              if (formModel.wallet_type === 2) {
                setFieldsValue({ cash_type: currencyCashTypeListRemove[0]?.value });
              } else {
                setFieldsValue({ cash_type: currencyCashTypeListcommissionRemove[0]?.value });
              }
            }
          },
        };
      },
    },
    {
      field: 'Select_currency',
      label: t('modalForm.member.Select_currency') + ':',
      component: 'Select',
      // rules: [{ required: true }],
      colProps: { span: colProps },
      ifShow: ({ values }) => values.action === 2,
      defaultValue: seletIndex,
      componentProps: ({ formModel }) => {
        return {
          allowClear: false,
          options: getAttrValues(getCurrencyList),
          getPopupContainer: () => document.body,
          onChange: (e) => {
            filterCurrency(e);
            setFieldsValue({
              currency_id: currencyList.value.length > 0 ? currencyList.value[0].id : null,
            });
          },
        };
      },
    },
    {
      field: 'currency_id',
      component: 'IconSelect',
      label: t('modalForm.member.member_currency') + ':',
      colProps: { span: colProps },
      defaultValue: currencyList.value.length > 0 ? currencyList.value[0].id : null,
      ifShow: ({ values }) => values.action === 2,
      componentProps: () => {
        return {
          placeholder: t('modalForm.member.member__currency_tip'),
          options: currencyList.value,
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'cash_type',
      label: t('modalForm.member.member_reduce_type') + ':',
      component: 'Select',
      colProps: { span: colProps },
      rules: [{ required: true }],
      slot: 'cashType',
      ifShow: ({ values }) => values.action === 2,
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'batch_lines',
      label: t('modalForm.member.member_reduce_money') + ':',
      component: 'InputTextArea',
      colProps: { span: 24 },
      componentProps: {
        placeholder: t('modalForm.member.member_add_money1_tip'),
        rows: 4,
      },
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.member.member_add_money_remove'));
            }
            const pattern = /^[a-zA-Z0-9\r\n,]+$/gm;
            const hasSpace = /[^\S\r\n]/;
            const chinese = /[^\w\s\r\n,]/;
            const lines = value.split(/\r?\n/);
            const lineCount = lines.length;
            if (lineCount > 2000) {
              return Promise.reject(t('modalForm.member.member_add_money1_tip_1'));
            }
            if (!pattern.test(value) || hasSpace.test(value) || chinese.test(value)) {
              return Promise.reject(t('modalForm.member.member_add_money1_tip_2'));
            }
            if (hasDuplicates(moreAmount(value))) {
              return Promise.reject(t('modalForm.member.member_add_money1_tip_3'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
      ifShow: ({ values }) => values.action === 2,
    },
    {
      field: 'remark',
      label: t('business.common_remarks_infor') + ':',
      component: 'InputTextArea',
      colProps: { span: 24 },
      componentProps: {
        placeholder: t('modalForm.member.member_remark_tip1'),
        rows: 4,
      },
      required: true,
      rules: [
        {
          required: true,
          message: t('modalForm.member.member_remark_tip1'),
        },
      ],
      ifShow: ({ values }) => values.action === 2,
    },
  ];
  let submitText = ref<number>(2);
  function submitFuntion(value) {
    value.batch_lines = '';
    value.remark = '';
    //value.cash_type = null;
    value.bet_multiplier = null;
    submitText.value = value.action;
  }
  // 批量form表单
  const rightSchemaSum: FormSchema[] = [
    {
      field: 'action',
      label: t('modalForm.member.member_add_money') + ':',
      component: 'RadioGroup',
      colProps: { span: 24 },
      defaultValue: 1,
      componentProps: ({ formModel }) => {
        return {
          options: [
            { label: t('modalForm.member.member_add_add'), value: 1 },
            { label: t('modalForm.member.member_reduce'), value: 2 },
          ],
          onChange: () => {
            if (calcOptionsList.value.length > 0) {
              submitFuntion(formModel);

              if (formModel.action === 2) {
                if (formModel.wallet_type === 1) {
                  setFieldsValue({ cash_type: currencyCashTypeListAdd[0]?.value });
                } else {
                  setFieldsValue({ cash_type: currencyCashTypeListcommissionAdd[0]?.value });
                }
              } else {
                if (formModel.wallet_type === 1) {
                  setFieldsValue({ cash_type: currencyCashTypeListRemove[0]?.value });
                } else {
                  setFieldsValue({ cash_type: currencyCashTypeListcommissionRemove[0]?.value });
                }
              }
            }
          },
        };
      },
    },
  ].concat(moreAddmoney, moreReduce);
  useAutoLabelWidth(rightSchemaSum);
  const [moreMoney, { validate, resetFields, setFieldsValue }] = useForm({
    schemas: rightSchemaSum,
    showResetButton: false,
    actionColOptions: {
      span: 24,
    },
    size: FORM_SIZE,
    submitFunc: submitaddMoney,
    baseColProps: { class: 'rowStyle' },
  });
  //处理多用户和多金额
  function moreAmount(value) {
    var lines = value.split('\n'); // 分割成每行
    var queryString: any = ''; // 初始化一个空字符串
    // 遍历每行，将用户名和数字拼接成 URL 查询字符串
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var parts = line.split(','); // 分割用户名和数字
      var username = parts[0];
      var number = parts[1];
      // 拼接到 URL 查询字符串
      queryString += username + '=' + number;
      //去重数组
      //const uniqueArray = lines.filter((value, index, self) => self.indexOf(value) === index);
      // 如果不是最后一行，则加上"&"分隔符
      if (i < lines.length - 1) {
        queryString += '&';
      }
    }
    return queryString;
  }
  function optionsList(action, cashType) {
    if (calcOptionsList.value.length > 0) {
      if (action === 1) {
        if (cashType === 1) {
          return currencyCashTypeListAdd;
        } else {
          return currencyCashTypeListcommissionAdd;
        }
      } else {
        if (cashType === 1) {
          return currencyCashTypeListRemove;
        } else {
          return currencyCashTypeListcommissionRemove;
        }
      }
    } else {
      return [];
    }
  }

  function filterCurrency(type) {
    currencyList.value = getCurrencyList.filter((el) => el.attr == type);
  }
  async function submitaddMoney() {
    const values = await validate();
    const content = moreAmount(values['batch_lines']);
    values['batch_lines'] = content;
    if (values) {
      loadingValue.value = true;
      const { status, data } = await batchBalanceUpdate(values);
      if (status) {
        filterCurrency(seletIndex);
        resetFields();
        const titleStr =
          values['action'] === 1
            ? t('modalForm.member.member_add_add')
            : t('modalForm.member.member_reduce');
        if (data.invalid_format || data.non_exist || data.insufficient_balance || data.disabled) {
          openModal(true, { data: data, title: titleStr });
        } else {
          Modal.destroyAll();
          createMessage.success(`${titleStr}${t('business.common_success')}`);
        }
        submitText.value = 2;
        await resetFields();
        loadingValue.value = false;
        //刷新页面控件
        // eventBus.emit('cancelModal');
      } else {
        createMessage.error(data);
        loadingValue.value = false;
        if (data == '币种类型错误') {
          Modal.destroyAll();
        }
      }
    } else {
      console.error('验证失败');
    }
  }
  //检测重复账号的校验
  function hasDuplicates(queryString) {
    // Split the query string by '&' and ',' to get individual key-value pairs
    const pairs = queryString.split(/[,&]/);

    // Use Set to store unique keys
    const seenKeys = new Set();

    for (const pair of pairs) {
      // Split each key-value pair by '='
      const [key, value] = pair.split('=');

      // Check if the key is already in the Set
      if (seenKeys.has(key)) {
        return true; // Duplicate found
      }

      // Add the key to the Set
      seenKeys.add(key);
    }

    return false; // No duplicates found
  }
  onMounted(() => {
    if (calcOptionsList.value.length < 2 && calcOptionsList.value.length > 0) {
      if (!isHasAuth('10404')) {
        setFieldsValue({ cash_type: currencyCashTypeListcommissionAdd[0]?.value });
      } else if (!isHasAuth('10405')) {
        setFieldsValue({ cash_type: currencyCashTypeListAdd[0]?.value });
      }
    } else if (calcOptionsList.value.length != 0) {
      setFieldsValue({ cash_type: currencyCashTypeListAdd[0]?.value });
    }
  });
</script>
<style lang="less">
  ::v-deep(.customStyle > p) {
    padding: 0;
  }

  //ant-form-item-control-input-content .ant-btn:last-child {
  //  margin-right: 65px;
  //}
</style>
