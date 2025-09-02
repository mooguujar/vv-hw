<template>
  <div class="top-subMenu">
    <div>
      <Icon :icon="activeIcon" class="top-subMenu-logo" />
      <div class="top-subMenu-title overflow-hidden text-ellipsis whitespace-nowrap">{{
        $t(activeTitle)
      }}</div>
    </div>
  </div>
  <Menu
    v-bind="getBindValues"
    :activeName="activeName"
    :openNames="getOpenKeys"
    :class="prefixCls"
    :activeSubMenuNames="activeSubMenuNames"
    @select="handleSelect"
  >
    <template v-for="item in items" :key="item.path">
      <SimpleSubMenu
        :item="item"
        :parent="true"
        :collapsedShowTitle="collapsedShowTitle"
        :collapse="collapse"
      />
    </template>
  </Menu>
</template>
<script lang="ts">
  import type { MenuState } from './types';
  import type { Menu as MenuType } from '/@/router/types';
  import type { RouteLocationNormalizedLoaded } from 'vue-router';
  import {
    defineComponent,
    computed,
    ref,
    unref,
    reactive,
    toRefs,
    watch,
    PropType,
    onMounted,
  } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Menu from './components/Menu.vue';
  import SimpleSubMenu from './SimpleSubMenu.vue';
  import { listenerRouteChange } from '/@/logics/mitt/routeChange';
  import { propTypes } from '/@/utils/propTypes';
  import { REDIRECT_NAME } from '/@/router/constant';
  import { useRouter } from 'vue-router';
  import { isFunction, isUrl } from '/@/utils/is';
  import { openWindow } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMainRoutesStoreWithOut } from '/@/store/modules/mainRoutes';
  import { useOpenKeys } from './useOpenKeys';
  import Icon from '@/components/Icon/Icon.vue';
  import { getCurrentParentPath, getMenus } from '/@/router/menus';
  import eventBus from '/@/utils/eventBus';
  import { router } from '/@/router';

  const { t } = useI18n();
  export default defineComponent({
    name: 'SimpleMenu',
    components: {
      Menu,
      SimpleSubMenu,
      Icon,
    },
    inheritAttrs: false,
    props: {
      items: {
        type: Array as PropType<MenuType[]>,
        default: () => [],
      },
      collapse: propTypes.bool,
      mixSider: propTypes.bool,
      theme: propTypes.string,
      accordion: propTypes.bool.def(true),
      collapsedShowTitle: propTypes.bool,
      beforeClickFn: {
        type: Function as PropType<(key: string) => Promise<boolean>>,
      },
      isSplitMenu: propTypes.bool,
    },
    emits: ['menuClick'],
    setup(props, { attrs, emit }) {
      const currentActiveMenu = ref('');
      const isClickGo = ref(false);

      const menuState = reactive<MenuState>({
        activeName: '',
        openNames: [],
        activeSubMenuNames: [],
      });

      const { currentRoute } = useRouter();
      const beforeNewRouter = ref(currentRoute.value.path);
      const { prefixCls } = useDesign('simple-menu');
      const { items, accordion, mixSider, collapse } = toRefs(props);
      const { setOpenKeys, getOpenKeys } = useOpenKeys(
        menuState,
        items,
        accordion,
        mixSider as any,
        collapse as any,
      );

      const getBindValues = computed(() => ({ ...attrs, ...props }));

      watch(
        () => props.collapse,
        (collapse) => {
          if (collapse) {
            menuState.openNames = [];
          } else {
            setOpenKeys(currentRoute.value.path);
          }
        },
        { immediate: true },
      );

      watch(
        () => props.items,
        () => {
          if (!props.isSplitMenu) {
            return;
          }
          setOpenKeys(currentRoute.value.path);
          changeMainPage();
        },
        { flush: 'post' },
      );

      listenerRouteChange((route) => {
        if (route.name === REDIRECT_NAME) return;

        currentActiveMenu.value = route.meta?.currentActiveMenu as string;
        handleMenuChange(route);

        if (unref(currentActiveMenu)) {
          menuState.activeName = unref(currentActiveMenu);
          setOpenKeys(unref(currentActiveMenu));
        }
      });

      async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
        if (unref(isClickGo)) {
          isClickGo.value = false;
          return;
        }
        const path = (route || unref(currentRoute)).path;

        menuState.activeName = path;

        setOpenKeys(path);
      }

      async function handleSelect(key: string) {
        if (isUrl(key)) {
          openWindow(key);
          return;
        }
        const { beforeClickFn } = props;
        if (beforeClickFn && isFunction(beforeClickFn)) {
          const flag = await beforeClickFn(key);
          if (!flag) return;
        }

        emit('menuClick', key);

        isClickGo.value = true;
        setOpenKeys(key);
        menuState.activeName = key;
        if (
          key == beforeNewRouter.value &&
          key != '/member/createMember' &&
          key != '/member/addMoney'
        ) {
          router.push({ name: 'RedirectTo', query: { path: menuState.activeName } });
        }
        beforeNewRouter.value = menuState.activeName;
      }

      const activeTitle = ref('');
      const activeIcon = ref('');
      const storeMainRoutesArray: any = ref([]);

      async function changeMainPage() {
        const slectPath =
          unref(currentRoute)?.query.slectPath || unref(currentRoute).meta.slectPath;
        let activeItem = storeMainRoutesArray.value.filter((item) => item.path == slectPath)[0];
        if (activeItem) {
          activeTitle.value = activeItem.title;
          activeIcon.value = activeItem.icon;
        }
      }

      onMounted(async () => {
        const menus = await getMenus();
        storeMainRoutesArray.value = menus;
        changeMainPage();
        eventBus.on('no-data-change', (res) => {
          setTimeout(() => {
            if (res) {
              const activeItem = storeMainRoutesArray.value.find((item) => item.path === res);
              if (activeItem) {
                activeTitle.value = activeItem.title;
                activeIcon.value = activeItem.icon;
              }
            }
          }, 30);
        });
      });

      watch(currentRoute, (newRoute, oldRoute) => {
        const { query, meta } = newRoute;
        const slectPath = query?.slectPath || meta?.slectPath;

        if (slectPath) {
          const activeItem = storeMainRoutesArray.value.find((item) => item.path === slectPath);

          if (activeItem) {
            activeTitle.value = activeItem.title;
            activeIcon.value = activeItem.icon;
          }
        }
      });

      return {
        prefixCls,
        getBindValues,
        handleSelect,
        getOpenKeys,
        ...toRefs(menuState),
        activeTitle,
        activeIcon,
      };
    },
  });
</script>
<style lang="less">
  @import url('./index.less');

  .top-subMenu > div {
    display: flex;
    width: 200px;
    height: 46px;
    margin: 4px auto 11px;
    border-radius: 4px;
    background-color: #1a2c38;
    color: #fff;
    font-size: 16px !important;
    font-weight: 600 !important;
  }

  .top-subMenu-logo {
    width: 20px !important;
    height: 20px !important;
    margin-top: 12px;
  }

  .top-subMenu-title {
    margin-top: 12px;
    margin-left: 16px;
    line-height: 22px;
  }
</style>
