<template>
  <BasicModal
    :title="modalTitle"
    :okText="t('common.confirmSave')"
    :maxHeight="100"
    :minHeight="80"
    @register="registerEditorModal"
    :cancelText="t('business.common_cancel')"
    @ok="submitFunc"
  >
    <BasicForm @register="registerEditor">
      <template #contentEditor>
        <Tinymce :showImageUpload="false" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { message } from 'ant-design-vue';
  import { uploadCategoryBrand } from '/@/api/sys';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const modalTitle = ref<any>('');
  const emit = defineEmits(['update:ok']);

  const [registerEditor, { setFieldsValue, validate, updateSchema }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        label: t('common.content'),
        field: 'id',
        component: 'Input',
        colProps: { span: 24 },
        labelWidth: 180,
        required: true,
        show: false,
      },
      {
        label: t('common.content'),
        field: 'jump_url',
        component: 'Input',
        colProps: { span: 24 },
        labelWidth: 180,
        required: true,
      },
    ],
  });

  const [registerEditorModal, { closeModal }] = useModalInner(async (data) => {
    const { name } = data;
    modalTitle.value = name;
    setFieldsValue({ ...data });
    updateSchema({ field: 'jump_url', label: t('common.enterNjumpUrl', [name]) });
  });

  async function submitFunc(): Promise<void> {
    try {
      const value = await validate();
      const { status, data } = await uploadCategoryBrand(value);
      if (status) {
        message.success(data);
        emit('update:ok');
        closeModal();
      } else {
        message.error(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>
