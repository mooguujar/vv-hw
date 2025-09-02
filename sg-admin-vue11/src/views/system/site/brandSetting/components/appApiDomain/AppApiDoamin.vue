<template>
  <div class="registerAppApiDomainBox">
    <BasicForm @register="registerRegister" :disabled="isControlValueSet()" @submit="handleSubmit">
      <template #apiLineTitle>
        <div class="display-flex mb-20px mt-10px">
          <div class="mr-2 title-block"></div>
          <h1>{{ t('table.system.system_api_line') }}</h1>
        </div>
      </template>
      <template #VGinstallTitle>
        <div class="display-flex mt-30px mb-20px">
          <div class="mr-2 title-block"></div>
          <h1>{{ t('table.system.system_VGinstall') }}</h1>
        </div>
      </template>
      <template #pwaBackDomainTitle>
        <div class="display-flex mt-30px mb-20px">
          <div class="mr-2 title-block"></div>
          <h1>{{ t('common.pwaDomain_setting') }}</h1>
        </div>
      </template>
    </BasicForm>
    <div class="submit-btn text-center">
      <Button
        type="primary"
        size="large"
        :disabled="isControlValueSet()"
        @click="handleSubmit"
        class="t-form-label-com mt-60px"
      >
        {{ $t('common.saveText') }}
      </Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';

  import { registerSchema } from './base.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { getBrandDetail, updateSiteBrand } from '/@/api/sys';
  import { message, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted } from 'vue';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();

  const FORM_SIZE = useFormSetting().getFormSize;

  const [registerRegister, { validate, setFieldsValue }] = useForm({
    rowProps: {
      gutter: 36, // 设置列之间的间距
    },
    schemas: registerSchema(),
    actionColOptions: { span: 14 },
    size: FORM_SIZE as any,
    showResetButton: false,
    showActionButtonGroup: false,
  });

  const handleSubmit = async () => {
    const value = await validate();
    const content = {
      type: value.apiLine,
      host: value.apiDomain.split('\n'),
      h5_url: value.h5Domain,
      vg_install_domain: value.vgDomain ? value.vgDomain : '',
      vg_install_key: value.vgKey ? value.vgKey : '',
      pwa_back_domain: value.pwaBackDomain ? value.pwaBackDomain.split('\n') : '',
    };
    const params = {
      content: JSON.stringify(content),
      name: 'api_domain',
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  };

  onMounted(async () => {
    const { data } = await getBrandDetail({ tag: 'api_domain' });
    setFieldsValue({
      apiLine: data.type,
      apiDomain: data.host.join('\n'),
      vgDomain: data.vg_install_domain,
      vgKey: data.vg_install_key,
      h5Domain: data.h5_url,
      pwaBackDomain: data.pwa_back_domain.join('\n'),
    });
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  ::v-deep(.ant-checkbox-wrapper-checked) {
    color: #0960bd;
  }

  ::v-deep(.ant-checkbox-wrapper-disabled .ant-checkbox-inner) {
    background-color: rgb(0 0 0 / 25%);
  }

  .registerAppApiDomainBox {
    padding: 20px;
    padding-bottom: 30px;
    border: 1px solid #e1e1e1 !important;
    background-color: #fff;

    h1 {
      margin: 0 !important;
      font-size: 18px !important;
      font-weight: 600;
      line-height: 18px !important;
    }

    ::v-deep(.ant-row) {
      .ant-row {
        margin-bottom: 0 !important;
      }

      .ant-form-item {
        .ant-form-item-label {
          margin-bottom: 20px;
        }
      }
    }

    .title-block {
      width: 6px !important;
      height: 15px !important;
      margin-top: 2px;
      background-color: #1475e1 !important;
    }

    .submit-btn {
      width: 100%;
      margin: auto;
      float: left;

      button {
        min-width: 240px;
      }
    }
  }
</style>
