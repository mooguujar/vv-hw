<template>
  <div class="box">
    <div>
      <img src="/@/assets/webp/404.webp" alt="" />
      <p>{{ t('routes.basic.errorNoData') }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { unref } from 'vue';
  import {useI18n} from "@/hooks/web/useI18n";

  const permissionStore = usePermissionStoreWithOut();
  const routers = permissionStore.getFrontMenuList;
  const router = useRouter();
  const { currentRoute } = useRouter();
  const { t } = useI18n();

  if (routers.length > 1 && unref(currentRoute).path != '/error/noData') {
    const itemRoute = routers.filter((item: any) => item.path != '/:path(.*)*');
    if (itemRoute && itemRoute.length > 0) {
      router.push({ path: itemRoute[0]?.redirect });
    }
  }
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
