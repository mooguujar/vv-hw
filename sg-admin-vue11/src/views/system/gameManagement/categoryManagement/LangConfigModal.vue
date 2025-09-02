<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.MutiLangConfig')"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { langFormSchema } from './categoryManagement.data';
  import { updateGameCategory } from '/@/api/sys/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'LangConfigModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;

      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 22 },
        schemas: langFormSchema,
        showActionButtonGroup: false,
        showResetButton: false,
        showSubmitButton: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      async function handleSubmit() {
        const values = await validate();
        setModalProps({ confirmLoading: true });
        const { data, status } = await updateGameCategory(values);
        if (status) {
          message.success(data);
          closeModal();
          emit('success');
        } else {
          message.error(data);
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit, t };
    },
  });
</script>
