<template>
  <div class="box">
    <div>
      <img src="/@/assets/webp/404.webp" alt="" />
      <p>{{ t('routes.basic.errorNoData') }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
</script>
<style lang="scss" scoped>
  .box {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      // width: 792px;
      // height: 500px;
      margin: 0 auto;
    }

    p {
      color: #444;
      font-size: 20px;
      text-align: center;
    }
  }
</style>
