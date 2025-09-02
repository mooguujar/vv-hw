<template>
  <PageWrapper contentBackground>
    <BasicForm
      :submitButtonOptions="{
        text:
          submitText === 2
            ? t('modalForm.member.member_confirm_add1')
            : t('modalForm.member.member_confirm_reduce1'),
        loading: loadingValue,
        size: FORM_SIZE,
        style: {
          marginRight: '0',
        },
        rowStyle: { margin: 0 },
      }"
      :schemas="sumLeftSchemas"
      style="margin-left: 20px"
      @register="regAddMoney"
    >
      <template #localSearch="{ model, field }">
        <Select
          show-search
          v-model:value="model[field]"
          :size="FORM_SIZE"
          :placeholder="t('table.member.member_username_tip2')"
          :fieldNames="{ label: 'username', value: 'username' }"
          :options="datalist"
          @search="handleSearch"
          :searchValue="searchValue"
          @focus="handleFocus"
          @change="
            (value) => {
              handelChange(value, model), handleChange1(value);
            }
          "
          :not-found-content="fetching ? '' : ''"
          allowClear
        >
          <!-- @change="(value) => handelChange(value, model)" -->
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
          <template #suffixIcon>
            <SearchOutlined />
          </template>
        </Select>
      </template>
      <!-- <template #localSearch="{ model, field }">
        <Input
          v-model:value="model[field]"
          :size="FORM_SIZE"
          :placeholder="t('table.member.member_username_tip2')"
          @blur="(value) => handelChange(model[field], model)"
        >
          <template #suffix>
            <SearchOutlined style="color: #ccc" />
          </template>
        </Input>
      </template> -->
      <template #cashType="{ model, field }">
        <Select
          :notFoundContent="t('common.noPermission')"
          :placeholder="`${t('common.chooseText')}${
            model['action'] === 1
              ? t('modalForm.member.member_add_add')
              : t('modalForm.member.member_reduce')
          } ${t('business.common_type').toLowerCase()}`"
          :size="FORM_SIZE"
          v-model:value="model[field]"
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
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, onBeforeMount } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import {
    getByMemberId,
    balanceUpdate,
    getMemberDetails,
    getbalanceMember,
    getMemberNameList,
  } from '/@/api/member/index';
  import { Select, Spin, SelectOption, Modal, Input } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { addContentOptions } from '../common/const';
  import { useDebounceFn } from '@vueuse/core';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import eventBus from '/@/utils/eventBus';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { getAttrValues } from '/@/views/common/common';
  import { isHasAuth } from '/@/utils/authFunction';

  const { t } = useI18n();
  const {
    initCashTypeList,
    currencyCashTypeListAdd,
    currencyCashTypeListRemove,
    currencyCashTypeListcommissionAdd,
    currencyCashTypeListcommissionRemove,
  } = useTreeListStore();
  onBeforeMount(async () => {
    await initCashTypeList();
  });

  const searchValue = ref('');
  const searchValue1 = ref('');

  const handleChange1 = (value: any) => {
    setTimeout(() => {
      searchValue.value = value;
      searchValue1.value = value;
    }, 555);
  };

  const handleFocus = (e) => {
    searchValue.value = searchValue1.value;
  };

  const balanceDetail = ref({} as any);
  const commissionBalanceDetail = ref({} as any);
  const { getCurrencyList, getCurrency, getCurrencyObj } = useCurrencyStore();
  const colProps = 24;
  const loadingValue = ref(false as any);
  const currencyList = ref<any>([]);
  const initOptionsList = [
    { label: t('table.member.member_wallet'), value: 1, id: '10404' },
    { label: t('table.member.member_commision'), value: 2, id: '10405' },
  ];

  const calcOptionsList = computed(() => {
    return initOptionsList.filter((item) => isHasAuth(item.id));
  });
  const seletIndex =
    getAttrValues(getCurrencyList).length > 0 ? getAttrValues(getCurrencyList)[0]?.value : 1;

  filterCurrency(seletIndex);

  // 加款
  const addmoneylist: FormSchema[] = [
    {
      field: 'wallet_type',
      label: t('modalForm.member.member_add_content') + ':',
      component: 'Select',
      colProps: { span: colProps },
      required: true,
      ifShow: ({ values }) => values.action === 1,
      defaultValue: calcOptionsList.value?.[0]?.value,

      componentProps: ({ formModel }) => {
        return {
          notFoundContent: t('common.noPermission'),
          allowClear: false,
          placeholder: t('modalForm.member.member_add_tip3'),
          options: calcOptionsList.value.length > 0 ? calcOptionsList.value : [],
          disabled: calcOptionsList.value.length < 2 && calcOptionsList.value.length != 0,
          getPopupContainer: () => document.body,
          onChange: (e) => {
            //submit(formModel);
            formModel.amount = '';
            //formModel.cash_type = null;
            formModel.bet_multiplier = null;
            formModel.remark = '';
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
      ifShow: ({ values }) => values.action === 1,
      defaultValue: currencyList.value.length > 0 ? currencyList.value[0].id : null,
      // required: true,
      componentProps: () => {
        return {
          allowClear: false,
          placeholder: t('modalForm.member.member__currency_tip'),
          options: currencyList.value,
          getPopupContainer: () => document.body,
        };
      },
    },
    /* 加款内容为钱包时显示 */
    {
      field: 'cash_type',
      label: t('modalForm.member.member_type_add') + ':',
      component: 'Select',
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(
                t('common.chooseText') + t('modalForm.member.member_type_add').toLowerCase(),
              );
            }
            return Promise.resolve();
          },
        },
      ],
      colProps: { span: colProps },
      slot: 'cashType',
      ifShow: ({ values }) => values.action === 1,
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'amount',
      label: t('modalForm.member.member_add_money1') + ':',
      colProps: { span: colProps },
      component: 'InputNumber',
      componentProps: {
        placeholder: t('modalForm.member.member_add_money_tip'),
        stringMode: true,
        max: '9999999999.99999999',
      },
      required: true,
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('modalForm.member.member_add_money_tip'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
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
        min: 0,
        controls: false,
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
      field: 'remark',
      label: t('business.common_remarks_infor') + ':',
      required: true,
      component: 'InputTextArea',
      colProps: { span: colProps },
      componentProps: {
        placeholder: t('modalForm.member.member_remark_tip1'),
        rows: 4,
      },
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
  // 减款
  const reduce: FormSchema[] = [
    {
      field: 'wallet_type',
      label: t('modalForm.member.member_reduce_content') + ':',
      component: 'Select',
      required: true,
      colProps: { span: colProps },
      ifShow: ({ values }) => values.action === 2,
      defaultValue: calcOptionsList.value?.[0]?.value,
      componentProps: ({ formModel }) => {
        return {
          notFoundContent: t('common.noPermission'),
          allowClear: false,
          placeholder: t('modalForm.member.member_reduce_content_tip'),
          options: calcOptionsList.value.length > 0 ? calcOptionsList.value : [],
          getPopupContainer: () => document.body,
          disabled: calcOptionsList.value.length < 2 && calcOptionsList.value.length != 0,
          onChange: () => {
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
            formModel.amount = '';
            //formModel.cash_type = null;
            formModel.bet_multiplier = null;
            formModel.remark = '';
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
      // required: true,
      ifShow: ({ values }) => values.action === 2,
      componentProps: () => {
        return {
          allowClear: false,
          placeholder: t('modalForm.member.member__currency_tip'),
          options: currencyList.value,
          getPopupContainer: () => document.body,
        };
      },
    },
    /* 减款内容为钱包时显示 */
    {
      field: 'cash_type',
      label: t('modalForm.member.member_reduce_type') + ':',
      component: 'Select',
      defaultValue: null,
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
      field: 'amount',
      label: t('modalForm.member.member_reduce_money') + ':',
      component: 'Input',
      colProps: { span: colProps },
      componentProps: {
        placeholder: t('modalForm.member.member_reduce_tip2'),
      },
      rules: [{ required: true }],
      ifShow: ({ values }) => values.action === 2,
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
      rules: [{ required: true }],
      ifShow: ({ values }) => values.action === 2,
    },
  ];
  // 左边form内容
  const sumLeftSchemas: FormSchema[] = [
    {
      field: 'username',
      label: t('business.common_member_account') + ':',
      component: 'Input',
      colProps: { span: 24 },
      slot: 'localSearch',
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.member.member_username_tip2'));
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'centerAmount',
      label: t('table.member.member_wallet_balance') + ':',
      defaultValue: '0',
      component: 'InputNumber',
      colProps: { span: 24 },
      dynamicDisabled: true,
      componentProps: ({ schema, formModel }) => {
        formModel.centerAmount =
          balanceDetail.value[currentyOptions[formModel.currency_id]] || '0.00';
        return {
          style: { width: '100%', color: '#FF4D4F' },
          step: '0.01',
          class: 'red-text-input',
        };
      },
    },
    {
      field: 'fee',
      label: t('table.member.member_commission_state') + ':',
      defaultValue: 0,
      component: 'InputNumber',
      colProps: { span: 24 },
      dynamicDisabled: true,
      componentProps: ({ formModel }) => {
        formModel.fee =
          commissionBalanceDetail.value[currentyOptions[formModel.currency_id]] || '0.00';
        return {
          style: { width: '100%', color: '#FF4D4F' },
          //prefix: '¥',
          step: '0.01',
          class: 'red-text-input',
        };
      },
    },
    {
      field: 'action',
      label: t('modalForm.member.member_add_money') + ':',
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: ({ formModel }) => {
        return {
          options: [
            { label: t('modalForm.member.member_add_add'), value: 1 },
            { label: t('modalForm.member.member_reduce'), value: 2 },
          ],
          onChange: (e) => {
            if (calcOptionsList.value.length > 0) {
              submit(formModel);
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
  ].concat(addmoneylist, reduce);
  useAutoLabelWidth(sumLeftSchemas);
  let submitText = ref<number>(2);

  function filterCurrency(type) {
    currencyList.value = getCurrencyList.filter((el) => el.attr == type);
  }

  function submit(value) {
    submitText.value = value.action;
    value.amount = '';
    //value.cash_type = null;
    value.bet_multiplier = null;
    value.remark = '';
  }

  const FORM_SIZE = useFormSetting().getFormSize;
  const { createMessage } = useMessage();
  const [regAddMoney, { validate, resetFields, setFieldsValue, getFieldsValue }] = useForm({
    // labelWidth: 150,
    //schemas: sumLeftSchemas,
    showResetButton: false,
    actionColOptions: {
      span: 24,
    },
    size: FORM_SIZE,
    baseColProps: { class: 'rowStyle' },
    submitFunc: submitFunc,
  });

  const datalist = ref([] as any);
  // 加载状态
  const fetching = ref(false as boolean);
  // const handleSearch = useDebounceFn(async (value) => {
  //   if (!value) return false;
  //   fetching.value = true;
  //   const { data, status } = await getByMemberId({ word: value, user_type: 0 });
  //   datalist.value = [];
  //   if (status) {
  //     if (data) {
  //       datalist.value = data;
  //     }
  //   }
  //   fetching.value = false;
  // }, 500);

  const handleSearch = useDebounceFn(async (value) => {
    searchValue.value = value;
    // 确保输入长度至少为3个字符
    if (!value || value.length < 2) {
      datalist.value = []; // 清空现有数据列表（可选）
      return false;
    }
    fetching.value = true;
    if (value.length >= 2) {
      try {
        const data = await getMemberNameList({ username: value });
        datalist.value = data;
      } catch (error) {
        console.error('Error fetching data:', error);
        datalist.value = []; // 出错时清空数据列表
      } finally {
        fetching.value = false;
      }
    }
  }, 500);

  async function handelChange(value, options) {
    options.amount = '';
    options.cash_type = null;
    options.bet_multiplier = null;
    options.remark = '';
    // const userItem =
    //   datalist.value.length && datalist.value?.find((item: any) => item.username === value);
    if (!value) return;
    const amountDetails = await getbalanceMember({ name: value });
    balanceDetail.value = amountDetails.balance;
    commissionBalanceDetail.value = amountDetails.balance_agency;
  }

  function optionsList(action, cashType) {
    // 最外层if基本多余逻辑，但是没办法，等做了权限路由联动后可以删除，还有表格内的一些多余的东西，等做了联动可以移除
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

  async function submitFunc() {
    const values = await validate();
    values['uid'] = balanceDetail.value.uid;
    delete values['centerAmount'];
    delete values['fee'];
    //delete values['cash_type'];
    if (values) {
      loadingValue.value = true;
      const { data, status } = await balanceUpdate(values);
      if (status) {
        createMessage.success(data);
        submitText.value = 2;
        await resetFields();
        loadingValue.value = false;
        setFieldsValue({ username: undefined, centerAmount: '0.00', fee: '0.00' });
        //刷新页面控件
        Modal.destroyAll();
        // eventBus.emit('cancelModal');
      } else {
        createMessage.error(data);
        loadingValue.value = false;
        if (data == '币种类型错误') {
          Modal.destroyAll();
        }
      }
    }
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
  .addMoney .moneyLayout .ant-row .rowStyle {
    margin-bottom: 0 !important;
  }

  .addMoney .ant-row .rowStyle .ant-form-item {
    margin-bottom: 20px !important;
  }

  .addMoney .ant-row .ant-col .ant-form-item {
    margin-bottom: 0;
  }
</style>
