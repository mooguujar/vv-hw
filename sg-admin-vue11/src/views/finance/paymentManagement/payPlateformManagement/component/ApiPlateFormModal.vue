<template>
  <BasicModal
    :title="setTitle"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @register="register"
    @ok="saveFun"
    :width="650"
  >
    <BasicForm @register="registerForm" @field-value-change="fieldChang">
      <template #pay_method_extra>
        <div class="text-center" v-show="tabsFormSchema.length > 0">
          <Tabs
            class="bg-gray"
            v-model:activeKey="activeKey"
            style="width: 520px; margin: 0 auto; margin-left: 30px; padding: 0 10px"
          >
            <TabPane
              v-for="(item, index) in tabsFormSchema"
              :key="item.key"
              v-bind="omit(item, ['Form', 'key'])"
              :tab="tabName[index]"
            >
              <BasicForm v-if="item.Form" @register="item.Form[0]" />
            </TabPane>
          </Tabs>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick, computed } from 'vue';
  import { BasicForm, useForm, UseFormReturnType, FormProps } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { tabSchema } from '../paymentPlatform.data';
  import { Tabs, TabPane, message } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { omit } from 'lodash-es';
  import {
    insertPaymentMerchant,
    updatePaymentMerchant,
    getMethodCompanyList,
    updateModifyMerchant,
  } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  type TabsFormType = {
    key: string;
    tab: string;
    contract_id: string;
    contract_name: string;
    forceRender?: boolean;
    Form?: UseFormReturnType;
  };

  const emits = defineEmits(['success', 'register']);

  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
  });

  const { getCurrencyList } = useCurrencyStore();

  const FORM_SIZE = useFormSetting().getFormSize;
  const methodIds = ref([]);
  const companyName = ref(false);
  const labelWidth = computed(() =>
    useAutoLabelWidth(
      props.apiMap.schemas(methodIds, props.apiMap.schemasParmas?.isShow, companyName),
    ),
  );
  const [
    registerForm,
    { setFieldsValue, resetFields, validate: validateForm, getFieldsValue, resetSchema },
  ] = useForm({
    schemas: props.apiMap.schemas(methodIds, props.apiMap.schemasParmas?.isShow, companyName),
    labelWidth: labelWidth,
    showActionButtonGroup: false,
    size: FORM_SIZE,
  });
  const paymentValue = ref<any>([]);
  const setTitle = ref<any>('');
  const activeKey = ref<any>('');
  const type = ref<any>('');
  const rowId = ref<any>();
  const record = ref<any>({});
  const tabsFormSchema = ref<TabsFormType[]>([]);
  const methodsList = ref<any>([]);

  const [register, { closeModal }] = useModalInner(async (values) => {
    //data.name是判断是否展示常用金额的字段
    const { data, title } = values;
    rowId.value = data?.id;
    record.value = data;
    tabsFormSchema.value = [];
    if (data && data.type_pay) type.value = data.type_pay;

    resetFields();
    if (data) {
      setTitle.value = title || `${t('modalForm.member.member_edit_payment_plant')}`; //编辑支付平台
      const method_ids = data.methods ? data.methods.map((item) => item.id) : [];

      const response = await getMethodCompanyList({
        withdraw: 1,
        currency_id: data.currency_id,
        company_id: data.company_id,
      });

      methodsList.value = response
        ? response.map((item) => {
            return { ...item, value: item.id, label: item.name };
          })
        : [];

      methodIds.value = method_ids;
      const { currency_id } = data;
      const currencyObj = getCurrencyList.find((item) => item.id === currency_id);
      await setFieldsValue({
        ...data,
        method_ids: method_ids,
        currency_type: Number(currencyObj.attr),
      });

      if (data.methods) {
        tabsFormSchema.value.forEach((item: any) => {
          const method = data.methods.find((i) => i.id === item.key);
          const { setFieldsValue, removeSchemaByField } = item.Form[1];
          if (data.name === 'Crypto-pay') {
            removeSchemaByField('often_amount');
          }
          setFieldsValue({
            ...method,
            _amount_all: [method.amount_min, method.amount_max],
          });
        });
      }
    } else {
      resetSchema(props.apiMap.schemas(methodIds, props.apiMap.schemasParmas?.isShow, companyName));
      paymentValue.value = [];
      setTitle.value = t('modalForm.finance.finance_add_payplatform'); //添加支付平台
    }
  });
  /////////////////
  watch(
    () => methodIds.value,
    (newVal) => {
      nextTick(async () => {
        getFormSchemas(newVal);
      });
    },
  );
  /////////////////
  const baseFormConfig: Partial<FormProps> = {
    showActionButtonGroup: false,
    labelWidth: 100,
    size: FORM_SIZE,
  };

  async function getFormSchemas(newVal) {
    if (newVal.length === 0) {
      tabsFormSchema.value = [];
      return;
    }
    const values = await getFieldsValue();
    const methodsOptions = values.methodsOptions || methodsList.value;
    for (let i = 0; i < newVal.length; i++) {
      const payMethod: any = methodsOptions.find((method: any) => method.value === newVal[i]);
      const tab = {
        key: payMethod.value,
        tab: payMethod.label,
        contract_id: payMethod.contract_id,
        contract_name: payMethod.contract_name,
        forceRender: true,
        Form: useForm(Object.assign({ schemas: tabSchema }, baseFormConfig) as FormProps),
      };
      if (tabsFormSchema.value.length > newVal.length) {
        // 删除
        for (let j = 0; j < tabsFormSchema.value.length; j++) {
          if (newVal.indexOf(tabsFormSchema.value[j].key) === -1) {
            tabsFormSchema.value.splice(j, 1);
          }
        }
      }
      if (!tabsFormSchema.value[i]) {
        // 新增
        tabsFormSchema.value.splice(i, 1, tab);
      }
    }
    nextTick(() => {
      if (companyName.value) {
        const fieldValue = getFieldsValue();
        if (fieldValue?.method_ids?.length > 0) {
          tabsFormSchema.value.forEach((item) => {
            const { removeSchemaByField } = item.Form[1];
            removeSchemaByField('often_amount');
          });
        }
      }
    });
    activeKey.value = tabsFormSchema?.value[0].key || '';
  }
  function fieldChang(v, value) {
    if (v == 'currency_type') {
      resetFields();
      setFieldsValue({ currency_type: value });
    }
  }

  async function saveFun() {
    const values = await validateForm();
    let lastKey = '';
    try {
      const methods: any = [];
      for (const item of tabsFormSchema.value) {
        lastKey = item.key;
        if (item.Form && item.Form[1]) {
          const { validate, getFieldsValue } = item.Form[1];
          const method = record.value?.methods
            ? record.value.methods.find((i) => i.id === item.key)
            : {};
          await validate();
          const values = getFieldsValue();
          // if (values.amount_type === 2 && (!values.amount_min || !values.amount_max)) {
          //   message.error('请输入单笔下限和上限');
          //   return false;
          // }
          if (values.amount_type === 1) {
            delete values['amount_min'];
            delete values['amount_max'];
          } else {
            delete values['amount_fixed'];
          }
          delete values['_amount_all'];
          methods.push({
            ...method,
            ...values,
            contract_name: item.contract_name,
            contract_id: item.contract_id,
          });
        }
      }

      values['methods'] = methods.map((item, index) => {
        const id = values['method_ids'][index];
        return {
          ...item,
          id,
          // method_id: method_type_id[0],
          // type_id: method_type_id[1],
        };
      });
      delete values['method_ids'];
      delete values['methodsOptions'];
      delete values['currency_type'];

      const { data, status } = rowId.value
        ? type.value == 'pay_edit'
          ? await updateModifyMerchant(values)
          : await updatePaymentMerchant(values)
        : await insertPaymentMerchant(values);

      if (status) {
        message.success(data);
        emits('success', values.currency_id);
        closeModal();
      } else {
        message.error(data);
        activeKey.value = lastKey;
      }
    } catch (e) {
      console.error(e);
      // 验证失败或出错，切换到对应标签页
      activeKey.value = lastKey;
    } finally {
      // loading.value = false;
    }
  }
  const tabName = computed(() => {
    return tabsFormSchema.value.map((item) => {
      if (Number(item.contract_id)) {
        return item.tab.includes('-') ? item.tab : `${item.tab}-${item.contract_name}`;
      } else {
        return item.tab;
      }
    });
  });
</script>

<style lang="less" scoped>
  ::deep(.ant-checkbox-wrapper) {
    margin-left: 0 !important;
  }
</style>
