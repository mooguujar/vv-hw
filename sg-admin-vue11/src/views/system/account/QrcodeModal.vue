<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="closeModal">
    <template #footer>
      <a-button type="primary" @click="closeModal">{{ t('business.common_off') }}</a-button>
    </template>
    <div class="mx-auto w-200px">
      <QrCode :value="qrCodeUrl" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const qrCodeUrl = ref('');

  export default defineComponent({
    components: { BasicModal, QrCode },
    setup() {
      const getTitle = t('common.VerificationCode');

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
      });
      return {
        registerModal,
        closeModal,
        qrCodeUrl,
        getTitle,
        t,
      };
    },
  });
</script>

<style></style>
