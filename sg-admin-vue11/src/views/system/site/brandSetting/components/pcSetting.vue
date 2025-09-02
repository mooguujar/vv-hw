<template>
  <!-- <PcHomeLoad
    :pcLogData="detailInfo.home_page_loading"
    :type="'white'"
    :id="props.id"
    :width="397"
    :height="148"
  /> -->
  <pcLoginBefore
    :pcLogData="detailInfo.pc_logo_white"
    :type="'white'"
    :id="props.id"
    :width="397"
    :height="148"
  />
  <PcLoginAfter
    :pcLogData="detailInfo.pc_logo_white_after_login"
    :type="'white'"
    :id="props.id"
    :width="397"
    :height="148"
  />
  <!--  UI图里没有灰色的了-->
  <!--  <PcLogDragger-->
  <!--    :pcLogData="detailInfo.pc_logo_gray"-->
  <!--    :type="'gray'"-->
  <!--    :id="props.id"-->
  <!--    :width="209"-->
  <!--    :height="78"-->
  <!--  />-->

  <PcLogDragger
    :pcLogData="detailInfo.pc_first_letter"
    :type="'shrink'"
    :id="props.id"
    :width="100"
    :height="100"
  />

  <WebIconDragger :iconData="detailInfo.pc_icon" :id="props.id" />

  <!-- <WebLoadingDragger :loadingData="detailInfo.loading" /> -->
  <LeadDragger :leadData="detailInfo.pc_lead" :id="props.id" />

  <Appdown :leadData="detailInfo.home_app_download" :id="props.id" />

  <FooterAppdown :leadData="detailInfo.bottom_app_download" :id="props.id" />
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  //pcHomeLoad
  import PcHomeLoad from '../components/PcSettings/pcHomeLoad.vue';
  import PcLoginAfter from '../components/PcSettings/pcLoginAfter.vue';
  import pcLoginBefore from '../components/PcSettings/pcLoginBefore.vue';
  import PcLogDragger from '../components/PcSettings/pcLogDragger.vue';
  import WebIconDragger from '../components/PcSettings/webIconDragger.vue';
  import LeadDragger from '../components/appSetting/LeadDragger.vue';
  import Appdown from './appSetting/Appdown.vue';
  import FooterAppdown from './appSetting/FooterAppdown.vue';
  // import WebLoadingDragger from '../components/PcSettings/webLoadingDragger.vue';
  import { getSiteBrandDetail } from '/@/api/sys';

  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });

  const detailInfo = ref({});

  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    detailInfo.value = data;
  };
  onMounted(() => {
    GetSiteBrandDetail({ tag: 'pc' });
  });
</script>

<style lang="less" scoped>
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }
</style>
