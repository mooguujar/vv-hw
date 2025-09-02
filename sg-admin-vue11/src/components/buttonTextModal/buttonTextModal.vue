<template>
  <BasicModal
    @register="registerBasicModal"
    :cancelText="$t('business.common_cancel')"
    :okText="$t('common.sure')"
    :title="t('layout.header.dropdownLanguage')"
    @ok="handleSubmit"
  >
    <BasicForm :size="FORM_SIZE" @register="registerForm" :schemas="getSchemas()" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useLocalList } from '/@/settings/localeSetting';
  import { ref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const FORM_SIZE = useFormSetting().getFormSize;

  const localeList = useLocalList();

  const type = ref(null);
  const defaultLocale = ref(null);
  const { t } = useI18n();

  function getSchemas() {
    const schemas = localeList.map((item) => {
      return {
        ...item,
        label: item.label + ':',
        component: 'Input',
        field: item.event,
        componentProps: {
          placeholder:
            type.value == 'zh_name'
              ? t('v.discount.activity.active_name')
              : t('v.discount.activity.btnText'),
        },
      };
    });
    useAutoLabelWidth(schemas);
    return schemas;
  }

  const emits = defineEmits(['emitsValues', 'register']);

  const [registerForm, { validate, setFieldsValue, resetFields }] = useForm({
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    // labelWidth: 120,
  });

  const [registerBasicModal, { closeModal }] = useModalInner(async (data) => {
    // resetFields();
    type.value = data.type;
    if (defaultLocale.value !== data.data.default) {
      defaultLocale.value = data.data.default;
      setFieldsValue(data.data);
    }
  });
  async function handleSubmit() {
    const values = await validate();
    emits('emitsValues', values, type.value);
    closeModal();
  }
</script>
