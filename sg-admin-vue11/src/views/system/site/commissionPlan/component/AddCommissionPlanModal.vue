<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="modalTitle"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './addCommissionPlanModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateGame } from '/@/api/sys/index';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'AddCommissionPlanModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const isEdit = ref<boolean>(false);
      const modalTitle = computed(() => (isEdit.value ? t('modalForm.system.system_edit_received') : t('modalForm.system.system_add_received'))); //'编辑佣金方案' : '添加佣金方案'

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 22 },
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        isEdit.value = data.isEdit;
        setModalProps({ confirmLoading: false });
        setFieldsValue({
          ...data.record,
        });
      });

      async function handleSubmit() {
        try {
          const values = await validate();

          setModalProps({ confirmLoading: true });

          const { data, status } = isEdit.value ? await updateGame(values) : null;
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

      return { modalTitle, registerModal, registerForm, handleSubmit };
    },
  });
</script>
