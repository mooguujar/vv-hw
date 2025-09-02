<template>
  <BasicModal
    :title="$t('common.delivery_time')"
    :okText="$t('table.system.system_conform_save')"
    @ok="handleSubmit"
    :width="520"
    :minHeight="100"
    @register="registerBasicModal"
    :showCancelBtn="false"
  >
    <BasicForm
      @register="registerForm"
      :schemas="schemasDeliveryTime"
      layout="horizontal"
      :showActionButtonGroup="false"
      :size="FORM_SIZE"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, inject, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemasDeliveryTime } from './VipConfiguration.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  const FORM_SIZE = useFormSetting().getFormSize;
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
      // 奖金派送开关  晋级礼金
      dispatchTime818: initData.value.filter((p) => p.ty === 14 && p.key === '818')[0].value,
      // 奖金派送开关  日红包
      dispatchTime819: initData.value.filter((p) => p.ty === 14 && p.key === '819')[0].value,
      // 奖金派送开关  周红包
      dispatchTime820: initData.value.filter((p) => p.ty === 14 && p.key === '820')[0].value,
      // 奖金派送开关  月红包
      dispatchTime821: initData.value.filter((p) => p.ty === 14 && p.key === '821')[0].value,
    });
  });
  async function handleSubmit() {
    const values = await validate();
    let params = [
      {
        ...initData.value.filter((p) => p.ty === 14 && p.key === '818')[0],
        value: values.dispatchTime818,
      },
      {
        ...initData.value.filter((p) => p.ty === 14 && p.key === '819')[0],
        value: values.dispatchTime819,
      },
      {
        ...initData.value.filter((p) => p.ty === 14 && p.key === '820')[0],
        value: values.dispatchTime820,
      },
      {
        ...initData.value.filter((p) => p.ty === 14 && p.key === '821')[0],
        value: values.dispatchTime821,
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
