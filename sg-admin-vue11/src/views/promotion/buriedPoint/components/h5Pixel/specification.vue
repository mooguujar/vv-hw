<template>
<!--  <div class="!ml-3 !mb-2">-->
<!--    <div class="gtag_gtm_box_title">-->
<!--      <span>TikTok Pixel简易教程仅供参考 </span><span class="gtag_gtm_box_title_sm">具体操作以Google平台为准</span>-->
<!--    </div>-->
<!--  </div>-->
  <div class="gtag_gtm_box !ml-3 !mb-3">
    <div class="gtag_gtm_box_item">
      <p><span class="step">{{$t('table.promotion.promotion_step_h5')}}</span></p>
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
  /*width: 86vw;*/
  border: 2px dashed #585858!important;
  padding: 12px;
  display: flex;
}
.gtag_gtm_box_title {
  font-family: 'PingFang SC';
  font-weight: 500;
  font-style: normal;
  font-size: 18px;
  color: #444444;
}
.gtag_gtm_box_title_sm {
  font-size: 14px;
  font-weight: 400;
  color: #444444;
}
.gtag_gtm_box_item {
p {
  font-size: 12px;
  margin-bottom: 0;
}
span {
  font-family: "PingFang SC";
  font-weight: 500;
  font-size: 14px;
}
.step {
  font-family: "PingFang SC";
  font-weight: 600;
  font-size: 18px;
  color: #444444;
}
}
</style>
