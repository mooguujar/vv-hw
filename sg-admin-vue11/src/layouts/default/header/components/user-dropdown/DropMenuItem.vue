<template>
  <MenuItem :key="itemKey" class="drop-menu">
    <div style="display: block">
      <div class="flex justify-between">
        <div>
          <span class="flex items-center">
            <cdUserDropDownIcon
              :class="noIcon ? '!hidden' : '!block'"
              :icon="icon"
              class="mr-1 w-14px"
            />
            <span v-if="noIcon" class="mr-3">{{ symbol }}</span>
            <span class="main-title">{{ text }}</span>
          </span>
        </div>
        <div v-if="children">
          <!--          <Icon icon="ph:caret-right" />-->
          <img :src="rightArrow" class="w-6px" />
        </div>
      </div>
      <div v-if="isShowChildren" class="children-box">
        <div class="children-contain">
          <MenuItem v-for="chi in children" :key="chi.key" style="padding: 0 !important">
            <div :class="chi.active ? 'selected-menu-item menu-item' : 'menu-item'">
              <template v-if="chi.icon && chi.key.includes('curr_')">
                <div class="currencyListBox">
                  <div>
                    <span v-if="chi.icon && chi.key.includes('curr_')" class="mr2">
                      <cdIconCurrency :icon="chi.icon" class="w-16px" />
                    </span>
                    <span v-if="chi.name" class="mr-2 menu-children-text">{{ chi.name }}</span>
                  </div>
                  <div>
                    <span class="menu-children-text">{{ chi.label }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <span v-if="chi.icon && chi.key.includes('lan_')" class="mr2">
                  <cdIconLanguage :icon="chi.icon" class="w-16px" />
                </span>
                <span v-if="chi.name" class="mr-2 menu-children-text">{{ chi.name }}</span>
                <span v-else class="menu-children-text">{{ chi.label }}</span>
              </template>
            </div>
          </MenuItem>
        </div>
      </div>
    </div>
  </MenuItem>
</template>
<script lang="ts">
  import { Menu } from 'ant-design-vue';
  import { computed, defineComponent, getCurrentInstance, ref, watch, reactive } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import cdIconLanguage from '/@/components-cd/Icon/language/cd-icon-language.vue';
  import cdUserDropDownIcon from '/@/components-cd/Icon/userDropdownIcon/cd-user-drop-down-icon.vue';
  import rightArrow from '/@/assets/images/right.webp';

  export default defineComponent({
    name: 'DropdownMenuItem',
    components: {
      MenuItem: Menu.Item,
      Icon,
      cdIconCurrency,
      cdUserDropDownIcon,
      rightArrow,
      cdIconLanguage,
    },
    props: {
      // eslint-disable-next-line
      key: propTypes.string,
      text: propTypes.string,
      icon: propTypes.string,
      noIcon: propTypes.bool,
      symbol: propTypes.string,
      children: propTypes.array,
      activeItem: propTypes.string,
    },
    setup(props) {
      const instance = getCurrentInstance();
      const itemKey = computed(() => props.key || instance?.vnode?.props?.key);
      const isShowChildren = ref(true);
      watch(
        () => props.activeItem,
        (newVal, oldValue) => {
          isShowChildren.value = newVal === itemKey.value;
          resetChildrenPosition();
        },
        {
          immediate: true,
        },
      );
      function resetChildrenPosition() {
        let dropMenu = document.getElementsByClassName('drop-menu');
        if (dropMenu.length > 0) {
          let childrenBoxPosition = dropMenu[0].offsetWidth + 1;
          for (var i = 0; i < document.getElementsByClassName('children-box').length; i++) {
            document.getElementsByClassName('children-box').item(i).style.right =
              childrenBoxPosition + 'px';
          }
        }
      }
      return { itemKey, isShowChildren, rightArrow };
    },
  });
</script>
<style lang="less" scoped>
  .children-box {
    position: absolute;
    z-index: 200;
    top: 0;

    /* margin-left: -174px; */
    right: 162px;
    height: auto;
    max-height: 500px;
    margin-top: -4px;
    overflow: hidden;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 6px rgb(0 0 0 / 20%);

    /* overflow-y: auto; */
  }

  .children-contain {
    height: auto;
    max-height: 500px;
    padding-top: 3px;
    overflow-y: auto;
  }

  .children-box::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .main-title {
    color: #2f4553;
    font-size: 14px;
    font-weight: 600;
  }

  .menu-children-text {
    color: #2f4553;
    font-size: 14px;
    font-weight: 600;
  }

  .menu-item {
    margin-bottom: 3px;
    padding: 5px 12px !important;
  }

  .selected-menu-item {
    width: 100%;
    background-color: #dce3f1;
    //padding-left: 5px;
    //padding-right: 5px
  }

  .currencyListBox {
    display: flex;
    justify-content: space-between;
  }
</style>
