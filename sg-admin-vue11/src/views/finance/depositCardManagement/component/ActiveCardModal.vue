<template>
  <BasicModal
    v-bind="$attrs"
    :centered="true"
    :canFullscreen="false"
    :minHeight="1"
    :title="$t('common.friendly_reminder')"
    :cancelText="$t('common.cancelText')"
    :okText="$t('common.okText')"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <p class="p-2">{{ hintContent }}</p>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SaveDepositCardParams } from '/@/api/model/financeModel';
  import { stateBankcardList } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'ActivateCardModal',
    components: { BasicModal },
    emits: ['reload', 'register'],
    setup(_, context) {
      const isActivate = ref<number>(0);
      const modalType = ref<number>(0);
      const currencyId = ref<any>(0);
      const depositCardData = ref<Recordable>({});
      const { createMessage } = useMessage();

      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 80,
        baseColProps: { span: 24 },
        schemas: [
          {
            field: 'remark',
            label: t('table.system.remark'),
            rules: [{ required: true }],
            component: 'InputTextArea',
          },
        ],
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async (data: {
          record: Recordable;
          activate: number;
          modalType: number;
          currencyId: string;
        }) => {
          modalType.value = data.modalType;
          isActivate.value = data.activate;
          depositCardData.value = data.record;
          currencyId.value = data.currencyId;
          setModalProps({ confirmLoading: false });
        },
      );

      const titleContent = computed(() =>
        modalType.value ? t('business.common_address') : t('business.common_account'),
      );

      const hintContent = computed(() =>
        isActivate.value == 1
          ? `${t('modalForm.system.system_to_deactivate_tip')}${t('business.common_collection')}${
              titleContent.value
            }${t('modalForm.system.system_qus_tip')}?`
          : `${t('modalForm.system.system_to_deactivate_tip')}${t('business.common_collection')}${
              titleContent.value
            }${t('modalForm.system.system_qus_tip')}?`,
      );

      async function handleSubmit(): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });
          let payload: SaveDepositCardParams;
          if (isActivate.value) {
            payload = {
              id: depositCardData.value.id,
              state: isActivate.value,
              currency_id: currencyId.value,
            };
          } else {
            payload = {
              id: depositCardData.value.id,
              state: isActivate.value,
              currency_id: currencyId.value,
            };
          }
          const { status, data } = await stateBankcardList(payload);
          if (status) {
            createMessage.success(data);
            context.emit('reload');
          } else {
            createMessage.error(data);
          }
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
