import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';

import {
  CURRENT_SITE,
  ROLES_KEY,
  SITE_LIST,
  TOKEN_KEY,
  USER_INFO_KEY,
  OSSURL,
  SITE_GROUP_LIST,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginAdminResultModel } from '/@/api/sys/model/userModel';
import { doLogout, loginAdmin } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { h } from 'vue';
import { socketClient } from '/@/utils/socket';
import { initStore } from '/@/logics/initStore';
import { getAdminDetail, adminGroupSite, getSiteBrandDetail } from '/@/api/sys';
import {
  currentyOptionsList,
  RouterNameList,
  SiteCurrencyIdMap,
  SiteTimeIdMap,
} from '/@/settings/commonSetting';
import { useTimezoneStore } from './timezone';
import { useCurrencyStore } from './currency';

interface UserState {
  userInfo: Nullable<UserInfo>;
  dynamicBoo: boolean;
  dynamicStr: string;
  importStr: string;
  dynamicMqtt: any;
  importMqtt: any;
  token?: string;
  roleList: RoleEnum[];
  siteList?: [];
  sessionTimeout?: boolean;
  logROIPwd?: boolean;
  enabledKYC?: boolean;
  lastUpdateTime: number;
  singleLanguage?: boolean;
  defaultLanguage?: string;
  defaultTimezone?: string;
  ossUrl?: string;
  currentSite?: any;
  countNoticefinance?: any;
  groupSiteList?: any;
  detailCurrency?: string;
  detailExchangeCode?: [];
  detailCodeExchange?: [];
  onePageData?: {};
  onePageList?: {};
  exchangeCurrency?: [];
  currencyList2?: [];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    dynamicBoo: false,
    dynamicStr: '',
    importStr: '',
    dynamicMqtt: [],
    importMqtt: [],
    // token
    token: undefined,
    // roleList
    roleList: [],

    siteList: [],

