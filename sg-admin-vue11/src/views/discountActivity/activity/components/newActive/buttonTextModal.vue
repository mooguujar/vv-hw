<template>
  <BasicModal
    @register="registerBasicModal"
    :cancelText="t('business.common_cancel')"
    :okText="t('common.sure')"
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

  const FORM_SIZE = useFormSetting().getFormSize;

  const localeList = ref(useLocalList());
  const { t } = useI18n();
  const type = ref(null);

  function getSchemas() {
    return localeList.value.map((item) => {
      return {
        ...item,
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
  }

  const emits = defineEmits(['emitsValues', 'register']);

  const [registerForm, { validate, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    baseColProps: { span: 20 },
    labelWidth: 120,
  });

  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    type.value = data.type;
    const keys = Object.keys(data.data);
    localeList.value = useLocalList().filter((el: any) => keys.includes(el.event));
    setFieldsValue(data.data);
  });

  async function handleSubmit() {
    const values = await validate();
    emits('emitsValues', values, type.value);
    closeModal();
  }
</script>
