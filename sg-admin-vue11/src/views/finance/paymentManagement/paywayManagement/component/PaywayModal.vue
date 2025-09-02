<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="$t('business.common_label_edit')"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getSchema } from './paywayModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateMethodTagMerchant } from '/@/api/finance';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'PaywayModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const id = ref<any>();
      const { getTagTreeList } = useTreeListStore();
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 22 },
        schemas: getSchema(),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        data.record.tag_id = data.record.tag_id.toString();
        id.value = data.record.id;
        setFieldsValue({
          ...data.record,
        });
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          delete values.name;
          values.tag_id = Number(values.tag_id);
          if (values.tag_id) {
            values.tag_name = getTagTreeList.find((item) => item.id == values.tag_id)?.name;
          }
          const { data, status } = await updateMethodTagMerchant({
            ...values,
            payment_method_id: id.value,
          });
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
