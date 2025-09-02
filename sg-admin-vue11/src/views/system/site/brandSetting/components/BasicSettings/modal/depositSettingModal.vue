<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('modalForm.system.system_settings_deposit')"
    @ok="handleSubmit"
    width="480"
  >
    <BasicForm @register="registerForm" @submit="handleSubmit">
      <template #minWithdraw="{ model, field }">
        <InputNumber
          v-model:value="model[field]"
          :placeholder="t('common.enterLowerestAmountNoLimit0')"
          size="large"
        >
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
      <template #minDeposit="{ model, field }">
        <InputNumber
          v-model:value="model[field]"
          :placeholder="t('common.enterLowerestDepositNoLimit0')"
          size="large"
        >
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup name="AccessMoneySettingModal">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemaTable } from './accessMoneySettingModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { InputNumber } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { currencyTreeList } = useTreeListStore();
  const FORM_SIZE = useFormSetting().getFormSize;
  const activeKey = ref('min_access');
  const emit = defineEmits(['update:ok']);
  const title = ref('' as string);
  const props = defineProps({
    getInfoLimit: {
      type: Object,
      default: () => ({}),
    },
  });
  const [registerForm, { resetFields, setFieldsValue, validate, clearValidate }] = useForm({
    baseColProps: { span: 24 },
    showActionButtonGroup: false,
    schemas: schemaTable,
    actionColOptions: {
      span: 24,
    },
    size: FORM_SIZE,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    await setModalProps({ confirmLoading: false });
    const { type, record } = data;
    activeKey.value = type;
    setFieldsValue({ ...record });
    await clearValidate();
  });

  async function handleSubmit() {
    try {
      const value = await validate();
      value['min_deposit'] = value['min_deposit'].toString();
      value['min_withdraw'] = value['min_withdraw'].toString();
      emit('sendParams', value, activeKey.value);
      closeModal();
    } catch (e) {
      console.error(e);
    }
  }
</script>
