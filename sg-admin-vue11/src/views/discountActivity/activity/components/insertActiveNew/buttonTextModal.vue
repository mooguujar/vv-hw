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
  import { message } from 'ant-design-vue';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const FORM_SIZE = useFormSetting().getFormSize;

  const localeList = ref(useLocalList());
  const { t } = useI18n();
  const type = ref(null);

  function getSchemas() {
    const schemas = localeList.value.map((item) => {
      return {
        ...item,
        component: 'Input',
        label: item.label + ':',
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
    baseColProps: { span: 20 },
  });
  let default_ = false;
  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    type.value = data.type;
    const keys = Object.keys(data.data);
    // 首字母大写处理
    if (data.data) {
      if (data.data.en_US) {
        data.data.en_US = data.data.en_US.charAt(0).toUpperCase() + data.data.en_US.slice(1);
      }
      if (data.data.pt_BR) {
        data.data.pt_BR = data.data.pt_BR.charAt(0).toUpperCase() + data.data.pt_BR.slice(1);
      }
      if (data.data.vi_VN) {
        data.data.vi_VN = data.data.vi_VN.charAt(0).toUpperCase() + data.data.vi_VN.slice(1);
      }
    }

    localeList.value = useLocalList().filter((el: any) => keys.includes(el.event));
    if (data.localeList) {
      localeList.value = data.localeList;
    }
    if (data.default) {
      default_ = data.default;
      const extraList = [
        {
          label: t('business.common_original'), //翻译原文
          value: 'default',
          event: 'default',
          transitionValue: '',
          transitionValueTitle: '',
          image_url: '',
          language: 'original',
        },
      ];
      localeList.value = [...extraList, ...localeList.value];
    }
    resetFields();
    setFieldsValue({ ...data.data });
  });
  const isEmptyObject = (obj) =>
    obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0;

  async function handleSubmit() {
    let values = await validate();
    values = Object.entries(values)
      .filter(([key, value]) => !!value && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    if (isEmptyObject(values)) {
      message.error(t('v.discount.activity.input_task_categories_name'));
      return;
    }
    if (default_ && !values.default) {
      message.error(t('v.bannner.origin_transitionValue'));
      return;
    }
    emits('emitsValues', values, type.value);
    closeModal();
  }
</script>
