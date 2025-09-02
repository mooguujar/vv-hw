<template>
  <BasicModal
    :centered="true"
    :minHeight="250"
    :maxHeight="550"
    :title="$t('table.system.system_adapt_feedbook')"
    @register="registerModal"
    :showCancelBtn="false"
    :showOkBtn="false"
    :closeFunc="closeFunc"
    :titleIcon="props.titleicon"
  />
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Recordable } from '@/views/system/informationCenter/customerFeedback/components/Model.data';

  const emit = defineEmits(['reload', 'register', 'closeModelAdopt']);
  const props = defineProps<{
    titleicon: string;
  }>();
  const [registerModal, { setModalProps, closeModal }] = useModalInner(
    async (data: { response: Recordable; reply: number }) => {
    },
  );

  function closeFunc() {
    emit('closeModelAdopt');
    return true;
  }
</script>
