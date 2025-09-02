<template>
  <div>
    <BasicModal
      :title="t('common.mutiTitleEdit', [modalTitle])"
      @register="registerModal"
      @ok="submitFun"
      :closeFunc="closeFun"
    >
      <BasicForm :size="FORM_SIZE" :schemas="schemas" @register="registerFormInner" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emit = defineEmits(['closeFunEmit']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const modalTitle = ref();
  const schemas = ref([] as any);
  const [registerModal] = useModalInner((data) => {
    modalTitle.value = data[0].name;
    const dataList = data.map((item) => {
      return {
        field: 'rate' + item.currency_id,
        component: 'InputNumber',
        label: t('XXrebate', [currentyOptions[item.currency_id]]),
        required: true,
      };
    });
    schemas.value = dataList;
  });
  const [registerFormInner, { validate }] = useForm({
    showActionButtonGroup: false,
    labelWidth: 120,
    baseColProps: { span: 20 },
  });
  function closeFun() {
    schemas.value = [];
    emit('closeFunEmit');
    return true;
  }
  async function submitFun() {
    const values = await validate();
  }
</script>
