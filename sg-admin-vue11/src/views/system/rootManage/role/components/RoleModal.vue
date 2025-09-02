<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :okText="okText"
    :showCancelBtn="false"
    @ok="handleSubmit"
    :minHeight="100"
    width="560"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { modalFormSchema } from '../index.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { insertGroup, updateGroup } from '/@/api/sys/rootManage';
  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const isUpdate = ref(true);
      const gid = ref('');
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        baseColProps: { span: 24 },
        schemas: modalFormSchema,
        showActionButtonGroup: false,
        size: FORM_SIZE,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        gid.value = data.record.gid || '';
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            roleName: data.record.name,
            roleNoted: data.record.noted,
          });
        }
      });

      const { t } = useI18n();
      const getTitle = computed(() =>
        !unref(isUpdate) ? t('modalForm.system.add_role') : t('table.system.system_edit_role'),
      );
      const okText = computed(() =>
        !unref(isUpdate) ? t('table.system.system_conform_add') : t('business.banner_confrim'),
      );
      async function handleSubmit() {
        try {
          const values = await validate();
          if (isUpdate.value) {
            // 編輯
            await updateGroup({
              gid: gid.value,
              name: values.roleName,
              noted: values.roleNoted,
            });
          } else {
            // 新增
            await insertGroup({
              pid: '0',
              name: values.roleName,
              noted: values.roleNoted,
            });
          }

          setModalProps({ confirmLoading: true });
          // TODO custom api
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, okText };
    },
  });
</script>
