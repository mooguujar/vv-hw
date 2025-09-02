<template>
  <Card class="bannerCard toAddBanner" @click="toAddBanner">
    <div>
      <div class="bannerCardAdd"></div>
      <div class="bannerCardSize">{{ getBannerWidth(currentTpl, 'w*h') }}</div>
    </div>
  </Card>
</template>
<script lang="ts" setup>
  import { Card } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { getBannerWidth } from '/@/views/common/common';
  import { computed } from 'vue';

  const router = useRouter();
  const userStore = useUserStore();

  const props = defineProps({
    bannerType: { type: Number, default: () => 1 },
  });

  const toAddBanner = () => {
    router.push({ name: 'AddCarouseForm', query: { bannerType: props.bannerType } });
  };

  const currentTpl = computed(() => {
    return userStore.getCurrentSite['tpl'] || 1;
  });
</script>

<style lang="less" scoped>
  .bannerCard {
    width: 418px;
    height: 312px;
    margin-right: 20px;
    margin-bottom: 20px;
    float: left;
    border-radius: 4px;
  }

  .toAddBanner {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #e1e1e1;
    background-color: #f6f9ff !important;
    cursor: pointer;

    div {
      text-align: center;
    }
  }

  .toAddBanner:hover {
    border: 1px dashed rgb(64 158 255 / 100%) !important;
  }

  ::v-deep(.ant-card-body > div) {
    margin: auto;
  }

  .bannerCardAdd {
    width: 40px;
    height: 40px;
    //margin-left: calc(50% - 25px);
    margin: auto;
    background-image: url('/@/assets/images/bannerbg/add_banner.webp');
    background-repeat: no-repeat;
    background-size: 100%;
    color: #7f7f7f;
    text-align: center;
  }

  .bannerCardSize {
    margin-top: 10px;
    color: #444;
    font-family: 'PingFang SC';
    font-size: 12px;
  }
</style>
