<template>
  <BasicModal
    v-bind="$attrs"
    :centered="true"
    :canFullscreen="false"
    :minHeight="1"
    title="温馨提示"
    cancelText="取消"
    okText="确定"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <p class="p-2">{{ hintContent }}</p>
    <!-- <BasicForm v-if="!isActivate" @register="registerForm" /> -->
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SaveDepositCardParams } from '/@/api/model/financeModel';
  // import { updateDepositCard } from '/@/api/finance/index';

  export default defineComponent({
    name: 'ActivateCardModal',
    components: { BasicModal, BasicForm },
    emits: ['reload', 'register'],
    setup(_, context) {
      const isActivate = ref<number>(0);
      const modalType = ref<number>(0);
      const record = ref<Recordable>({});

      const { createMessage } = useMessage();

      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 80,
        baseColProps: { span: 24 },
        schemas: [
          {
            field: 'remark',
            label: '备注',
            rules: [{ required: true }],
            component: 'InputTextArea',
          },
        ],
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async (data: { record: Recordable; activate: number; modalType: number }) => {
          resetFields();
          modalType.value = data.modalType;
          isActivate.value = data.activate;
          record.value = data.record;
          setModalProps({ confirmLoading: false });
        },
      );

      const titleContent = computed(() => (modalType.value ? 'USDT地址' : '银行卡')); // todo 未使用

      const hintContent = computed(() =>
        isActivate.value
          ? `您确定开启该${titleContent.value}吗？`
          : `您确定停用该${titleContent.value}吗？`,
      );

      async function handleSubmit(): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });
          let payload: SaveDepositCardParams;
          if (isActivate.value) {
            payload = {
              id: record.value.id,
              state: isActivate.value,
            };
          } else {
            payload = {
              id: record.value.id,
              state: isActivate.value,
            };
          }
          // const response = await updateDepositCard(payload);
          // if (response.code === '200') {
          //   createMessage.success('修改成功');
          //   context.emit('reload');
          // } else {
          //   createMessage.error(response.text);
          // }
          closeModal();
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        isActivate,
        hintContent,
        registerForm,
        registerModal,
        handleSubmit,
      };
    },
  });
</script>