    currentSite: {},
    // Whether the login expired
    sessionTimeout: false,
    // Whether to log ROI password
    logROIPwd: false,
    // 是否开启KYC
    enabledKYC: false,
    // Last fetch time
    lastUpdateTime: 0,
    //是否开启单一语言
    singleLanguage: false,
    //默认语言
    defaultLanguage: 'zh_CN',
    //默认时区
    defaultTimezone: 'Etc/GMT',
    //视频图片域名
    ossUrl: '',
    countNoticefinance: null,
    groupSiteList: [],
    detailCurrency: '',
    detailExchangeCode: {},
    detailCodeExchange: {},
    onePageData: {},
    onePageList: {},
    exchangeCurrency: [],
    currencyList2: [],
  }),
  getters: {
    getUserInfo(state) {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getDynamicBoo(state) {
      return state.dynamicBoo;
    },
    getDynamicStr(state) {
      return state.dynamicStr;
    },
    getImportStr(state) {
      return state.importStr;
    },
    getDynamicMqtt(state) {
      return state.dynamicMqtt;
    },
    getImportMqtt(state) {
      return state.importMqtt;
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
    getOssUrl(state): string {
      return state.ossUrl || getAuthCache<string>(OSSURL) || '';
    },
    getSiteList(state) {
      return state.siteList || getAuthCache<string>(SITE_LIST) || '';
    },
    getGroupSiteList(state) {
      return state.groupSiteList || getAuthCache<string>(SITE_GROUP_LIST) || '';
    },
    getCurrentSite(state): string {
      return state.currentSite || getAuthCache<string>(CURRENT_SITE);
    },
    getCountNoticefinance(state) {
      return state.countNoticefinance;
    },
    getCurrency(state) {
      return state?.detailCurrency;
    },
    getSingleLanguage(state): boolean {
      return state.singleLanguage || false;
    },
    getDefaultLanguage(state): string {
      return state.defaultLanguage || 'zh_CN';
    },
    getDefaultTimezone(state): string {
      return state.defaultTimezone || 'Etc/GMT';
    },
    getEnabledKYC(state): boolean {
      return state.enabledKYC || false;
    },
    getDetailExchangeCode(state) {
      return state?.detailExchangeCode;
    },
    getDetailCodeExchange(state) {
      return state?.detailCodeExchange;
    },
    getOnePageData(state) {
      return state?.onePageData;
    },
    getOnePageList(state) {
      return state?.onePageList;
    },
    getExchangeCurrencyCode(state) {
      return state?.exchangeCurrency;
    },
    getCurrencyList2(state) {
      return state?.currencyList2;
    },
  },
  actions: {
    setDynamicMqtt(flag: []) {
      this.dynamicMqtt = flag || [];
    },
    setDynamicBoo(flag: boolean) {
      this.dynamicBoo = flag;
    },
    setDynamicStr(flag: string) {
      this.dynamicStr = flag;
    },
    setImportStr(flag: string) {
      this.importStr = flag;
    },
    setInportMqtt(flag: []) {
      this.importMqtt = flag || [];
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setSiteList(info) {
      this.siteList = info ? info : []; // for null or undefined value
      setAuthCache(SITE_LIST, info);
    },
    setSingleLanguage(info: boolean) {
      this.singleLanguage = info;
    },
    setDefaultLanguage(info: string) {
      this.defaultLanguage = info;
    },
    setDefaultTimezone(info: string) {
      this.defaultTimezone = info;
    },
    setEnabledKYC(info: boolean) {
      this.enabledKYC = info;
    },
    setDetailCurrency(info: string) {
      this.detailCurrency = info;
    },
    setExchangeCurrencyCode(info: []) {
      this.exchangeCurrency = info ? info : [];
    },
    setCurrencyList2(info: []) {
      this.currencyList2 = info ? info : [];
    },
    setDetailExchangeCode(flag: {}) {
      this.detailExchangeCode = flag;
    },
    setDetailCodeExchange(flag: {}) {
      this.detailCodeExchange = flag;
    },
    setOnePageData(flag: {}) {
      this.onePageData = flag;
    },
    setOnePageList(flag: {}) {
      this.onePageList = flag;
    },
    setGroupSiteList(info) {
      this.groupSiteList = info ? info : []; // for null or undefined value
      setAuthCache(SITE_GROUP_LIST, info);
    },
    setCurrentSite(info) {
      this.currentSite = info ? info : {}; // for null or undefined value
      setAuthCache(CURRENT_SITE, info);
    },
    setOssUrl(info: string | undefined) {
      this.ossUrl = info ? info : ''; // for null or undefined value
      setAuthCache(OSSURL, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginAdminResultModel & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        const response: any = await loginAdmin(loginParams);
        const { status, data } = response;
        if (status && data.overdraft_state !== '3') {
          this.userInfo = data;
          this.setUserInfo(data);
          this.setToken(data.token);
          sessionStorage.setItem('logRoiPwd', 'false');
          await initStore();
          return this.afterLoginAction(goHome);
        } else if (data.overdraft_state === '3') {
          this.setUserInfo(data);
          this.setToken(data.token);
          return Promise.resolve(data);
        } else {
          throw new Error(data);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;

      const userInfo = {
        name: '',
        homePath: '',
      };
      const sessionTimeout = this.sessionTimeout;

      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        permissionStore.setDynamicAddedRoute(false);
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          routes.some((route) => {
            const { name, redirect } = route;
            if (name === 'Member') {
              userInfo.homePath = redirect;
              return true; // 停止循环
            }
            if (RouterNameList.includes(name)) {
              userInfo.homePath = redirect;
            }
            return false; // 继续循环
          });

          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async initSiteList(): Promise<any> {
      try {
        const response = await getAdminDetail();
        this.setSiteList(response.sites);
        this.setCurrentSite(response);
        const controlValue = localStorage.getItem('control');
        let siteList = response.sites.filter((item) => item.i === response.id);
        if (controlValue) {
          siteList = response.sites;
        }
        const site_default_timezone = siteList[0].timezone || 'Etc/GMT';
        const site_default_currency = siteList[0].currency || '706';
        const { setTimezone, setSizeId } = useTimezoneStore();
        // 获取品牌设置
        const configData = await getSiteBrandDetail({ tag: 'base' });
        const defaultTimezone = configData.timezone || 'Etc/GMT';
        this.setEnabledKYC(configData.kyc === 1 ? true : false);
        const { setCurrencyObj, setCurrency } = useCurrencyStore();
        const isFirstLoad = localStorage.getItem('hasIimeLoaded') == null;
        const timezone = site_default_timezone;
        const currency = site_default_currency;
        this.setDefaultTimezone(defaultTimezone);
        if (isFirstLoad) {
          localStorage.setItem('hasIimeLoaded', 'true');
          this.setSingleLanguage(configData.lang.f === 1 ? true : false);
          this.setDefaultLanguage(configData.default?.lang ?? 'zh_CN');
          setTimezone(timezone);
          let obj: any = currentyOptionsList.filter((fi) => fi.id == currency)[0];
          obj.value = obj.name;
          obj = JSON.parse(JSON.stringify(obj));
          setCurrency(obj.name);
          setCurrencyObj(obj);
        }
        const res = await adminGroupSite();
        setSizeId(response.id);
        this.setGroupSiteList(res || []);
      } catch (e) {
        console.error(e);
      }
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      // await initStore();
      // if (!this.getToken) return null;
      // const userResponse: any = await getUserInfo();
      // let userInfo = null;
      // if (userResponse.data.code !== '200') {
      //   this.logout();
      //   return null;
      // }
      // userInfo = userResponse.data.data;
      // //获取域名
      // const response = await getOssUrl();
      // this.setOssUrl(response);
      // const config = response.data.config;
      // const ossurl = `${config.s3Endpoint}/${config.s3BucketName}/`;
      // this.setOssUrl(ossurl);
      //
      // const { roles = [] } = userInfo;
      // if (isArray(roles)) {
      //   const roleList = roles.map((item) => item.value) as RoleEnum[];
      //   this.setRoleList(roleList);
      // } else {
      //   userInfo.roles = [];
      //   this.setRoleList([]);
      // }
      // this.setUserInfo(userInfo);
      // return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {}
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      socketClient.close();
      localStorage.removeItem('hasLoaded');
      localStorage.removeItem('hasIimeLoaded');
      localStorage.removeItem('control');
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
