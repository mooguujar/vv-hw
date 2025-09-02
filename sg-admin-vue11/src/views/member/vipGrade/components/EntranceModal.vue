<template>
  <BasicModal
    :title="$t('table.discountActivity.activiy_status')"
    :okText="$t('table.system.system_conform_save')"
    @ok="handleSubmit"
    :width="520"
    :minHeight="100"
    @register="registerBasicModal"
    :showCancelBtn="false"
  >
    <BasicForm
      @register="registerForm"
      :schemas="schemasEntrance"
      layout="horizontal"
      :showActionButtonGroup="false"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, inject, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemasEntrance } from './VipConfiguration.data';

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
      entrance: initData.value.filter((p) => p.ty === 9 && p.key === 'show')[0].value,
    });
  });
  async function handleSubmit() {
    const values = await validate();
    let params = [
      {
        ...initData.value.filter((p) => p.ty === 9)[0],
        value: values.entrance,
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
