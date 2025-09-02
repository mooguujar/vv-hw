<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="titleModal"
    @ok="handleSubmit"
    :width="520"
    :minHeight="100"
    :cancelText="$t('common.cancelText')"
    :okText="$t('common.okText')"
    :showCancelBtn="false"
    :destroyOnClose="true"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, onMounted, unref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { channelProvidersFormSchema } from './addChannelLinkModal.data.js';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { channelProvidersInsert, channelProvidersUpdate } from '@/api/promotion';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
    labelWidth: 'auto',
    baseColProps: { span: 22 },
    schemas: channelProvidersFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 22,
    },
    size: FORM_SIZE,
  });
  const titleModal = ref('' as string);
  const channelProviders = ref({} as object);
  const emit = defineEmits(['success']);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    const { title, item } = data;
    titleModal.value = title;
    await resetFields();
    nextTick(async () => {
      channelProviders.value = {};
      if (item?.id) {
        channelProviders.value = item;
        await setFieldsValue({ group_name: item.group_name });
      } else {
        await setFieldsValue({ group_name: '' });
      }
    });
  });

  async function handleSubmit() {
    const values = await validate();
    let res = {};
    //编辑
    if (channelProviders.value.id) {
      res = await channelProvidersUpdate({
        ...channelProviders.value,
        group_name: values.group_name?.trim(),
        only_state: 0,
      });
    } else {
      //新增
      res = await channelProvidersInsert({ group_name: values.group_name?.trim() });
    }
    const { status, data } = res;
    if (status) {
      message.success(data);
      emit('success');
      closeModal();
    } else {
      message.error(data);
    }
  }
</script>
