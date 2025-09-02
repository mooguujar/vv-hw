import { defineStore } from 'pinia';
import { getTreeList, getBalanceClass } from '/@/api/member/index';
import { Persistent } from '/@/utils/cache/persistent';
import {
  CURRENCY_LIST,
  COUNTRY_LIST,
  COUNTRY_CODE_LIST,
  PAY_METHOD_LIST,
  PAY_TYPE_LIST,
  PAY_PLATFORM_LIST,
  TAG_LIST,
  CURRENCYCASHTYPE_LIST_ADD,
  CURRENCYCASHTYPE_LIST_REMOVE,
  BUSINESS_LIST,
  BUSINESS_LIST_ALL,
  CURRENCYCASHTYPE_COMMISSION_LIST_ADD,
  CURRENCYCASHTYPE_COMMISSION_LIST_REMOVE,
  CURRENCY_LIST_ALL,
  PAYMENT_CURRENCY,
  DEPOSITE_CURRENCY,
} from '/@/enums/cacheEnum';
import {
  currencyToMethodsMap,
  currentBankNameMap,
  currentProtocolNameMap,
} from '/@/settings/currencySetting';
import { getFinancePlatformList } from '/@/api/select';
import {
  getCurrencyList,
  getDepositFinanceCurrency,
  getPaymentFinanceCurrency,
} from '/@/api/finance';
import { isHasAuth } from '/@/utils/authFunction';
import { getTemplateList } from '/@/api/promotion';
import { useLocale } from '/@/locales/useLocale';

