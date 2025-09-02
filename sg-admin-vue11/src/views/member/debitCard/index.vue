<template>
  <PageWrapper :contentStyle="{ margin: 0, marginLeft: '10px' }">
    <abRoundButtonGroup
      class="mt-4 ml-3"
      v-model="tabValue"
      :btn-list="[
        { label: $t('business.Fiat_currency'), value: 'BankCard' },
        { label: $t('business.cryptocurrency_currency'), value: 'UsdtCoin' },
      ]"
    />
    <BankCard v-if="tabValue === 'BankCard'" />
    <UsdtCoin v-if="tabValue === 'UsdtCoin'" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import BankCard from './component/bankCard/index.vue';
  import UsdtCoin from './component/digitalCurrency/index.vue';
  import abRoundButtonGroup from '/@/components/abRoundButtonGroup/ab-round-button-group.vue';

  const tabValue = ref<string>('BankCard');

  defineEmits(['editSucess']);
</script>

<style lang="less" scoped>
  .bg-white .card-line ::v-deep('.ant-tabs-nav') {
    padding-left: 10px;
  }

  ::v-deep(.vben-basic-table .ant-table-wrapper) {
    padding: 0;
  }

  ::v-deep(.vben-basic-table-form-container) {
    padding: 0;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding-left: 0;
  }
</style>
