<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="$t('business.common_deal_with')"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
    :width="600"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './HandleModal.data';
  import {
    updateLowList,
    updateHighList,
    updateAssociateDetailList,
    updatewinTopList,
    updatFightList,
  } from '/@/api/risk/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    setup(_, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      let submitApi = ref(null as any);
      const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
        baseColProps: { span: 24 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
        size: FORM_SIZE,
      });
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: any) => {
        await resetFields();
        if (data.risk_code != 'linked_records_batch') setFieldsValue({ id: data.id });
        if (data.risk_code === 'low_multiple_bet') {
          submitApi.value = updateLowList;
        } else if (data.risk_code === 'high_multiple_prizes') {
          submitApi.value = updateHighList;
        } else if (data.risk_code === 'win_top') {
          submitApi.value = updatewinTopList;
        } else if (
          data.risk_code === 'linked_records' ||
          data.risk_code === 'linked_records_batch'
        ) {
          submitApi.value = updateAssociateDetailList;
        } else if (data.risk_code === 'mutual_bet') {
          submitApi.value = updatFightList;
        }
        if (data.risk_code === 'linked_records') {

        }
        if (data.risk_code === 'linked_records_batch') {
          await updateSchema([
            {
              field: 'username',
              show: false,
            },
          ]);
          setFieldsValue({ ids: data.ids });
        } else if (data.risk_code == 'mutual_bet') {
          updateSchema([
            {
              field: 'username',
              show: false,
            },
            {
              field: 'usernames',
              show: true,
              componentProps: {
                options: [
                  { label: data.username_a, value: data.username_a },
                  { label: data.username_b, value: data.username_b },
                ],
              },
            },
          ]);
          setFieldsValue({ usernames: [data.username_a, data.username_b] });
        } else {
          updateSchema({
            field: 'username',
            show: true,
            componentProps: {
              disabled: true,
            },
          });
          setFieldsValue({ username: data.username });
        }
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (values.discount_state) {
            let discount_state = [0, 0, 0]; //Frenk 对此接口有特殊要求
            discount_state.map((item, index, arr) => {
              values.discount_state.map((discount_item) => {
                if (index == discount_item) arr[index] = 1;
              });
            });
            values.discount_state = discount_state;
          }
          const { status, data } = await submitApi.value(values);
          if (status) {
            message.success(data);
            closeModal();
            emit('success');
          } else {
            message.error(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit };
    },
  });
</script>
