import { useTreeListStore } from '/@/store/modules/treeList';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useUserStore } from '/@/store/modules/user';
import { useFinanceStore } from '/@/store/modules/finance';
import pinia from '/@/store/pinia';
import { useNoticeStore } from '../store/modules/notice';

// 登录后或刷新后初始化store数据
export function initStore() {
  // 获取所需的store实例
  const treeListStore = useTreeListStore();
  const currencyStore = useCurrencyStore();
  const financeStore = useFinanceStore();
  const userStore = useUserStore();
  const noticeStore = useNoticeStore();
  const { initCashTypeList } = useTreeListStore(pinia);

  // 从userStore获取token
  const token = userStore.getToken;
  // 如果token存在，初始化相关store
  if (token) {
    try {
      currencyStore.initCurrency();
      // 初始化货币列表
      currencyStore.initCurrencyList();
      userStore.initSiteList();
      // 初始化汇率 刷新就调用
      financeStore.InitRateList();
      // 初始化财务币种
      treeListStore.initPaymentFinanceCurrency();
      //
      treeListStore.initDepositCurrency();

      initCashTypeList();

      noticeStore.getNotice();

      treeListStore.initPayMethodsTreeList();

      treeListStore.initPayPlatformTreeList();
      // 支付平台列表
      treeListStore.initPayTypeTreeList();
      // 国家列表
      treeListStore.initCountryTreeList();
      treeListStore.initCountryTreeCodeList();
      // treeListStore.initPostChannelTemplateList();
      // 站点信息
    } catch (error) {
      // 错误处理，可能需要记录或通知
      console.error('Store initialization failed:', error);
    }
  }
}
