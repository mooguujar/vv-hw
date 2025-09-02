<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block md:ml-2 mr-2`">
        <span :class="`${prefixCls}__name  `" class="truncate font-semibold">
          {{ getUserInfo.name }}
        </span>
      </span>
      <img :src="downIcon" alt="" style="width: 10px" />
    </span>

    <template #overlay>
      <Menu
        @click="handleMenuClick"
        mode="vertical"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        :multiple="true"
        :forceSubMenuRender="true"
        class="personal-menu-box"
      >
        <MenuItem
          v-for="item in MenuItems"
          :key="item.key"
          :text="item.title"
          :icon="item.icon"
          :children="item.children"
          @mouseenter="handleShowMenuItem(item.key)"
          @mouseleave="handleHiddenMenuItem"
          :activeItem="activeMenuItem"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
  <ChangePassword @register="registerPwModal" />
</template>
<script lang="ts">
  import { Dropdown, Menu } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';

  import { defineComponent, computed, ref, unref, onMounted } from 'vue';

  import { DOC_URL } from '/@/settings/siteSetting';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';

  import headerImg from '/@/assets/images/header.jpg';
  import { propTypes } from '/@/utils/propTypes';
  import { openWindow, calculateWidth } from '/@/utils';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useFinanceStore } from '/@/store/modules/finance';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { USER_INFO_KEY } from '/@/enums/cacheEnum';
  import { getAuthCache } from '/@/utils/auth';
  import { LocaleType } from '#/config';
  import { getfinanceBalance } from '@/api/finance';
  import { useTimezoneStore } from '@/store/modules/timezone';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import ChangePassword from '../changePassword/index.vue';
  import downIcon from '/@/assets/svg/downIcon.svg';
  import { openConfirm } from '/@/utils/confirm';
  import { SiteCurrencyIdMap } from '/@/settings/commonSetting';
  import { useBodyClass } from '/@/hooks/web/useBodyClass';
  import { useTimezoneList } from '/@/settings/localeSetting';
  import { getHtmlPageLang } from '/@/locales/helper';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';

  const { setTimezone, getSizeId } = useTimezoneStore();
  const timezoneStore = useTimezoneStore();
  const timezoneList = useTimezoneList();
  type MenuEvent = 'logout' | 'doc' | 'lock' | 'lan' | 'modiPassWorld';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
      ChangePassword,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const { name } = getAuthCache(USER_INFO_KEY) || {};
        return { name, avatar: headerImg };
      });
      const info = userStore.getUserInfo;

      const [register, { openModal }] = useModal();
      let activeMenuItem = ref('');
      const selectedKeys = ref([]);
      const openKeys = ref([]);
      function handleLock() {
        openModal(true);
      }
      const [registerPwModal, { openModal: openChangeModal }] = useModal();

      //  login out
      function handleLoginOut() {
        openConfirm(
          t('modalForm.finance.finance_operation_confirmation'),
          t('modalForm.finance.finance_operation_confirmation_msg'),
          () => userStore.logout(true),
          t('common.okText'),
        );

        // userStore.confirmLoginOut();
      }

      // open doc
      function openDoc() {
        openWindow(DOC_URL);
      }

      function handleMenuClick(e: MenuInfo) {
        const menu_key = e.key;
        switch (e.key as MenuEvent) {
          case 'logout':
            handleLoginOut();
            break;
          case 'doc':
            openDoc();
            break;
          case 'lock':
            handleLock();
            break;
          case 'modiPassWorld':
            openChangeModal(true);
        }
        if (menu_key.indexOf('lan') > -1) {
          handleChangeLan(menu_key);
        }
        if (menu_key.indexOf('curr_') > -1) {
          handleChangeCur(menu_key);
        }
        if (menu_key.indexOf('zone_') > -1) {
          handleChangeZone(menu_key);
        }
      }
      const { changeLocale, getLocale } = useLocale();
      const { getAllCurrencyList, setCurrencyObj, setCurrency, getCurrency } = useCurrencyStore();
      const currencyList = getAllCurrencyList.map((item) => {
        return {
          ...item,
          key: 'curr_' + item.name,
          label: item.name,
          title: item.name,
          value: item.name,
        };
      });
      // 新需求： 改成 实时汇率 和 货币参考 的合并, 也就是直接换成原先余额的下拉框内容来切换了
      // {"id": "702","sortlevel": "007002","name": "BRL","pid": "700","attr": "1","label": "BRL","value": "702","inUsed": true}
      const currencyList2 = ref([]);
      const balanceInfor = ref({});
      async function getBalance() {
        const res = await getfinanceBalance({ site_code: info['prefix'] || 'dev' });
        balanceInfor.value = res;
        // updateBalance(res);
        getCurrencyList2(res);
      }
      const zoneTimeChildren = computed(() => {
        let _arr: Array<{ key: string; label: string; title: string; active: boolean }> = [];
        timezoneList.map((item) => {
          const _obj = {
            key: 'zone_' + item.value,
            label: item.label,
            title: item.label,
            active: item.value === timezoneStore.getTimezone,
          };
          _arr.push(_obj);
        });
        return _arr;
      });
      const currentLanguage = useLocaleStoreWithOut();
      // 将calculateWidth方法挂载到window对象上
      (window as any)._calculateWidth = calculateWidth;

      const isLocal = import.meta.env.MODE === 'development' || import.meta.env.MODE === 'dev';
      let MenuItems = ref([
        {
          key: 'lan',
          icon: 'language',
          label: t('layout.header.dropdownLanguage'),
          title: t('layout.header.dropdownLanguage'),
          children: [
            {
              key: 'lan_zh_CN',
              label: t('common.common_zh_CN'), //中文
              title: 'zh_CN',
              icon: 'CN',
              active: currentLanguage.getLocale === 'zh_CN',
            },
            {
              key: 'lan_en_US',
              label: t('common.common_en_US'), //英文
              title: 'en_US',
              icon: 'US',
              active: currentLanguage.getLocale === 'en_US',
            },
            {
              key: 'lan_vi_VN',
              label: t('common.common_vi_VN'),
              title: 'vi_VN',
              icon: 'VN',
              active: currentLanguage.getLocale === 'vi_VN',
            },
            {
              key: 'lan_pt_BR',
              label: t('common.common_pt_BR'),
              title: 'pt_BR',
              icon: 'BR',
              active: currentLanguage.getLocale === 'pt_BR',
            },
            // {
            //   key: 'lan_th_TH',
            //   label: t('common.common_th_TH'),
            //   title: 'th_TH',
            //   icon: 'TH',
            //   active: currentLanguage.getLocale == 'th_TH',
            // },
            // {
            //   key: 'lan_hi_IN',
            //   title: 'hi_IN',
            //   icon: 'IN',
            //   active: currentLanguage.getLocale == 'hi_IN',
            //   language: 'hi_',
            //   value: 'hi_IN',
            //   label: t('common.common_hi_IN'),
            //   disabled: false,
            // },
            isLocal
              ? {
                  key: 'lan_aa_AA',
                  label: '显示key',
                  title: 'aa_AA',
                  icon: 'AA',
                  active: (currentLanguage.getLocale as string) === 'aa_AA',
                }
              : {},
          ],
        },
        {
          key: 'current',
          icon: 'currency',
          label: t('layout.header.dropdownCurrent'),
          title: t('layout.header.dropdownCurrent'),
          //children: currencyList,
          children: currencyList2,
        },
        {
          key: 'timezone',
          icon: 'timezone',
          label: t('layout.header.dropdownTimeLocal'),
          title: t('layout.header.dropdownTimeLocal'),
          children: zoneTimeChildren,
        },
        {
          key: 'modiPassWorld',
          icon: 'changepwd',
          label: t('layout.header.dropdownResetPassword'),
          title: t('layout.header.dropdownResetPassword'),
        },
        {
          key: 'logout',
          icon: 'exit',
          label: t('layout.header.dropdownItemLoginOut'),
          title: t('layout.header.dropdownItemLoginOut'),
        },
      ]);
      if (isControlValueSet()) {
        MenuItems.value = MenuItems.value.filter((p) => p.key !== 'modiPassWorld');
      }
      function handleShowMenuItem(key) {
        activeMenuItem.value = key;
      }

      function handleHiddenMenuItem() {
        activeMenuItem.value = '';
      }
      async function toggleLocale(lang: LocaleType | string) {
        await changeLocale(lang as LocaleType);
        useBodyClass();
        localStorage.setItem('locale_language', lang);
        location.reload();
      }
      function handleChangeLan(key) {
        const language = key.split('lan_')[1];
        if (language) {
          if (unref(getLocale) === language) {
            localStorage.setItem('locale_language', language);
            return;
          }
          toggleLocale(language as string);
          if (language === 'aa_AA') {
            localStorage.setItem('locale_language', 'aa_AA');
            document.location.reload();
          }
        }
      }
      function handleChangeZone(key) {
        const _zone = key.split('zone_')[1];
        if (_zone) {
          setTimezone(_zone);
          document.location.reload();
        }
      }
      // 切换语言列
      // 新需求： 改成 实时汇率 和 货币参考 的合并, 也就是直接换成原先余额的下拉框内容来切换了
      function handleChangeCur(key) {
        const cur = key.split('curr_')[1];
        if (cur) {
          let obj = getAllCurrencyList.filter((fi) => fi.name === cur)[0];
          obj.value = cur;
          obj = JSON.parse(JSON.stringify(obj));
          setCurrency(cur);
          setCurrencyObj(obj);
          document.location.reload();
        }
      }
      async function getCurrencyList2(_data) {
        // for (var v = 0; v < balanceList.value.length; v++) {
        // var eveOne = await balanceList.value[v];
        const financeStore = useFinanceStore();
        const finance = financeStore?.rateObject;
        //当前的币种 当前币种id
        var keyId = '';
        for (var j = 0; j < getAllCurrencyList.length; j++) {
          if (getAllCurrencyList[j].name === getCurrency) {
            keyId = getAllCurrencyList[j].id;
          }
        }
        const isFirstLoad = localStorage.getItem('hasLoaded') == null;
        if (isFirstLoad) {
          localStorage.setItem('hasLoaded', 'true');
          // keyId = SiteCurrencyIdMap[getSizeId];
          let obj = getAllCurrencyList.filter((fi) => fi.id == keyId)[0];
          obj.value = obj.name;
          obj = JSON.parse(JSON.stringify(obj));
          setCurrency(obj.name);
          setCurrencyObj(obj);
        }

        // 当前币种所有当币值
        // let currencyAll = finance?.rates[keyId] || [];
        let currencyAll: any = finance?.rates?.[keyId] ?? {};

        let cl2Arr: any = [];
        for (var k = 0; k < currencyList.length; k++) {
          // 全部开始
          var _obj: any = {};
          _obj.name = currencyList[k].label;
          _obj.currency = currencyAll[currencyList[k].id];
          if (!currencyAll[currencyList[k].id]) {
            _obj.currency = 1;
          }
          _obj.label = _obj.currency;
          _obj.icon = _obj.name;
          _obj.key = 'curr_' + _obj.name;
          _obj.id = currencyList[k].id;
          _obj.active = currencyList[k].id == keyId;
          cl2Arr[k] = _obj;
          // 全部结束

          // 只取三个 开始
          // if (currencyList[k].name === eveOne.value) {
          //   if (!currencyAll[currencyList[k].id]) currencyAll[currencyList[k].id] = 1;
          //   currencyList[k].label = eveOne.symbol + currencyAll[currencyList[k].id];
          //   // bch
          //   //
          //   currencyList[k].icon = '@/assets/svg/currency/coin-busd.svg';
          //   //currencyList[k].icon = h("div",{},"hello!!");
          //   currencyList2.value.push(currencyList[k]);
          // }
          // 只取三个 结束
        }
        currencyList2.value = cl2Arr;
        // for (var c = 0; c < currencyList.length; c++) {
        //   if (currencyList[c].name === eveOne.value) {
        //     currencyList[c].label = eveOne.symbol + ' ' + _data[eveOne.value];
        //     currencyList2.value.push(currencyList[c]);
        //   }
        // }
        // }
      }

      onMounted(() => {
        getBalance();
      });

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
        getUseLockPage,
        handleHiddenMenuItem,
        handleShowMenuItem,
        MenuItems,
        activeMenuItem,
        selectedKeys,
        openKeys,
        registerPwModal,
        downIcon,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    align-items: center;
    height: @header-height;
    // margin-left: 30px;
    padding: 0 0 0 12px;
    padding-right: 12px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;

    img {
      width: 18px;
      height: 18px;
    }

    &__header {
      //border-radius: 50%;
      width: 18px;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 112px;
      }
    }
  }

  .personal-menu-box {
    position: absolute !important;
    top: -8px !important;
    right: 0 !important;
  }

  .personal-menu-box::before {
    content: '';
    display: block;
    position: absolute;
    right: 10px;
    width: 20px;
    height: 20px;
    margin-top: -20px;
    border: 10px solid;
    border-color: transparent transparent #fff;
  }
</style>
