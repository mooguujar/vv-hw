<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="okFun"
    :title="t('modalForm.member.member_authorized_limit')"
    :width="600"
    :okText="t('common.okText')"
    :cancelText="t('common.cancelText')"
    @visible-change="handleVisibleChange"
  >
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message } from 'ant-design-vue';
  import { updateMerchantWithdrawCredit } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const colSpan = 20;

  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: '',
      colProps: { span: colSpan },
      rules: [{ required: true }],
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.member.member_pay_plant_tip'),
        disabled: true,
      },
      show: false,
    },
    {
      field: 'company_name',
      component: 'Input',
      label: t('modalForm.member.member_pay_plant') + ':', //代付平台
      colProps: { span: colSpan },
      rules: [{ required: true }],
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.member.member_pay_plant_tip'), //请输入代付平台
        disabled: true,
      },
    },
    {
      field: 'company_id',
      component: 'Input',
      label: t('modalForm.member.member_pay_plant') + ':', //代付平台
      colProps: { span: colSpan },
      rules: [{ required: true }],
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.member.member_pay_plant_tip'), //请输入代付平台
        disabled: true,
      },
      show: false,
    },
    {
      field: 'account',
      component: 'Input',
      label: t('modalForm.member.member_customer_number') + ':', //商户编号
      colProps: { span: colSpan },
      rules: [{ required: true }],
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.member.member_customer_number_tip'), //请输入商户编号
        disabled: true,
      },
    },
    {
      field: 'credit_amount',
      component: 'Input',
      label: t('modalForm.member.member_authorized_limit') + ':', //授权额度
      colProps: { span: colSpan },
      rules: [{ required: true }],
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.member.member_authorized_limit_tip'), //请输入授权额度
      },
    },
  ];
  useAutoLabelWidth(schemas);
  export default defineComponent({
    name: 'QuotaModal',
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['diamondsuccess', 'register'],
    setup(props, context) {
      const modelRef = ref({});
      const [registerForm, { setFieldsValue, validate }] = useForm({
        showResetButton: false,
        showSubmitButton: false,
        schemas,
        size: FORM_SIZE,
      });

      const [register, { setModalProps, closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        setFieldsValue({ ...data });
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      async function okFun() {
        try {
          setModalProps({ confirmLoading: true });
          const value = await validate();
          const { status, data } = await updateMerchantWithdrawCredit(value);
          if (status) {
            message.success(data);
            context.emit('diamondsuccess', value.currency_id);
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

      return { register, schemas, registerForm, model: modelRef, handleVisibleChange, okFun, t };
    },
  });
</script>
