<template>
  <ConfigProvider :locale="getAntdLocale" v-if="reload">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
  <AppAddCurrencyModal @register="registerRateModal" :boo="boo" />
</template>

<script lang="ts" setup>
  import { ConfigProvider, message } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useBodyClass } from '@/hooks/web/useBodyClass';
  import { useLocale } from '@/locales/useLocale';
  import 'dayjs/locale/zh-cn';
  import { onMounted, onUnmounted, provide, ref, watch } from 'vue';
  import { useAppStore } from '/@/store/modules/app';
  import { socketClient } from '/@/utils/socket';
  import { useUserStore } from '/@/store/modules/user';
  import { MenuModeEnum, MenuTypeEnum } from './enums/menuEnum';
  import AppAddCurrencyModal from '@/components/Application/src/AppAddCurrencyModal.vue';
  import eventBus from '@/utils/eventBus';
  import { useModal } from '@/components/Modal';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { useTimezoneStore } from './store/modules/timezone';
  import { getfinanceBalance, getSiteDetailMaintain } from '@/api/finance';
  import { useRoute } from 'vue-router';
  import { getAuthCache } from '@/utils/auth';
  import { USER_INFO_KEY } from '@/enums/cacheEnum';

  const permissionStore = usePermissionStore();
  const [registerRateModal, { openModal: openBalanceModal }] = useModal();
  // support Multi-language
  const { getAntdLocale } = useLocale();

  message.config({
    duration: 3,
    maxCount: 1,
  });
  const reload = ref(true);
  const setReload = async () => {
    reload.value = false;
    await permissionStore.buildRoutesAction();
    setTimeout(() => {
      reload.value = true;
    }, 111);
  };
  provide('setReload', setReload);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const boo = ref(false); // 充值弹窗默认关闭
  const getServerDate = () => {
    const { setServerDateStore } = useTimezoneStore();
    const baseUrl = '';
    fetch(baseUrl + `/date?t=${Date.now()}`, { method: 'HEAD' })
      .then(function (res) {
        const serverDate = res.headers.get('date');
        if (!serverDate) {
          console.error('Server did not return the Date header');
          return;
        }
        setServerDateStore(serverDate);
      })
      .catch(function (err) {
        console.error('Failed to fetch server date:', err);
      });
  };

  const openMaintain = async () => {
    const res = await getfinanceBalance({ site_code: info['prefix'] || 'dev' });
    let obj = {
      site_id: res.site_id,
      currency_id: res.currency_id,
    };
    openBalanceModal(true, obj);
    boo.value = true;
  };

  watch(
    () => info['overdraft_state'],
    (newV, oldV) => {
      if (newV === '2') {
        setTimeout(() => {
          openMaintain();
        }, 3000);
      }
    },
    { immediate: true, deep: true },
  );

  const route = useRoute();
  watch(
    () => route.path,
    (newRoute, oldRoute) => {
      if (oldRoute === '/login') {
        setTimeout(() => {
          const { overdraft_state } = getAuthCache(USER_INFO_KEY);
          if (overdraft_state === '2') {
            openMaintain();
          }
        }, 3000);
      }
    },
  );

  getServerDate();
  setInterval(() => {
    getServerDate();
  }, 1000 * 60 * 30);

  onMounted(() => {
    setTimeout(() => {
      socketClient.addSubscribe(`${info['prefix']}/merchant/notice`);
      socketClient.addSubscribe(`${info['prefix']}/merchant/promo/pending`);
      socketClient.addSubscribe(`${info['prefix']}/merchant/balance`);
      socketClient.addSubscribe(`${info['prefix']}/notification/deposit`);
      socketClient.addSubscribe(`${info['prefix']}/siteMaintain`);
      socketClient.addSubscribe(`${info['prefix']}/common`);
      socketClient.addSubscribe(`/zk/currency/status`);
      socketClient.addSubscribe(`${info['prefix']}/feedback/${info['name']}`);

      eventBus.on('RefreshSiteMaintain', (res: any) => {
        // state: "2" 登录后都将展示充币的弹窗
        if (+res.state === 2) {
          openMaintain();
        } else if (+res.state === 3) {
          // state: "3" 商户后台所有账号都将强制退出且无法登录，只有超级管理员可以登录充币
          getSiteDetailMaintain().then((res) => {
            if (res.zk !== '2') {
              // 2为管理员
              userStore.logout(true);
            }
          });
        } else {
          // 清除登录弹充值窗标识
          info['overdraft_state'] = '';
          userStore.setUserInfo(info);
        }
      });
    }, 3000);
  });

  onUnmounted(() => {
    socketClient.removeSubscribe(`${info['prefix']}/merchant/notice`);
    socketClient.removeSubscribe(`${info['prefix']}/merchant/promo/pending`);
    socketClient.removeSubscribe(`${info['prefix']}/merchant/balance`);
    socketClient.removeSubscribe(`${info['prefix']}/notification/deposit`);
    socketClient.removeSubscribe(`${info['prefix']}/siteMaintain`);
    socketClient.removeSubscribe(`${info['prefix']}/common`);
    socketClient.removeSubscribe(`/zk/currency/status`);
    socketClient.addSubscribe(`${info['prefix']}/feedback/${info['name']}`);
  });
  sessionStorage.setItem('detailsMember', '');
  // Listening to page changes and dynamically changing site titles
  useTitle();
  useBodyClass();
  appStore.setProjectConfig({
    menuSetting: {
      mode: MenuModeEnum.INLINE,
      // Menu type
      type: MenuTypeEnum.MIX,
      split: true,
      // type: 'mix',
    },
  });
</script>

<style lang="less">
  @import './assets/font/font.css';
  @import './design/custom.less';
  @import './assets/tailwind.css';

  body {
    background-color: #011024;
  }

  .custom-body-zh_CN {
    font-family: PingFangSC-Regular, sans-serif, AlimamaFangYuanTiVF-Thin;
  }
</style>
