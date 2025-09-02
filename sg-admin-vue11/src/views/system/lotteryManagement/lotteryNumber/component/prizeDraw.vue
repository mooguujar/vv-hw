<template>
  <template>
    <div>
      <BasicModal
        :okText="t('common.confirmSave')"
        :title="title"
        @register="registerModel"
        :minHeight="100"
        @ok="okFun"
        cancelText=""
        wrapClassName="footer-not-hr"
      >
        <BasicForm @register="regiserForm"></BasicForm>
      </BasicModal>
    </div>
  </template>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  // import { updateCommissionConfigV1 } from '/@/api/site/defaultManagement';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const id = ref('' as string);
  const ty = ref('' as string);
  const title = ref('' as string);
  const FORM_SIZE = useFormSetting().getFormSize;
  const bonus_limit = ref('' as string);

  const props = defineProps({
    gamesData: {
      type: Object,
      default: () => {},
    },
  });
  const emit = defineEmits(['closeLoad', 'register']);

  const schemas: FormSchema[] = [
    {
      field: 'bonus_limit',
      component: 'Input',
      label: ' ',
      componentProps: {
        placeholder: t('common.inputText'),
      },
    },
  ];
  const [registerModel, { closeModal }] = useModalInner((data) => {
    id.value = data.id;
    bonus_limit.value = data.bonus_limit;
    title.value = t('common.cp10', '111');
  });
  const [regiserForm, { getFieldsValue, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: {
      span: 20,
    },
    size: FORM_SIZE,
  });

  async function okFun() {
    let obj = {
      id: id.value,
    };
    // await updateCommissionConfigV1(obj);
    emit('closeLoad', ['mode', 'platform'].includes(ty.value));
    await resetFields();
    await closeModal();
    bonus_limit.value = '';
  }
</script>
<style lang="scss" scoped></style>
