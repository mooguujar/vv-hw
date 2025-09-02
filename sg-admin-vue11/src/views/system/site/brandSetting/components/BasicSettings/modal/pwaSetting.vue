<template>
  <BasicModal
    :title="t('common.pwa_set')"
    :okText="t('common.confirmSave')"
    :cancelText="t('common.cancelText')"
    @register="register"
    @ok="save"
    wrap-class-name="discount-modal"
    :width="740"
  >
    <BasicForm @register="registerForm" @submit="save" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useForm, BasicForm } from '/@/components/Form';
  import { schemaPwaSetting } from './accessMoneySettingModal.data';

  const FORM_SIZE = useFormSetting().getFormSize as any;
  const { t } = useI18n();
  const emit = defineEmits(['setting-success', 'closeModal']);

  // 注册模态框
  const [register, { closeModal }] = useModalInner((data: any) => {
    if (data) {
      // 如果有数据，填充表单
      setFieldsValue(data);
    }
  });
  const [registerForm, { setFieldsValue, validate }] = useForm({
    schemas: schemaPwaSetting,
    showActionButtonGroup: false,
    size: FORM_SIZE,
  });
  // 保存设置
  async function save() {
    const value = await validate();
    try {
      if (value) {
        if (value.pwaEnabled) {
          if (value.minAmount === undefined) {
            value['minAmount'] = 0;
          }
          if (value.minBalance === undefined) {
            value['minBalance'] = 0;
          }
        }
        if (value.bonusEnabled) {
          if (value.bonusAmount === undefined) {
            value['bonusAmount'] = 0;
          }
          if (value.bonusMultiplier === undefined) {
            value['bonusMultiplier'] = 0;
          }
        }
        emit('setting-success', value);
        closeModal();
      } else {
        console.log('表单验证失败');
      }
    } catch (error) {
      console.log('表单数据校验失败：', error);
    }
  }
</script>

<style lang="less" scoped>
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 0 4px 4px 0 !important;
  }
</style>
