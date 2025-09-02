<template>
  <div>
    <BasicModal
      :title="`${$t('business.common_edit')}`"
      width="500px"
      @register="registerDeal"
      :okText="t('table.system.system_conform_edite')"
      @ok="handleSubmit"
      :destroyOnClose="true"
      cancelText=""
    >
      <BasicForm @register="registerNewTask" />
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';
  import { clearwithdrawAmount } from '/@/api/finance';

  const FORM_SIZE = useFormSetting().getFormSize;
  const result: any = ref({});
  const [registerDeal, { closeModal }] = useModalInner((data) => {
    result.value = data.data;
    setFieldsValue({ target_amount: data.data.need_bet_amount });
  });
  const { t } = useI18n();

  const emits = defineEmits(['success']);

  const [registerNewTask, { setFieldsValue, validate }] = useForm({
    schemas: [
      {
        field: 'target_amount',
        component: 'Input',
        label: t('common.target_amount'),
        labelWidth: 200,
        colProps: {
          span: 24,
        },
        dynamicDisabled: true,
      },
      {
        field: 'amount',
        component: 'Input',
        label: t('common.target_amount_new'),
        labelWidth: 200,
        colProps: {
          span: 24,
        },
      },
    ],
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: { span: 24 },
    size: FORM_SIZE as any,
  });
  async function handleSubmit() {
    const values = await validate();

    const params = {
      uid: result?.value?.uid, // 用户 uid
      currency_id: result?.value?.currency_id, // 货币 id
      amount: values.amount,
      target_amount: '1',
    };

    const { data, status } = await clearwithdrawAmount(params);
    if (status) {
      closeModal();
      emits('success');
    } else {
      message.error(data);
    }
  }
</script>
