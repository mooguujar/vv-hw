<template>
  <MenuItem
    :name="item.path"
    v-if="!menuHasChildren(item) && getShowMenu"
    v-bind="$props"
    :class="getLevelClass"
  >
    <Icon v-if="getIcon" :icon="getIcon" :size="20" />
    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">
      {{ getI18nName }}
    </div>
    <template #title>
      <span :class="['ml-15px', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
      </span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
    <!-- <div class="Badge" v-if="item.path == '/member/inquiry'">
    <BadgeRibbon text="99" color="red"></BadgeRibbon>
  </div> -->
    <div class="Badge" v-if="num !== undefined && num > 0">
      <BadgeRibbon :text="`${num}`" color="red" />
    </div>
    <a-button class="noticeMenu" type="primary" v-if="notice" danger>{{ notice }}</a-button>
    <div style="clear: both"></div>
  </MenuItem>
  <SubMenu
    :name="item.path"
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <template #title>
      <Icon v-if="getIcon" :icon="getIcon" :size="24" />

      <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">
        {{ getI18nName }}
      </div>

      <span v-show="getShowSubTitle" :class="['ml-15px', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
      </span>
      <SimpleMenuTag :item="item" :collapseParent="!!collapse && !!parent" />
    </template>
    <template
      v-for="childrenItem in item.children || []"
      :key="childrenItem.paramPath || childrenItem.path"
    >
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
    <div class="Badge" v-if="num !== undefined && num > 0">
      <BadgeRibbon :text="`${num}`" color="red" />
    </div>
    <a-button class="notice" type="primary" v-if="notice" danger>{{ notice }}</a-button>
    <div style="clear: both"></div>
  </SubMenu>
</template>
<script lang="ts">
  import { PropType, watch, defineComponent, computed, ref } from 'vue';
  import type { Menu } from '/@/router/types';
  import { storeToRefs } from 'pinia';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Icon from '@/components/Icon/Icon.vue';

  import MenuItem from './components/MenuItem.vue';
  import SubMenu from './components/SubMenuItem.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { BadgeRibbon, Tooltip } from 'ant-design-vue';
  import { useNoticeStore } from '/@/store/modules/notice';

  const noticeStore = useNoticeStore();
  export default defineComponent({
    name: 'SimpleSubMenu',
    components: {
      SubMenu,
      MenuItem,
      SimpleMenuTag: createAsyncComponent(() => import('./SimpleMenuTag.vue')),
      Icon,
      BadgeRibbon,
      Tooltip,
    },
    props: {
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      parent: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
      collapse: propTypes.bool,
      theme: propTypes.oneOf(['dark', 'light']),
      num: {
        type: Number,
        default: undefined,
      },
    },
    setup(props) {
      let noticeJson: any = null;
      try {
        if (props.item.path.indexOf('risk') >= 0) {
          let { getRiskNotice } = storeToRefs(noticeStore);
          noticeJson = getRiskNotice;
        } else if (props.item.path.indexOf('finance') >= 0) {
          let { getFinanceNotice } = storeToRefs(noticeStore);
          noticeJson = getFinanceNotice;
        } else if (props.item.path.indexOf('system') >= 0) {
          let { getSystemNotice } = storeToRefs(noticeStore);
          noticeJson = getSystemNotice;
        }
      } catch (error) {
        console.error(error);
      }
      const notice = computed(() => (noticeJson ? noticeJson.value[props.item?.tagName] : ''));
      const { t } = useI18n();
      const { prefixCls } = useDesign('simple-menu');
      const getShowMenu = computed(() => !props.item?.meta?.hideMenu);
      const getIcon = computed(() => props.item?.icon);
      const getI18nName = computed(() => t(props.item?.name));
      const getShowSubTitle = computed(() => !props.collapse || !props.parent);
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ];
      });
      function menuHasChildren(menuTreeItem: Menu): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu &&
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }

      return {
        prefixCls,
        menuHasChildren,
        getShowMenu,
        getIcon,
        getI18nName,
        getShowSubTitle,
        getLevelClass,
        getIsCollapseParent,
        notice,
      };
    },
  });
</script>
<style lang="less" scoped>
  @keyframes jump {
    0% {
      transform: scale3d(1, 1, 1) translateY(0);
    }

    5% {
      transform: scale3d(1.03, 0.97, 1) translateY(-1px);
    }

    12.5% {
      transform: scale3d(1, 1, 1) translateY(-10px);
    }

    20% {
      transform: scale3d(0.98, 1.02, 1) translateY(-1px);
    }

    25% {
      transform: scale3d(1.06, 0.94, 1) translateY(4px);
    }

    32.5% {
      transform: scale3d(0.97, 1.03, 1) translateY(-4px);
    }

    40% {
      transform: scale3d(1, 1, 1) translateY(0);
    }

    100% {
      transform: scale3d(1, 1, 1) translateY(0);
    }
  }

  .Badge {
    position: absolute;
    top: 4px;
    right: 10px;
    animation-name: jump;
    animation-duration: 1.6s;
    animation-iteration-count: 5;
  }

  .Badge ::v-deep(.ant-ribbon) {
    background-color: #f5222d;
  }

  .noticeMenu {
    position: absolute;
    height: 13px;
    margin-left: 4px;
    padding: 0 3px;
    border-color: #c82a29;
    background-color: #c82a29;
    font-size: 13px;
    line-height: 7px;
  }
</style>
