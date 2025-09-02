<template>
  <div>
    <BasicModal
      @register="registerHandle"
      :title="$t('table.system.system_sort_modalTitle')"
      :width="610"
      :maxHeight="200"
      :minHeight="100"
      cancelText=""
      :okText="$t('table.system.system_conform_save')"
      @ok="okSubmit"
    >
      <BasicForm @register="registerBaseForm" />
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { langrageArr } from '../move';
  import { updateLangSync } from '/@/api/sys/index';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  let langObj = ref({} as any);
  const setLangurage = ref('' as any);
  const sourcelang = ref('' as any);
  const langNewOptions = ref([] as any);
  const FORM_SIZE = useFormSetting().getFormSize;
  const schemas: FormSchema[] = [
    {
      field: 'language',
      component: 'Input',
      label: t('table.system.system_sort_config'),
      dynamicDisabled: true,
      colProps: {
        span: 20,
      },
    },
    {
      field: 'lange',
      component: 'CheckboxGroup',
      label: t('table.system.system_sort_language'),
      required: true,
      componentProps: () => {
        return {
          options: langNewOptions.value,
        };
      },
    },
  ];
  langrageArr.forEach((item) => {
    langObj.value[item.value] = item.label;
  });
  const [registerHandle, { closeModal }] = useModalInner((data) => {
    resetFields();
    setFieldsValue({ language: langObj.value[data.lang] });
    sourcelang.value = data.lang;
    langNewOptions.value = langrageArr.filter((item) => {
      return item.value !== sourcelang.value;
      // if (item.value === sourcelang.value) {
      //   return {
      //     label: item.label,
      //     value: item.value,
      //     disabled: true,
      //   };
      // } else {
      //   return {
      //     label: item.label,
      //     value: item.value,
      //     disabled: false,
      //   };
      // }
    });
  });
  const [registerBaseForm, { setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    size: FORM_SIZE,
    labelWidth: 110,
  });
  async function okSubmit() {
    const values = await validate();
    const { status, data } = await updateLangSync({
      source: sourcelang.value,
      destination: values.lange,
    });
    if (status) {
      message.success(data);
      closeModal();
    } else {
      message.error(data);
    }
  }
</script>
