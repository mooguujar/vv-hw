<template>
  <BasicModal
    :title="modalTitle"
    :width="560"
    :okText="$t('common.confirmSave')"
    :cancelText="$t('common.cancelText')"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerVip" :label-width="labelWidth" class="editVipModal">
      <template #idDefault="{ model, field }">
        <Checkbox v-model:checked="checkboxValue" />
      </template>
      <template #upGift="{ model, field }">
        <InputNumber v-model:value="model[field]">
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
      <template #dailyGift="{ model, field }">
        <InputNumber v-model:value="model[field]">
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
      <template #weeklyGift="{ model, field }">
        <InputNumber v-model:value="model[field]">
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
      <template #monthlyGift="{ model, field }">
        <InputNumber v-model:value="model[field]">
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
      <template #birthdayGift="{ model, field }">
        <InputNumber v-model:value="model[field]">
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { message, Checkbox, InputNumber } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { editData } from './EditVipModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  import { updateVip } from '@/api/member/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const modalTitle = ref<any>('');
  const emit = defineEmits(['success', 'register']);
  let record: any = ref({});
  const props = defineProps({
    labelWidth: Number,
  });
  const [registerVip, { resetFields, clearValidate, validate, setFieldsValue }] = useForm({
    schemas: editData,
    showActionButtonGroup: false,
    //labelWidth: '150px',
    size: FORM_SIZE,
  });
  const checkboxValue = ref<any>(false);
  const records = ref({} as any);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    records.value = data;
    checkboxValue.value = false;
    modalTitle.value = t('table.member.member_edit_level');
    await setFieldsValue(data);
  });

  async function handleSubmit(): Promise<void> {
    try {
      const values = await validate();
      if (records.value.is_default === 1) {
        values.is_default = 1;
      } else {
        values.is_default = checkboxValue.value ? 1 : 2;
      }
      setModalProps({ confirmLoading: true });
      const { status, data } = await updateVip({
        id: record.value.id,
        ...values,
        rebate_config: '',
      });
      if (status) {
        message.success(data);
        emit('success');
        setFieldsValue({ is_default: false });
        closeModal();
      } else {
        message.error(data);
      }
      setModalProps({ confirmLoading: false });
    } catch {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="less" scoped>
  .editVipModal {
    ::v-deep(.ant-form-item) {
      margin-bottom: 17px !important;
    }
  }

  ::v-deep(.ant-input-number-input) {
    height: 40px !important;
  }
</style>
