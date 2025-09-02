<template>
  <div class="ml-4px !mb-2">
    <div class="gtag_gtm_box_title" v-if="tabValue === 'gtag'">
      <span>GTAG {{$t('table.promotion.promotion_ez')}} </span><span class="gtag_gtm_box_title_sm ml5"> {{$t('table.promotion.promotion_real_operation')}}</span>
    </div>
    <div class="gtag_gtm_box_title" v-if="tabValue === 'gtm'">
      <span>GTM {{$t('table.promotion.promotion_ez')}} </span><span class="gtag_gtm_box_title_sm ml5"> {{$t('table.promotion.promotion_real_operation')}}</span>
    </div>
  </div>
  <div class="gtag_gtm_box !mb-3 ml-4px">
    <div class="gtag_gtm_box_item" v-if="tabValue === 'gtag'">
      <p><span class="step">{{$t('table.promotion.promotion_step')}}1：{{$t('table.promotion.promotion_step1_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_1_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_1_2')}}</span></p>
      <p><span><br /></span></p>
      <p><span class="step">{{$t('table.promotion.promotion_step')}}2：{{$t('table.promotion.promotion_step2_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_2_1_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_2_1_2')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_2_1_3')}}</span></p>
      <p><span><br /></span></p>
      <p><span>{{$t('table.promotion.promotion_2_2')}}</span></p>
      <p><span>&lt;script&gt;</span></p>
      <p><span>&nbsp; window.dataLayer = window.dataLayer || [];</span></p>
      <p><span>&nbsp; function gtag(){dataLayer.push(arguments);}</span></p>
      <p><span>&nbsp; gtag('js', new Date());</span></p>
      <p><span>&nbsp; gtag('config', 'YOUR_GA_TRACKING_ID');</span></p>
      <p><span>&lt;/script&gt;</span></p>
      <p><span><br /></span></p>
      <p><span class="step">{{$t('table.promotion.promotion_step')}} 3：{{$t('table.promotion.promotion_step3_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_3_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_3_2')}}</span></p>
      <p><span><br /></span></p>
    </div>
    <div class="gtag_gtm_box_item" v-if="tabValue === 'gtm'">
      <p><span class="step">{{$t('table.promotion.promotion_step')}} 1：{{$t('table.promotion.promotion_step1_GTM_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step1_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step1_2')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step1_3')}}</span></p>
      <p><span><br /></span></p>
      <p><span class="step">{{$t('table.promotion.promotion_step')}} 2：{{$t('table.promotion.promotion_step2_GTM_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step2_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step2_2')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step2_3')}}</span></p>
      <p><span><br /></span></p>
      <p><span class="step">{{$t('table.promotion.promotion_step')}} 3：{{$t('table.promotion.promotion_step3_GTM_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_2')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_3')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_4')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_5')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_6')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step3_7')}}</span></p>
      <p><span><br /></span></p>
      <p><span class="step">{{$t('table.promotion.promotion_step')}} 4：{{$t('table.promotion.promotion_step4_GTM_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step4_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step4_2')}}</span></p>
      <p><span><br /></span></p>
      <p><span class="step">{{$t('table.promotion.promotion_step')}} 5：{{$t('table.promotion.promotion_step5_GTM_title')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step5_1')}}</span></p>
      <p><span>{{$t('table.promotion.promotion_step5_2')}}</span></p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
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
