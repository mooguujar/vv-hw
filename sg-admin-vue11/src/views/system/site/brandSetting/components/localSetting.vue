<template>
  <H5limit :mobileDetailInfo="detailInfo.mobile" :id="props.id" />
  <Pclimit :pcDetailInfo="detailInfo.pc" :id="props.id" />
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import H5limit from '../components/LocalSetting/h5limit.vue';
  import Pclimit from '../components/LocalSetting/pclimit.vue';
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
    GetSiteBrandDetail({ tag: 'area' });
  });
</script>

<style lang="less" scoped>
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }
</style>
