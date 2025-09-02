<template>
  <div ref="main" class="venuesClassZoom">
    <BasicModal
      @register="registerNewAddModal"
      :title="title"
      v-bind="$attrs"
      @ok="okSubmit"
      :width="560"
      :okText="t('table.discountActivity.promotion_alternate_domain_name')"
      cancelText=""
      :footer="null"
      :getContainer="() => $refs.main"
    >
      <BasicForm @register="registerFromNewAdd" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineEmits, ref } from 'vue';

  const { t } = useI18n();
  const emit = defineEmits(['activeSuccess', 'register']);

  const title = ref('');

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('table.race_price.form_ad_name'),
      defaultValue: '',
      required: true,
      componentProps: {
        size: 'large',
        allowClear: false,
        disabled: true,
      },
    },
    {
      field: 'backup_domain',
      component: 'InputTextArea',
      label: t('table.race_price.form_ad_romain'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
        disabled: true,
        autosize: {
          minRows: 4,
          maxRows: 4,
        },
      },
    },
  ];
  const [registerNewAddModal] = useModalInner(async (data) => {
    title.value = t('table.race_price.form_ad_romain');
    if (data.backup_domain_cnt) title.value = `${title.value} (${data.backup_domain_cnt})`;
    setFieldsValue({ name: data.name, backup_domain: data.backup_domain.replace(/,/g, '\n') });
  });

  const [registerFromNewAdd, { validate, setFieldsValue }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 'auto',
    baseColProps: { span: 24 },
  });

  async function okSubmit() {
    const values = await validate();
  }
</script>
<style lang="scss" scoped>
  .newAddPrice {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      width: 86px;
      height: auto !important;
      margin-right: 5px;
      line-height: 40px !important;
    }

    ::v-deep(.ant-modal-footer) {
      padding: 20px 16px;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 72px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 290px;
    }
  }

  .line {
    width: 80%;
    height: 1.5px;
    margin-top: 20px;
    margin-left: 10%;
    background-color: #4444;
    font-size: 14px;
    font-weight: 500;
  }
</style>
