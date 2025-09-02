<template>
  <PageWrapper :contentStyle="{ margin: 0, marginLeft: '10px' }">
    <abRoundButtonGroup
      class="mt-4 ml-3"
      v-model="tabValue"
      :btn-list="[
        { label: t('table.finance.finance_platform'), value: 'plate' },
        { label: t('table.finance.finance_Way'), value: 'way' },
      ]"
    />
    <payPlateformManagement v-if="tabValue === 'plate'" />
    <paywayManagement v-if="tabValue === 'way'" />
  </PageWrapper>
</template>

<script setup lang="ts" name="PaymentManagementNocash">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import payPlateformManagement from './payPlateformManagement/index.vue';
  import paywayManagement from './paywayManagement/index.vue';
  import { useI18n } from 'vue-i18n';
  import abRoundButtonGroup from '/@/components/abRoundButtonGroup/ab-round-button-group.vue';

  const { t } = useI18n();

  const tabValue = ref<string>('plate');
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table-form-container > form) {
    padding-left: 0 !important;
  }
</style>
