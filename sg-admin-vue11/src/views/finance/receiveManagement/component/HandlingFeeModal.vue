<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="okFun"
    :title="$t('modalForm.finance.finance_fee_configuration')"
    :width="560"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
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
  import { updateWithdrawFee } from '/@/api/finance';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const colSpan = 24;

  const schemas: FormSchema[] = [
    {
      field: 'count',
      component: 'InputNumber',
      label: `${t('modalForm.finance.finance_take_times_days')}>`, //每日取款次数
      colProps: { span: colSpan },
      componentProps: {
        autoComplete: 'off',
        placeholder: t('modalForm.finance.finance_free_count'), //请输入商户密钥
        min: 0,
      },
    },
    {
      field: 'rate',
      component: 'InputNumber',
      label: t('modalForm.finance.finance_fee_rate'), //手续费比例
      colProps: { span: colSpan },
      componentProps: {
        autoComplete: 'off',
        min: 0,
        placeholder: t('modalForm.finance.finance_free_rate'), //请输入商户密钥
        addonAfter: '%',
      },
    },
  ];
  useAutoLabelWidth(schemas);
  export default defineComponent({
    name: 'HandlingFeeModal',
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
        const { count, rate, ...restData } = data;
        const updatedData = {
          count: count === 0 ? null : count,
          rate: rate === 0 ? null : rate,
          ...restData,
        };
        setFieldsValue(updatedData);
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      async function okFun() {
        try {
          setModalProps({ confirmLoading: true });
          const value = await validate();
          const { status, data } = await updateWithdrawFee(value);
          if (status) {
            message.success(data);
            // context.emit('diamondsuccess', value.currency_id);
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

      return { register, schemas, registerForm, model: modelRef, handleVisibleChange, okFun };
    },
  });
</script>
