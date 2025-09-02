<template>
  <BasicForm @register="registerForm" />
</template>
<script setup lang="ts">
  // import BaseUploadDragger from '/@/components/BaseUploadDragger';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerForm, { validate }] = useForm({
    schemas: [
      //   {
      //     field: 'webLink',
      //     component: 'RadioGroup',
      //     label: 'Web下载链接',
      //     defaultValue: 1,
      //     colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      //     componentProps: {
      //       options: [
      //         { label: '系统默认', value: 1 },
      //         { label: '自定义', value: 2 },
      //       ],
      //     },
      //   },
      {
        field: 'webLink',
        component: 'Input',
        label: t('common.webDownloadUrl'),
        rules: [{ required: true }],
      },
      //   {
      //     field: 'kefuLink',
      //     component: 'Input',
      //     label: '客服地址',
      //     rules: [{ required: true }],
      //   },
      //   {
      //     field: 'appLink',
      //     component: 'RadioGroup',
      //     label: 'APP下载链接',
      //     defaultValue: 1,
      //     colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      //     componentProps: {
      //       options: [
      //         { label: '系统默认', value: 1 },
      //         { label: '自定义', value: 2 },
      //       ],
      //     },
      //   },
      {
        field: 'androidDivider',
        component: 'Divider',
        label: t('common.androidDownloadUrl'),
      },
      {
        field: 'androidFaster',
        component: 'Input',
        label: t('common.SpeedVersion'),
        rules: [{ required: true }],
      },
      {
        field: 'androidNormal',
        component: 'Input',
        label: t('common.normalVersion'),
        rules: [{ required: true }],
      },
      {
        field: 'iosDivider',
        component: 'Divider',
        label: t('common.iosDownloadUrl'),
      },
      {
        field: 'iosFaster',
        component: 'Input',
        label: t('common.SpeedVersion'),
        rules: [{ required: true }],
      },
      {
        field: 'iosNormal',
        component: 'Input',
        label: t('common.normalVersion'),
        rules: [{ required: true }],
      },
      {
        field: 'iosDivider',
        component: 'Divider',
        label: t('common.iosInstallTurial'),
      },
      {
        field: 'appLink',
        component: 'Checkbox',
        defaultValue: 1,
        label: t('common.superSign'),
      },
    ],
    labelCol: { span: 6 },
    baseColProps: { span: 18 },
    actionColOptions: { span: 24 },
    submitButtonOptions: {
      text: t('business.comon_save'),
    },
    showResetButton: false,
    submitFunc: handleSubmit,
  });
  //表单提交
  async function handleSubmit() {
    const data = await validate();
    await fetch(data);
  }
</script>

<style lang="less">
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }
</style>
