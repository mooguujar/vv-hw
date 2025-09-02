<template>
  <div @click="handleChange">
    <Input v-model:value="selectValues" style="width: 80px" readonly class="cursor" />
    <AppRateModal @register="registerRateModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Input } from 'ant-design-vue';
  import AppRateModal from './AppRateModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useFinanceStore } from '/@/store/modules/finance';
  import {useI18n} from "@/hooks/web/useI18n";

  const { t } = useI18n();
  const selectValues = ref(t('business.common_current_rate'));

  const [registerRateModal, { openModal: openRateModal }] = useModal();
  const financeStore = useFinanceStore();

  const handleChange = async () => {
    openRateModal(true, financeStore.getRateObject);
  };
</script>
