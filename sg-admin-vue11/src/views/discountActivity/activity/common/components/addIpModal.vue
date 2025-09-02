<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './addIpModal.data.ts';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateRiskBlack } from '/@/api/risk';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

  useAutoLabelWidth(accountFormSchema);
  const { t } = useI18n();
  export default defineComponent({
    name: 'AddIpModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 22 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });
      const title = ref('' as string);
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        title.value = data.title;
        if (data.category == 1) {
          updateSchema({
            field: 'content',
            label: t('table.risk.report_ip_address') + ':', //IP地址
            componentProps: {
              placeholder: t('table.risk.report_ip_address_tip'), //请输入IP地址
            },
          });
        } else if (data.category == 2) {
          updateSchema({
            field: 'content',
            label: t('table.member.member_device_no') + ':', //设备号
            componentProps: {
              placeholder: t('table.member.member_device_no_tip'), //请输入设备号
            },
          });
        } else if (data.category == 3) {
          updateSchema({
            field: 'content',
            label: t('business.common_email_account') + ':', //邮箱账号
            componentProps: {
              placeholder: t('business.common_email_account_tip'), //请输入邮箱账号
            },
          });
        }
        if (data.id) {
          if (data.ip_location.length < 10) data.ip_location = '-';
          await setFieldsValue({
            id: data.id,
            content: data.content,
            remarks: data.remarks,
            limit_type: data.limit_type,
            ipLocation: data.ip_location,
          });
        }
        setFieldsValue({ category: data.category });
        setModalProps({ confirmLoading: false });
      });
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          values.ipPlaceOfBelonging = '';
          const { status, data } = await updateRiskBlack(values);
          if (status) {
            message.success(data);
            closeModal();
            emit('success');
          } else {
            message.error(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit, title };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col.ant-col-24 .ant-form-item-explain-error) {
    transform: translateY(-10px);
  }
</style>
