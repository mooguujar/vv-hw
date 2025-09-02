<template>
  <div>
    <BasicModal
      :width="800"
      :title="t('table.system.apply_free_certificate')"
      @register="registerCertificateModal"
    >
      <BasicForm @register="registerForm">
        <template #valid>{{ t('common.addTXTType') }} </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const schemas: FormSchema[] = [
    {
      field: '',
      component: 'RadioGroup',
      label: t('common.CertificateType'),
      defaultValue: 1,
      componentProps: {
        options: [
          { label: t('common.SingleDomainCert'), value: 0 },
          { label: t('common.mutiDomainCert'), value: 1 },
        ],
      },
    },
    {
      field: '',
      component: 'Input',
      label: `${t('table.system.system_verify_way')}：`,
      slot: 'valid',
    },
    {
      field: 'dimond',
      component: 'InputTextArea',
      label: `${t('common.domain')}：`,
      componentProps: {
        placeholder: t('common.enterDomain'),
        rows: 5,
      },
    },
  ];
  const [registerCertificateModal] = useModalInner();
  const [registerForm] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 22 },
    labelWidth: 120,
  });
</script>
