<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="$t('routes.system.apppackaging')"
    @ok="handleSubmit"
    :cancelText="`${$t('common.cancelText')}`"
    :okText="`${$t('common.okText')}`"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { baseSchema } from './apppacking.data';
  import { buildAppPkg } from '/@/api/site';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'AppModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 22 },
        schemas: baseSchema,
        showActionButtonGroup: false,
        size: FORM_SIZE,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          const { status, data } = await buildAppPkg(values);
          if (status) {
            message.success(data);
            closeModal();
            emit('success');
          } else {
            message.error(data);
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit };
    },
  });
</script>
