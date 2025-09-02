import { defineStore } from 'pinia';
import { getAllCurrencyList, getCompanyCurrencyList, getExchangeRateList } from '/@/api/finance';
import { PaymentMethodItem, UserVipItem } from '/@/api/model/financeModel';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    paymentMethods: {},
    userVips: [] as UserVipItem[],
    compantCurrencyList: [],
    rateList: {},
    rateObject: {},
  }),
  getters: {
    getRateList(state) {
      return state?.rateList ?? {};
    },
    getRateObject(state) {
      return state?.rateObject ?? {};
    },
    getPaymentMethods(state) {
      return state?.paymentMethods ?? {};
    },
  },
  actions: {
    async getCompanyCurrencyStoreList(params): Promise<any> {
      try {
        this.compantCurrencyList = await getCompanyCurrencyList(params);
      } catch (e) {
        console.error(e);
      }
    },
    async InitRateList(): Promise<any> {
      try {
        const res = await getExchangeRateList();
        this.rateObject = {
          date: '',
          rates: res,
        };
        this.rateList = res;
      } catch (e) {
        console.error(e);
      }
    },
    async InitpaymentMethods(): Promise<any> {
      try {
        const res = await getAllCurrencyList({ withdraw: 1 });
        this.paymentMethods = res;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
