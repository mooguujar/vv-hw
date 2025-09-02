<template>
  <div>
    <AddBannerFrom :isEdit="false" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import AddBannerFrom from './component/addBanner.vue';

  export default defineComponent({
    name: 'AddCarouseForm',
    components: {
      PageWrapper,
      AddBannerFrom,
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header) {
    background-color: transparent;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  ::v-deep(.ant-page-header-heading-left) {
    margin-top: 0;
    margin-bottom: 0;

    .ant-page-header-heading-title {
      color: #444;
      font-size: 18px;
      font-size: 500;
      line-height: 18px;
    }

    .ant-page-header-heading-title::before {
      content: ' ';
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-top: -2px;
      margin-right: 8px;
      background: no-repeat;
      background-image: url('/@/assets/images/active-add.webp');
      background-position: center;
      background-size: 100%;
      vertical-align: middle;
    }
  }
</style>
