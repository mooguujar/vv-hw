import { defineStore } from 'pinia';
import { store } from '/@/store';
import Big from 'big.js';
import {
  CURRENCY_KEY,
  CURRENCY_LIST,
  CURRENCY_LIST_ALL,
  CURRENCY_MAP,
  CURRENCYOBJ_KEY,
} from '/@/enums/cacheEnum';
import { createLocalStorage } from '/@/utils/cache';
import { currencySetting, CURRENCY_UNIT } from '/@/settings/currencySetting';
import { useTreeListStore } from '/@/store/modules/treeList';
import { Persistent } from '/@/utils/cache/persistent';

const ls = createLocalStorage();

const lsCurrencySetting = ls.get(CURRENCY_KEY) || currencySetting;
const obj = {
  id: '701',
  name: 'CNY',
  attr: '1',
  sortlevel: '007001',
  pid: '700',
};
interface CurrencyObj {
  id: string;
  name: string;
  attr: string;
  sortlevel: string;
  pid: string;
}
interface CurrencyState {
  currency: string;
  currencyList: Array<any>;
  currencyObj: CurrencyObj;
  currencyMap: Object;
  currencyAllList: Array<any>;
}

export const useCurrencyStore = defineStore({
  id: 'app-currency',
  state: (): CurrencyState => ({
    currencyObj: ls.get(CURRENCYOBJ_KEY) || obj,
    currency: lsCurrencySetting,
    currencyList: Persistent.getLocal(CURRENCY_LIST) || [],
    currencyAllList: Persistent.getLocal(CURRENCY_LIST_ALL) || [],
    currencyMap: {},
  }),
  getters: {
    getCurrency(state) {
      return state?.currency ?? 'CNY';
    },
    getCurrencyList(state) {
      return state?.currencyList;
    },
    getCurrencyObj(state) {
      return state?.currencyObj || obj;
    },
    getCurrencyMap(state) {
      return state?.currencyMap || {};
    },
    getAllCurrencyList(state) {
      return state?.currencyAllList;
    },
  },
  actions: {
    /**
     * 货币
     * @param currency string
     */
    setCurrency(currency: string) {
      this.currency = currency;
      ls.set(CURRENCY_KEY, this.currency);
    },
    setCurrencyObj(currencyObj: CurrencyObj) {
      this.currencyObj = currencyObj;
      ls.set(CURRENCYOBJ_KEY, this.currencyObj);
    },
    setCurrencyMap(currencyMap: Object) {
      this.currencyMap = currencyMap;
      ls.set(CURRENCY_MAP, this.currencyMap);
    },
    // 获取匹配后台货币字段
    getCurrencyField(fields: Object) {
      return fields[this.getCurrency];
    },
    // 匹配币种最小精度
    getCurrencyUnit(currency: string, add: string): number {
      // 获取精度配置
      const unit = CURRENCY_UNIT[currency];
      // 获取精度小数点后的位数
      const l = unit.replace(/^[0-9]+\./, '').length || 0;
      return new Big(add).div(10).pow(l).toString();
    },
    // 获取货币列表
    async initCurrencyList() {
      const { initCurrencyTreeList } = useTreeListStore();
      await initCurrencyTreeList();
      const { getCurrencyTreeList, getAllCurrencyTreeList, initCashTypeList } = useTreeListStore();
      await initCashTypeList();

      this.currencyList = getCurrencyTreeList;
      this.currencyAllList = getAllCurrencyTreeList;

      const listMap = this.currencyAllList.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
      this.setCurrencyMap(listMap);
    },
    initCurrency() {
      this.setCurrency(lsCurrencySetting);
    },
  },
});

// Need to be used outside the setup
export function useCurrencyStoreWithOut() {
  return useCurrencyStore(store);
}