export const useTreeListStore = defineStore('treeList', {
  state: () => ({
    protocoTreeList: [], //虚拟币协议 //018001：usdt，018002：btc，019003：eth，018004：bnb，
    virtualTypeTreeList: [], // 虚拟币分类列表
    postChannelTemplateListData: [], // 虚拟币分类列表
    cnyCardTreeList: [], // 中国银行列表
    vndCardTreeList: [], // 越南银行列表
    oprationClick: [], //操作事件
    oprationModal: [],
    payMethodsTreeList: Persistent.getLocal(PAY_METHOD_LIST) || [], // 支付方式列表
    payPlatformTreeList: Persistent.getLocal(PAY_PLATFORM_LIST) || [], // 支付平台列表
    methodsCurrencyTreeList: [], // 币种关联的支付方式列表
    payTypeTreeList: Persistent.getLocal(PAY_TYPE_LIST) || [], // 支付类型列表
    countryTreeList: Persistent.getLocal(COUNTRY_LIST) || [], // 国家列表
    countryTreeCodeList: Persistent.getLocal(COUNTRY_CODE_LIST) || [], // 国家编号
    currencyTreeList: Persistent.getLocal(CURRENCY_LIST) || [], // 该站点开启的货币列表
    currencyAllTreeList: Persistent.getLocal(CURRENCY_LIST_ALL) || [], // 所有的货币列表
    tagTreeList: Persistent.getLocal(TAG_LIST) || [],
    paymentCurrencyList: Persistent.getLocal(PAYMENT_CURRENCY) || [],
    depositCurrencyList: Persistent.getLocal(DEPOSITE_CURRENCY) || [],
    // 001=数字货币分类，002=中国银行列表，003=越南银行列表，004=支付方式列表，005=支付类型列表，006=国家列表，007=币种列表，008=账变类型列表
    bankCurrencyTreeList: [], //019001：中国银行类型，019002：巴西银行类型，019003：印度银行类型，019004：越南银行类型，019005：泰国银行类型
    currencyCashTypeListAdd: Persistent.getLocal(CURRENCYCASHTYPE_LIST_ADD || []),
    currencyCashTypeListRemove: Persistent.getLocal(CURRENCYCASHTYPE_LIST_REMOVE || []),
    currencyCashTypeListcommissionAdd: Persistent.getLocal(
      CURRENCYCASHTYPE_COMMISSION_LIST_ADD || [],
    ),
    currencyCashTypeListcommissionRemove: Persistent.getLocal(
      CURRENCYCASHTYPE_COMMISSION_LIST_REMOVE || [],
    ),
    businessTypeTreeList: Persistent.getLocal(BUSINESS_LIST) || [], //资金日志业务类型
    businessTypeTreeListAll: Persistent.getLocal(BUSINESS_LIST_ALL) || [], //资金日志业务类型
    countNoticefinance: null,
  }),
  getters: {
    getdepositCurrencyList(state) {
      return state?.depositCurrencyList;
    },
    getpaymentCurrencyList(state) {
      return state?.paymentCurrencyList;
    },
    getpayPlatformTreeList(state) {
      return state?.payPlatformTreeList;
    },
    getOprationClick(state) {
      return state?.oprationClick;
    },
    getoprationModal(state) {
      return state?.oprationModal;
    },
    getPayMethodsTreeList(state) {
      return state?.payMethodsTreeList;
    },
    getMethodsCurrencyTreeList(state) {
      return state?.methodsCurrencyTreeList;
    },
    getProtocoTreeList(state) {
      return state?.protocoTreeList;
    },
    getBankCurrencyTreeList(state) {
      return state?.bank;
    },
    getPayTypeTreeList(state) {
      return state?.payTypeTreeList;
    },
    getCountryTreeList(state) {
      return state?.countryTreeList;
    },
    getCountryTreeCodeList(state) {
      return state?.countryTreeCodeList;
    },
    getCurrencyTreeList(state) {
      return state?.currencyTreeList;
    },
    getAllCurrencyTreeList(state) {
      return state?.currencyAllTreeList;
    },
    getTagTreeList(state) {
      return state?.tagTreeList;
    },
    getCashTypeListAdd(state) {
      return state?.currencyCashTypeListAdd;
    },
    getCurrencyCashTypeListcommissionAdd(state) {
      return state?.currencyCashTypeListcommissionAdd;
    },
    getCurrencyCashTypeListcommissionRemove(state) {
      return state?.currencyCashTypeListcommissionRemove;
    },
    getCashTypeListRemove(state) {
      return state?.currencyCashTypeListRemove;
    },
    getBusinessTypeTreeList(state) {
      return state?.businessTypeTreeList;
    },
    getBusinessTypeTreeListAll(state) {
      return state.businessTypeTreeListAll;
    },
    getCountNoticefinance(state) {
      return state.countNoticefinance;
    },
    getPostChannelTemplateListData(state) {
      return state.postChannelTemplateListData || [];
    },
  },
  actions: {
    async initVirtualTypeTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '001' });
        this.virtualTypeTreeList = response;
      } catch (e) {
        console.error(e);
      }
    },
    async initPostChannelTemplateList(): Promise<any> {
      try {
        const response = await getTemplateList({});
        this.postChannelTemplateListData = response.data.d;
      } catch (e) {
        console.error(e);
      }
    },
    async initCnyCardTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '002' });
        this.cnyCardTreeList = response;
      } catch (e) {
        console.error(e);
      }
    },
    async initVndCardTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '003' });
        this.vndCardTreeList = response;
      } catch (e) {
        console.error(e);
      }
    },
    async initOprationClick(): Promise<any> {
      try {
        const response = await getTreeList({ level: '022' });
        this.oprationClick = response.map((item) => {
          return { label: item.name, value: item.id };
        });
      } catch (e) {
        console.error(e);
      }
    },
    async initOprationModal(): Promise<any> {
      try {
        const response = await getTreeList({ level: '021' });
        this.oprationModal = response.map((item) => {
          return { label: item.name, value: item.id };
        });
      } catch (e) {
        console.error(e);
      }
    },
    async initPayMethodsTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '004' });
        this.payMethodsTreeList = response;
        Persistent.setLocal(PAY_METHOD_LIST, this.payMethodsTreeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initPayPlatformTreeList(): Promise<any> {
      try {
        const { d } = await getFinancePlatformList({ state: 0 });
        this.payPlatformTreeList = d;
        Persistent.setLocal(PAY_PLATFORM_LIST, this.payPlatformTreeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initMethodsCurrencyTreeList(id, isTransformResponse = true): Promise<any> {
      const level = currencyToMethodsMap[id];
      if (isTransformResponse) {
        try {
          const response = await getTreeList({ level });
          this.methodsCurrencyTreeList = response.filter(
            (item) => item.sortlevel !== currencyToMethodsMap[id],
          );
        } catch (e) {
          console.error(e);
        }
      } else {
        const response = await getTreeList({ level });
        return response.filter((item) => item.sortlevel !== currencyToMethodsMap[id]);
      }
    },
    async initBankCurrencyTreeList(id, isTransformResponse = true): Promise<any> {
      const level = currentBankNameMap[id];
      if (isTransformResponse) {
        try {
          const response = await getTreeList({ level });
          this.bankCurrencyTreeList = response.filter(
            (item) => item.sortlevel !== currentBankNameMap[id],
          );
        } catch (e) {
          console.error(e);
        }
      } else {
        const response = await getTreeList({ level });
        return response.filter((item) => item.sortlevel !== currentBankNameMap[id]);
      }
    },
    async initProtocolTreeList(id, isTransformResponse = true): Promise<any> {
      const level = currentProtocolNameMap[id];
      if (isTransformResponse) {
        try {
          const response = await getTreeList({ level });

          console.error(response);

          this.protocoTreeList = response.filter(
            (item) => item.sortlevel !== currentProtocolNameMap[id],
          );
        } catch (e) {
          console.error(e);
        }
      } else {
        const response = await getTreeList({ level });
        return response.filter((item) => item.sortlevel !== currentProtocolNameMap[id]);
      }
    },
    async initPayTypeTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '005' });
        this.payTypeTreeList = response;
        Persistent.setLocal(PAY_TYPE_LIST, this.payTypeTreeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initCountryTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '006' });
        this.countryTreeList = response;
        Persistent.setLocal(COUNTRY_LIST, this.countryTreeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initCountryTreeCodeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '011' });
        this.countryTreeCodeList = response;
        Persistent.setLocal(COUNTRY_CODE_LIST, this.countryTreeCodeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initBusinessTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '008001' });
        this.countryTreeList = response;
      } catch (e) {
        console.error(e);
      }
    },
    async initCurrencyTreeList(): Promise<any> {
      try {
        const response = await getCurrencyList({ filter: 2 });
        const allResponse = await getCurrencyList({ filter: 1 });
        const filteredResponse = response.filter((item) => item.attr == 1 || item.attr == 2);

        const filteredAllResponse = allResponse.filter((item) => item.attr == 1 || item.attr == 2);

        this.currencyTreeList = filteredResponse.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });

        this.currencyAllTreeList = filteredAllResponse.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });

        Persistent.setLocal(CURRENCY_LIST, this.currencyTreeList);
        Persistent.setLocal(CURRENCY_LIST_ALL, this.currencyAllTreeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initCashTypeList(): Promise<any> {
      try {
        var idlist = [
          { id: '10406', CashType: '806', name: '人工存款' },
          { id: '10407', CashType: '805', name: '存款掉单' },
          { id: '10408', CashType: '816', name: '人工优惠' },
          { id: '10409', CashType: '848', name: '人工返水' },
          { id: '10416', CashType: '811', name: '出款失败' },
          { id: '10410', CashType: '807', name: '测试加款' },
          { id: '10411', CashType: '810', name: '人工取款' },
          { id: '10412', CashType: '804', name: '误存取款' },
          { id: '10413', CashType: '843', name: '测试减款' },
          { id: '10414', CashType: '812', name: '其它' },
          { id: '10415', CashType: '825', name: '其它' },
        ];
        const response = await getBalanceClass();
        const mapCurrencyCashType = (data) => {
          return data.map((item) => ({
            label: item.CashTypeName,
            value: item.CashType,
            name: item.ClassName,
            ifShow: isHasAuth(idlist.filter((obj) => obj.CashType == item.CashType)[0]?.id || ''),
          }));
        };

        this.currencyCashTypeListAdd = mapCurrencyCashType(response.member_add).filter(
          (o) => o.ifShow,
        );

        this.currencyCashTypeListRemove = mapCurrencyCashType(response.member_remove).filter(
          (o) => o.ifShow,
        );
        this.currencyCashTypeListcommissionAdd = mapCurrencyCashType(response.agency_add);
        this.currencyCashTypeListcommissionRemove = mapCurrencyCashType(response.agency_remove);
        Persistent.setLocal(
          CURRENCYCASHTYPE_COMMISSION_LIST_REMOVE,
          this.currencyCashTypeListcommissionRemove,
        );
        Persistent.setLocal(
          CURRENCYCASHTYPE_COMMISSION_LIST_ADD,
          this.currencyCashTypeListcommissionAdd,
        );
        Persistent.setLocal(CURRENCYCASHTYPE_LIST_ADD, this.currencyCashTypeListAdd);
        Persistent.setLocal(CURRENCYCASHTYPE_LIST_REMOVE, this.currencyCashTypeListRemove);
      } catch (e) {
        console.error(e);
      }
    },
    async initTagTreeList(): Promise<any> {
      try {
        const response = await getTreeList({ level: '010' });
        this.tagTreeList = response;
        Persistent.setLocal(TAG_LIST, this.tagTreeList);
      } catch (e) {
        console.error(e);
      }
    },
    async initBusinessType(): Promise<any> {
      try {
        const response = await getTreeList({ level: '008' });
        const filterArray = response.filter((item) => {
          return item.pid == '800' && item.attr != '4';
        });
        const { getLocale } = useLocale();
        const selectLang = getLocale.value || 'zh_CN';
        this.businessTypeTreeListAll = response;
        const newArray = filterArray.map((item) => {
          if (typeof item.name === 'string') {
            item.name = JSON.parse(item.name); // 解析字符串
          }

          return { label: item.name[selectLang], value: item.id, attr: item.attr };
        });
        this.businessTypeTreeList = newArray;
        Persistent.setLocal(BUSINESS_LIST, this.businessTypeTreeList);
        Persistent.setLocal(BUSINESS_LIST_ALL, this.businessTypeTreeListAll);
      } catch (e) {
        console.error(e);
      }
    },
    // async initPaymentFinanceCurrency(): Promise<any> {
    //   try {
    //     const response = await getPaymentFinanceCurrency();
    //     this.paymentCurrencyList = response;
    //     Persistent.setLocal(PAYMENT_CURRENCY, this.paymentCurrencyList);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
    initPaymentFinanceCurrency(): Promise<any> {
      return getPaymentFinanceCurrency()
        .then((response) => {
          this.paymentCurrencyList = response || [];
          Persistent.setLocal(PAYMENT_CURRENCY, this.paymentCurrencyList);
          return response; // Return the response to allow further chaining
        })
        .catch((e) => {
          console.error(e);
          throw e; // Rethrow the error to allow it to be caught by any calling code
        });
    },
    initDepositCurrency(): Promise<any> {
      return getDepositFinanceCurrency()
        .then((res) => {
          this.depositCurrencyList = res || [];
          Persistent.setLocal(DEPOSITE_CURRENCY, this.depositCurrencyList);
          return res; // Return the response to allow further chaining
        })
        .catch((e) => {
          console.error(e);
          throw e; // Rethrow the error to allow it to be caught by any calling code
        });
    },
  },
});
