<template>
  <BasicModal
    @ok="okFun"
    :title="modalTitle"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @register="registeraddDemond"
    :width="560"
  >
    <BasicForm @register="registeraddDemondForm">
      <template #idDefault="{ model, field }">
        <FormItem>
          <Checkbox v-model:checked="checkboxValue" />
        </FormItem>
      </template>
      <template #minDeposit="{ model, field }">
        <InputNumber
          v-model:value="model[field]"
          :placeholder="t('modalForm.member.member_min_tip')"
        >
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </InputNumber>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './addMemberLevel.data';
  import { insertLevel, updateLevel } from '@/api/member/index';
  import { message, Checkbox, FormItem, InputNumber } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['diamondsuccess', 'register']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const rowKey = ref<any>('');
  const modalTitle = ref<any>('');
  const records = ref<any>({});
  const checkboxValue = ref<any>(false);
  const [registeraddDemondForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelAlign: 'right',
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    size: FORM_SIZE,
  });
  const [registeraddDemond, { setModalProps, closeModal }] = useModalInner(async (values) => {
    records.value = values;
    rowKey.value = values.id;
    checkboxValue.value = false;

    if (values.id) {
      await setFieldsValue({ ...values });
      modalTitle.value = t('modalForm.member.member_edit_level');
    } else {
      resetFields();
      modalTitle.value = t('modalForm.member.member_add_level');
    }
    setModalProps({ confirmLoading: false });
  });

  async function okFun() {
    try {
      setModalProps({ confirmLoading: true });
      const value = await validate();
      value.is_default = checkboxValue.value ? 1 : records.value.is_default;
      value.level_id = value.level_id.toString();
      value.min_deposit = value.min_deposit.toString();
      const { status, data } = rowKey.value ? await updateLevel(value) : await insertLevel(value);
      if (status) {
        message.success(data);
        emit('diamondsuccess');
        resetFields();
        setFieldsValue({ is_default: false });
        closeModal();
      } else {
        message.error(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-form-item) {
    //border:1px solid red!important;
  }

  ::v-deep(.ant-input-number-input) {
    height: 40px !important;
  }
</style>
