<template>
  <PageWrapper v-loading="loading" :contentStyle="{ margin: '10px' }">
    <div class="bg-white px-4 py-4"> brand setting </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  const loading = ref(false);
</script>

<style lang="less">
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }
</style>
