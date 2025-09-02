<template>
  <div class="anticon" :class="getAppLogoClass">
    <div class="header_logo" @click="toggleCollapsed">
      <div class="header_logo_bar"></div>
      <div class="header_logo_bar"></div>
      <div class="header_logo_bar"></div>
    </div>
    <!--    <img class="header_logo" src="../../../assets/images/header_logo.webp"  @click="toggleCollapsed"/>-->
    <div @click="openSiteDrawer" class="header-Drawer">
      <div class="ml-2 truncate logo_content" :class="getTitleClass" v-show="showTitle">
        {{ current_site }}
      </div>
    </div>
    <!--    <DownOutlined class="ml-3" :style="{ fontSize: 30 }" v-if="showDraw" />-->
    <AppSiteDrawer
      v-if="showDraw"
      placement="top"
      height="676px"
      width="931px"
      @register="register"
    />
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  // import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getSiteList } from '/@/utils/auth';
  // import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useDrawer } from '/@/components/Drawer';
  import AppSiteDrawer from './AppSiteDrawer.vue';
  import { isControlValueSet } from '/@/utils/domUtils';

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },

    showDraw: { type: Boolean, default: true },
  });

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle, toggleCollapsed } = useMenuSetting();
  const { title } = useGlobSetting();
  let list = ref<any>();
  const userStore = useUserStore();
  const current_site_id = ref(userStore.getCurrentSite['id'] || 1);
  list.value = getSiteList();
  const current_site = ref('');
  if (list.value) {
    Object.keys(list.value).forEach((key) => {
      if (list.value[key]['i'] == current_site_id.value) {
        current_site.value = list.value[key]['n'];
      }
    });
    if (!current_site.value) {
      current_site.value = list.value[0]['n'];
    }
  }

  const [register, { openDrawer: openDrawer, setDrawerProps }] = useDrawer();
  // const go = useGo();

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme,
    { 'collapsed-show-title': unref(getCollapsedShowTitle) },
  ]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);
  // 暂时关闭登录页跳转
  // function goHome() {
  //   go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
  // }

  function openSiteDrawer() {
    if (isControlValueSet()) return;
    openDrawer();
    setDrawerProps({ loading: true });
    setTimeout(() => {
      setDrawerProps({ loading: false });
    }, 1000);
    // TODO
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    transition: all 0.2s ease;
    cursor: pointer;

    &.light {
      // border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      transition: all 0.5s;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
    }
  }

  .header_logo {
    display: flex !important;
    position: absolute;
    flex-direction: column !important;
    align-items: flex-end !important;
    justify-content: space-around !important;
    width: 20px !important;
    height: 20px !important;

    .header_logo_bar {
      display: block;
      width: 100%;
      height: calc(4 / 1920 * 100vw);
      background-color: #b1bad3 !important;
    }
  }

  .logo_content {
    min-width: calc(100% - 30px);
  }

  .header-Drawer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
</style>
