<template>
  <div class="speakConfigClass venuesClassZoom" ref="main">
    <BasicModal
      :bodyStyle="{ height: '80px' }"
      @register="registerSpeakConfigModal"
      :title="t('table.system.system_speech_conf')"
      v-bind="$attrs"
      @ok="configSubmit"
      :width="580"
      :okText="t('modalForm.finance.common_income.submit')"
      cancelText=""
      :getContainer="() => $refs.main"
    >
      <BasicForm @register="registerFromConfig">
        <template #minimumMoney>
          <Input
            v-model:value="miniAmount"
            :placeholder="t('table.system.system_null_0_no_limit')"
            :size="'large'"
          >
            <template #addonAfter
              ><cdIconCurrency class="mb-1 w-14px mx-2px" :icon="'USDT'" />USDT
            </template>
          </Input>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Input, message } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { speakAmount } from '/@/api/site';
  import { ref } from 'vue';
  import { useLocaleStoreWithOut } from '@/store/modules/locale';

  const { t } = useI18n();
  const emit = defineEmits(['activeSuccess']);
  const miniAmount = ref('');
  const schemas: FormSchema[] = [
    {
      field: 'minimumMoney',
      component: 'Input',
      label: t('table.system.system_min_m') + ':',
      defaultValue: '',
      slot: 'minimumMoney',
      componentProps: () => {},
    },
  ];
  const [registerSpeakConfigModal, { closeModal, setModalProps }] = useModalInner(async (data) => {
    if (data == 0) {
      miniAmount.value = '';
    } else {
      miniAmount.value = data;
    }
  });
  const currentLanguage = useLocaleStoreWithOut();
  const styleWidth = () => {
    switch (currentLanguage.getLocale) {
      case 'zh_CN':
        return 85;
      case 'en_US':
        return 220; // 修改为返回 'auto' 而不是 120
      case 'vi_VN':
        return 140;
      case 'pt_BR':
        return 130;
      default:
        return 85;
    }
  };
  const [registerFromConfig, { validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: String(styleWidth),
    baseColProps: { span: 24 },
  });

  async function configSubmit() {
    const values = await validate();
    values['amount'] = Number(miniAmount.value);
    delete values['minimumMoney'];
    const { status, data } = await speakAmount(values);
    if (status) {
      closeModal();
      resetFields();
      message.success(t(`sys.api.operationSuccess`));
      emit('activeSuccess');
      setModalProps({ confirmLoading: false });
    } else {
      message.error(t(`sys.api.operationFailed`));
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="scss" scoped>
  .speakConfigClass {
    ::v-deep(.ant-modal-body .scroll-container .scrollbar__wrap) {
      overflow-y: hidden;
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.scrollbar__thumb) {
      display: none;
    }

    ::v-deep(.scrollbar__bar.is-vertical) {
      display: none;
    }

    ::v-deep(.ant-input-group-addon) {
      background-color: #dce3f1;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      width: v-bind(stylewidth + 'px');
      height: auto !important;
      margin-right: 5px;
      line-height: 32px !important;
    }

    ::v-deep(.ant-modal-footer) {
      padding: 20px 16px;
    }
  }
</style>
