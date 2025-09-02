<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
    width="580px"
    id="regionCountry_wrap_log"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './editCardForm.js';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { member_bankcard_update } from '/@/api/member/index.js';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emits = defineEmits(['diamondsuccess']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const getTitle = ref('');

  const props = defineProps({
    currency_id: {
      type: Object,
      default: '',
    },
  });

  const searchValue = ref('' as any);
  const [
    registerForm,
    {
      setFieldsValue,
      updateSchema,
      validate,
      getFieldsValue,
      resetFields,
      removeSchemaByField,
      appendSchemaByField,
    },
  ] = useForm({
    baseColProps: { span: 24 },
    schemas: accountFormSchema(props.currency_id?.key || props.currency_id?.modalType),
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
    size: FORM_SIZE,
  });
  const title = ref('' as string);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    searchValue.value = '';
    getTitle.value = props.currency_id?.modalType
      ? t('modalForm.member.member_edit_payment_information')
      : t('modalForm.member.member_edit_debit_card');
    if (props.currency_id?.key == '701' || props.currency_id?.modalType == '701') {
      if (data.type_name == '银行卡') {
        updateSchema({
          field: 'bank_name',
          componentProps: {
            disabled: true,
          },
          ifShow: true,
        });
        updateSchema({
          field: 'address',
          componentProps: {
            disabled: false,
          },
          ifShow: true,
        });
      } else {
        if (data.type_name == '支付宝') {
          updateSchema({
            field: 'bank_name',
            componentProps: {
              disabled: true,
            },
            ifShow: false,
          });
        } else {
          updateSchema({
            field: 'bank_name',
            componentProps: {
              disabled: true,
            },
            ifShow: true,
          });
        }
        updateSchema({
          field: 'address',
          componentProps: {
            disabled: true,
          },
          ifShow: false,
        });
      }
    } else {
      updateSchema({
        field: 'address',
        componentProps: {
          disabled: true,
        },
        ifShow: false,
      });
    }

    await setFieldsValue({ ...data });
    setModalProps({ confirmLoading: false });
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      let parm = {
        id: values.id,
        bank_account: values.bank_account,
        address: values.address,
      };
      const { status, data } = await member_bankcard_update(parm);
      if (status) {
        message.success(data);
        closeModal();

        emits('diamondsuccess');
      } else {
        message.error(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="less" scoped></style>
