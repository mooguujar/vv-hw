<template>
  <div>
    <BasicModal
      :title="`${$t('business.code_details')}（${recordData.username}）`"
      width="972px"
      :showOkBtn="false"
      class="Dama-modal"
      @register="registerDeal"
      cancelText=""
    >
      <DamaDetails
        v-if="recordData.uid && showDamaDetails"
        :key="showDamaDetails"
        :uid="recordData.uid"
      />
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import DamaDetails from '/@/components/DamaDetails/index.vue';

  const recordData = ref<any>({});
  const showDamaDetails = ref(false);
  const [registerDeal, { getVisible }] = useModalInner((data) => {
    recordData.value = data;
    showDamaDetails.value = true;
  });

  watch(getVisible, (val) => {
    setTimeout(() => {
      showDamaDetails.value = val;
    }, 200);
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-modal-wrap) {
    border: 1px solid red !important;

    .scrollbar {
      border: 1px solid red !important;
    }
  }

  .Dama-modal {
    border: 1px solid red !important;
  }
</style>
