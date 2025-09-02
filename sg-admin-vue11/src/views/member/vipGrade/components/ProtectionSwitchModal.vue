<template>
  <BasicModal
    :title="$t('common.protection_switch')"
    :okText="$t('table.system.system_conform_save')"
    @ok="handleSubmit"
    :width="520"
    :minHeight="100"
    @register="registerBasicModal"
    :showCancelBtn="false"
  >
    <BasicForm
      @register="registerForm"
      :schemas="schemasProtectionSwitch"
      layout="horizontal"
      :showActionButtonGroup="false"
    />
    <p class="text-red ml-6px">*{{ $t('common.vip_relegation') }}</p>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, inject, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemasProtectionSwitch } from './VipConfiguration.data';

  const getData = inject<Function>('getData');
  const setData = inject<Function>('setData');
  const initData = computed(() => getData());
  const [
    registerForm,
    {
      validate: validate,
      setFieldsValue: setFieldsValue,
      // getFieldsValue: getFieldsValue,
    },
  ] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    colon: true,
    labelAlign: 'right',
    showActionButtonGroup: false,
  });

  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    setFieldsValue({
      protectionSwitch: initData.value.filter((p) => p.ty === 15 && p.key === 'keep')[0].value,
    });
  });
  async function handleSubmit() {
    const values = await validate();
    let params = [
      {
        ...initData.value.filter((p) => p.ty === 15)[0],
        value: values.protectionSwitch,
      },
    ];
    setData(params);
    closeModal();
  }
</script>
<style scoped lang="less">
  .ant-form-item-label > label,
  .text-horizon-center {
    height: 40px;
    line-height: 40px;
  }
</style>
