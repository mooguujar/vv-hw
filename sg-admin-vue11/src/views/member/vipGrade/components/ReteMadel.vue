<template>
  <BasicModal
    :title="t('common.confirmSave')"
    :okText="t('common.VIPLevelConfig')"
    @ok="okFun"
    :width="500"
    @register="RegisterReteMadel"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [RegisterReteMadel] = useModalInner();
  const { getCurrencyList } = useCurrencyStore();
  const schemasForm: FormSchema[] = ref<any>([]);
  defineEmits(['register']);
  const [registerForm, { validate }] = useForm({
    schemas: schemasForm,
    labelWidth: 100,
    showActionButtonGroup: false,
  });
  function createAchieveListItem(item: any) {
    return {
      field: item.name,
      component: 'Input',
      label: item.name,
      required: true,
      colProps: { span: 20 },
      //slot: item.name,
    };
  }
  getCurrencyList.forEach((item) => {
    schemasForm?.value?.push(createAchieveListItem(item));
  });
  async function okFun() {
    const values = await validate();
    if (values) {
    }
  }
</script>
