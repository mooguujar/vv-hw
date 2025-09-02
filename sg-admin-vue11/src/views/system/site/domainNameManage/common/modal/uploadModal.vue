<template>
  <div>
    <BasicModal :width="800" :title="t('common.addCert')" @register="registerUpload">
      <BasicForm @register="registerForm">
        <template #crt1>
          <BasicUpload
            :emptyHidePreview="true"
            :helpText="t('common.crtNameMustSameAsKeyFile')"
            :multiple="false"
          />
          <span class="m-t-2" style="color: #7f7f7f">{{
            t('common.crtNameMustSameAsKeyFile')
          }}</span>
        </template>
        <template #crt2>
          <BasicUpload
            :emptyHidePreview="true"
            :helpText="t('common.crtNameMustSameAsKeyFile')"
            :multiple="false"
          />
          <span class="m-t-2" style="color: #7f7f7f">{{
            t('common.crtNameMustSameAsKeyFile')
          }}</span>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { BasicUpload } from '/@/components/Upload';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: `${t('common.certName')}：`,
      componentProps: {
        placeholder: t('common.enterCertName'),
      },
    },
    {
      field: 'crt1',
      component: 'Input',
      label: `${t('common.crtFile')}：`,
      slot: 'crt1',
    },
    {
      field: 'crt2',
      component: 'Input',
      label: `${t('common.crtFile')}：`,
      slot: 'crt2',
    },
  ];
  const [registerForm] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 22 },
    labelWidth: 120,
  });
  const [registerUpload] = useModalInner();
</script>
