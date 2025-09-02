<template>
  <div class="!ml-3 !mb-2">
    <div class="gtag_gtm_box_title">
      <span>TikTok Pixel {{ $t('table.promotion.promotion_ez') }}</span
      ><span class="gtag_gtm_box_title_sm ml5">
        {{ $t('table.promotion.tiktok_real_operation') }}</span
      >
    </div>
  </div>
  <div class="gtag_gtm_box !mb-3 ml-4px">
    <div class="gtag_gtm_box_item">
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 1：{{
            $t('table.promotion.tiktok_step1_title_1')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 2：{{
            $t('table.promotion.tiktok_step2_title_2')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 3：{{
            $t('table.promotion.tiktok_step3_title_3')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 4：{{
            $t('table.promotion.tiktok_step4_title_4')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 5：{{
            $t('table.promotion.tiktok_step5_title_5')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 6：{{
            $t('table.promotion.tiktok_step6_title_6')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 7：{{
            $t('table.promotion.tiktok_step7_title_7')
          }}</span
        ></p
      >
      <p
        ><span class="step"
          >{{ $t('table.promotion.promotion_step') }} 8：{{
            $t('table.promotion.tiktok_step8_title_8')
          }}</span
        ></p
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    tabValue: {
      type: String,
    },
  });
</script>
<style scoped>
  .gtag_gtm_box {
    display: flex;
    padding: 12px;

    /* width: 86vw; */
    border: 2px dashed #585858 !important;
  }

  .gtag_gtm_box_title {
    color: #444;
    font-family: 'PingFang SC';
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
  }

  .gtag_gtm_box_title_sm {
    color: #444;
    font-size: 14px;
    font-weight: 400;
  }

  .gtag_gtm_box_item {
    p {
      margin-bottom: 0;
      font-size: 12px;
    }

    span {
      font-family: 'PingFang SC';
      font-size: 14px;
      font-weight: 500;
    }

    .step {
      color: #444;
      font-family: 'PingFang SC';
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>
