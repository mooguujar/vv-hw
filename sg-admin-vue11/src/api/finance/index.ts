import { defHttp } from '/@/utils/http/axios';
import {
  DeleteDepositCardParams,
  AuditRechargeParams,
  GetRechargeOrderListParams,
  depositSummaryParams,
  MerchantTreeParams,
} from '@/api/model/financeModel';

enum Api {
  GetWithdrawMerchantMist = '/finance/withdraw/merchant/list', // 出款列表排序
  withdraw_merchant_sort = '/finance/withdraw/merchant/sort', // 出款列表排序
  withdraw_type_sort = '/finance/withdraw/type/sort', // 出款方式排序
  GetExchangeRateList = '/exchange/rate/list', // 汇率获取
  GetDepositBonusList = '/finance/company/deposit/bonus', // 订单可用优惠列表
  GetCurrencyList = '/finance/currency/list', // 货币列表

  /* 在线支付 */
  GetFinanceOnlineList = '/finance/online/list', //获取在线支付列表
  UpdateFinanceOnline = '/finance/online/update', //在线支付审核更新
  InsertFinanceOnline = '/finance/online/insert', //在线支付新增订单
  GetFinanceOnlineDetail = '/finance/online/detail', //在线支付获取订单详情
  /* 在线支付 */
  /* 导出 */
  ExportOnlineList = '/finance/online/export', //在線支付导出
  ExportCompanyList = '/finance/company/deposit/export', //公司入款
  ExportDepositOnlineList = '/finance/coin/deposit/export', //貨幣入款
  ExportWithdrawList = '/finance/withdraw/export', //在線取款
  ExportcoinWithdrawList = '/finance/coin/withdraw/export', //貨幣取款
  ExportcoinTransactionList = '/finance/balance/transaction/list/export', //存取总汇
  /* 导出 */

  /* 货币入款 */
  GetFinanceCoinDepositList = '/finance/coin/deposit/list', // 订单列表
  ReviewFinanceCoinDeposit = '/finance/coin/deposit/review', // 审核更新
  InsertFinanceCoinDeposit = '/finance/coin/deposit/insert', // 新增订单
  GetFinanceCoinDepositDetail = '/finance/coin/deposit/detail', // 订单详情
  GetFinanceCoinDepositReviewCount = '/finance/coin/deposit/review/count', // 审核订单数量
  GetDepositCoinAll = '/finance/deposit/coin/all', // 虚币入款卡下拉-不分币种、不分页
  /* 货币入款 */

  /* 线上取款 */
  GetFinanceWithdrawList = '/finance/withdraw/list', // 订单列表
  ReviewFinanceWithdraw = '/finance/withdraw/review', // 审核更新
  InsertFinanceWithdraw = '/finance/withdraw/insert', // 新增订单
  GetFinanceWithdrawDetail = '/finance/withdraw/detail', // 订单详情
  GetFinanceWithdrawReviewCount = '/finance/withdraw/review/count', // 审核订单数量
  SetFinanceWithdrawSuccess = '/finance/withdraw/review/success', // 取款订单强制成功
  SetFinanceWithdrawFailed = '/finance/withdraw/review/failed', // 取款订单强制失败

  SetFinanceCoinSuccess = '/finance/coin/withdraw/review/success', // 货币取款订单强制成功
  SetFinanceCoinFailed = '/finance/coin/withdraw/review/failed', // 货币取款订单强制失败

  /* 线上取款 */

  /* 公司入款 */
  GetFinanceCompanyDepositList = '/finance/company/deposit/list', // 订单列表
  ReviewFinanceCompanyDeposit = '/finance/company/deposit/review', // 审核更新
  InsertFinanceCompanyDeposit = '/finance/company/deposit/insert', // 新增订单
  GetFinanceCompanyDepositDetail = '/finance/company/deposit/detail', // 订单详情
  GetFinanceCompanyDepositReviewCount = '/finance/company/deposit/review/count', // 审核订单数量
  /* 公司入款 */

  /* 货币取款 */
  GetFinanceCoinWithdrawList = '/finance/coin/withdraw/list', // 订单列表
  ReviewFinanceCoinWithdraw = '/finance/coin/withdraw/review', // 审核更新
  InsertFinanceCoinWithdraw = '/finance/coin/withdraw/insert', // 新增订单
  GetFinanceCoinWithdrawDetail = '/finance/coin/withdraw/detail', // 订单详情
  GetFinanceCoinWithdrawReviewCount = '/finance/coin/withdraw/review/count', // 审核订单数量
  /* 货币取款 */

  /* 入款卡管理 */
  GetMerchantTreeById = '/tree/list', // //获取分类列表(sg)
  InsertBankcard = '/finance/deposit/bankcard/insert', // 新增入款卡管理(sg)
  UpdateBankcard = '/finance/deposit/bankcard/update', // 修改入款卡管理(sg)
  GetTransaction = '/finance/balance/transaction/list', // 存取总汇(sg)其它用
  GetTransactionLisnew = '/finance/transaction/list', // 存取总汇(sg)用
  GetBankcardList = '/finance/deposit/bankcard/list', // 入款卡管理-列表(sg)
  DelBankcardList = '/finance/deposit/bankcard/delete', // 入款卡管理-删除
  StateBankcardList = '/finance/deposit/bankcard/updatestate', // 入款卡管理-状态
  SortBankcardList = '/finance/deposit/bankcard/sort', // 排序接口
  GetBankcardListAll = '/finance/deposit/bankcard/all', // 入款卡下拉-不分币种
  GetBankList = '/finance/deposit/bank/list', // 获取银行列表
  /* 入款卡管理 */

  /* 支付管理 */
  GetPaymentMerchantList = '/finance/payment/merchant/list', // 支付平台列表
  GetPaymentMerchantDetail = '/finance/payment/merchant/detail', // 支付平台详情
  GetCompanyCurrencyList = '/finance/deposit/company/currency/list', // 支付平台联动清单
  GetMethodCompanyList = '/finance/deposit/method/company/list', // 支付方式联动清单
  InsertPaymentMerchant = '/finance/payment/merchant/insert', // 支付平台新增
  UpdatePaymentMerchant = '/finance/payment/merchant/update', // 支付平台修改
  UpdateModifyMerchant = '/finance/payment/merchant/modify', // 支付平台修改
  UpdatePaymentMerchantState = '/finance/payment/merchant/updatestate', // 支付平台修改状态
  DelPaymentMerchant = '/finance/payment/method/delete', // 支付平台删除
  GetPaymentMerchantPromoList = '/finance/payment/merchant/promo/list', // 优惠配置列表
  GetPaymentMerchantV2PromoList = '/finance/payment/promo/v2/list', // 优惠配置列表
  UpdatePaymentMerchantPromo = '/finance/payment/merchant/promo/update', // 优惠配置-新增和修改
  UpdatePromoPayment = '/finance/payment/promo/update', // 优惠配置-新增和修改
  GetPaymentMethodList = '/finance/payment/method/list', // 支付方式-列表
  UpdateMethodTagMerchant = '/finance/payment/method/tag/update', // 支付方式-添加/修改标签
  SortmethodList = '/finance/payment/method/sort', // 排序接口
  GetWithdrawMerchant = '/finance/withdraw/merchant', // 在线取款-代付下拉
  GetOptionReason = '/finance/withdraw/merchant/reject/reason', // 拒绝原因
  GetWithdrawCoinMerchant = '/finance/coin/withdraw/merchant', // 货币取款-代付下拉
  UpdateBankcardPromo = '/finance/payment/bankcard/promo/update', // 入款卡优惠配置新增或是更新
  GetBankcardPromolist = '/finance/payment/bankcard/promo/list', // 入款卡优惠设置列表
  // SortBankcardList = '/finance/deposit/bankcard/sort', // 法币入款卡和虚拟币-排序

  /* 支付管理 */

  /* 支付配置 */
  GetAllCurrencyList = '/finance/payment/method/all/currency', // 支付方式列表
  GetAllMethodList = '/finance/payment/merchant/all/method', // 支付平台列表
  InsertSetting = '/finance/payment/setting/insert', // 支付配置-添加
  SettingList = '/finance/payment/setting/list', // 支付配置-列表
  DeleteSetting = '/finance/payment/setting/delete', // 支付配置-删除
  DetailSetting = '/finance/payment/setting/detail', // 支付配置-详情
  UpdateSetting = '/finance/payment/setting/update', // 支付配置-修改
  PaymentSettingDetail = '/finance/payment/setting/show', //支付配置多币种的详情
  PaymentSettingLevel = '/finance/payment/setting/level', //支付配置多币种的详情

  GetWithdrawFee = '/finance/withdraw/fee/get', //取得出款手续费配置
  UpdateWithdrawFee = '/finance/withdraw/fee/update', //设置出款手续费配置
  /* 支付配置*/

  /* 支付配置 */
  GetwithdrawList = '/finance/withdraw/merchant/list', // 代付列表
  InsertWithdraw = '/finance/withdraw/merchant/insert', // 代付-新增
  updateWithdraw = '/finance/withdraw/merchant/update', // 代付-编辑
  updateState = '/finance/withdraw/merchant/update/state', // 代付-状态
  DeleteState = '/finance/withdraw/merchant/delete', // 删除
  updateMerchantWithdraw = '/finance/withdraw/merchant/update', //  代付-授信额度
  updateMerchantWithdrawCredit = '/finance/withdraw/merchant/update/credit', //  代付-授信额度
  GetwithdrawTypeCurrency = '/finance/withdraw/type/currency', // 出款管理-列表
  withdraw_merchant_balance = '/finance/withdraw/merchant/balance', // 出款管理-余额
  updatewithdrawTypeState = '/finance/withdraw/type/update', // 出款管理 - 状态更新
  NoticeFinanceCount = '/finance/notice/count', //未处理订单计数
  /* 支付配置*/

  /* 充币 */
  GetSiteDeposit = '/site/deposit/merchant', //商户-充值功能-取得支付通道
  TopSiteDeposit = '/site/deposit', //商户充值-发起三方订单、商户存款订单入库
  GetPromoList = '/site/finance/promo/list', //商户充值-发起三方订单、商户存款订单入库
  GetfinanceBalance = '/site/finance/balance', //商户馀额的接口~
  GetSiteDetailMaintain = '/zk/site/detail/maintain', //验证身份
  /* 充币 */
  GetDepositBankList = '/finance/deposit/bank/list', //获取在线支付列表
  SortFinanceCurrency = '/finance/currency/sort', // 货币排序

  /* 财务币种 */
  PaymentFinanceCurrency = '/finance/payment/merchant/currency', // 货币顺序
  DepositFinanceCurrency = '/finance/deposit/currency', // 货币顺序

  /* 货币顺序 */
  GetFinanceLatest = '/finance/currency/latest', // 货币顺序

  ClearwithdrawAmount = '/finance/member/clear/withdraw/bet/amount', // 取款打码清除接口
}

// 货币通知
export const getFinanceLatest = () => {
  return defHttp.post({ url: Api.GetFinanceLatest });
};

// 货币列表
export const getDepositFinanceCurrency = () => {
  return defHttp.get({ url: Api.DepositFinanceCurrency });
};

// 货币列表
export const getPaymentFinanceCurrency = () => {
  return defHttp.get({ url: Api.PaymentFinanceCurrency });
};

// 货币列表
export const getCurrencyList = (params: any) => {
  return defHttp.get({ url: Api.GetCurrencyList, params });
};

/* 充币 */

export const getfinanceBalance = (params: any) => {
  return defHttp.post({ url: Api.GetfinanceBalance, params });
};

/* 验证身份 */

export const getSiteDetailMaintain = (params: any) => {
  return defHttp.get({ url: Api.GetSiteDetailMaintain, params });
};

export const getPromoList = () => {
  return defHttp.get({ url: Api.GetPromoList });
};

export const getSiteDeposit = (params: any) => {
  return defHttp.post({ url: Api.GetSiteDeposit, params });
};
export const topSiteDeposit = (params: any) => {
  return defHttp.post({ url: Api.TopSiteDeposit, params }, { isTransformResponse: false });
};
/* 充币 */

/* 货币排序 */
export const sortFinanceCurrency = (params: any) => {
  return defHttp.post({ url: Api.SortFinanceCurrency, params }, { isTransformResponse: false });
};

/* 在线支付 */

//设置出款手续费配置
export const updateBankcardPromo = (params: any) => {
  return defHttp.post({ url: Api.UpdateBankcardPromo, params }, { isTransformResponse: false });
};

//入款卡优惠设置列表
export const getBankcardPromolist = (params: any) => {
  return defHttp.get({ url: Api.GetBankcardPromolist, params }, { isTransformResponse: false });
};

//取得出款手续费配置
export const getWithdrawFee = () => {
  return defHttp.get({ url: Api.GetWithdrawFee });
};

//设置出款手续费配置
export const updateWithdrawFee = (params: any) => {
  return defHttp.post({ url: Api.UpdateWithdrawFee, params }, { isTransformResponse: false });
};

//在线支付获取详情
export const getDepositBonusList = (params: any) => {
  return defHttp.get({ url: Api.GetDepositBonusList, params });
};

// 汇率接口
export const getExchangeRateList = () => {
  return defHttp.get({ url: Api.GetExchangeRateList });
};

//出款管理-列表
export const getwithdrawTypeCurrency = (params: any) => {
  return defHttp.get({ url: Api.GetwithdrawTypeCurrency, params });
};

//出款管理 余额刷新
export const withdraw_merchant_balance = (params: any) => {
  return defHttp.post({ url: Api.withdraw_merchant_balance, params });
};

//出款管理 - 状态更新
export const updateWithdrawTypeState = (params: any) => {
  return defHttp.post({ url: Api.updatewithdrawTypeState, params }, { isTransformResponse: false });
};

//在线支付列表
export const getFinanceOnlineList = (params: any) => {
  return defHttp.post({ url: Api.GetFinanceOnlineList, params });
};

//在线支付订单更新
export const updateFinanceOnline = (params: any) => {
  return defHttp.post({ url: Api.UpdateFinanceOnline, params }, { isTransformResponse: false });
};

//在线支付新增订单
export const insertFinanceOnline = (params: any) => {
  return defHttp.post({ url: Api.InsertFinanceOnline, params }, { isTransformResponse: false });
};

//在线支付获取详情
export const getFinanceOnlineDetail = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceOnlineDetail, params });
};
/* 在线支付 */
/* 货币入款 */
export const getFinanceCoinDepositList = (params: any) => {
  return defHttp.post({ url: Api.GetFinanceCoinDepositList, params });
};
export const reviewFinanceCoinDeposit = (params: any) => {
  return defHttp.post(
    { url: Api.ReviewFinanceCoinDeposit, params },
    { isTransformResponse: false },
  );
};
export const insertFinanceCoinDeposit = (params: any) => {
  return defHttp.post(
    { url: Api.InsertFinanceCoinDeposit, params },
    { isTransformResponse: false },
  );
};
export const getFinanceCoinDepositDetail = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceCoinDepositDetail, params });
};
export const getFinanceCoinDepositReviewCount = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceCoinDepositReviewCount, params });
};
/* 货币入款 */
/* 线上取款 */
export const getFinanceWithdrawList = (params: any) => {
  return defHttp.post({ url: Api.GetFinanceWithdrawList, params });
};
export const reviewFinanceWithdraw = (params: AuditRechargeParams) => {
  return defHttp.post({ url: Api.ReviewFinanceWithdraw, params }, { isTransformResponse: false });
};
export const insertFinanceWithdraw = (params: any) => {
  return defHttp.post({ url: Api.InsertFinanceWithdraw, params }, { isTransformResponse: false });
};
export const getFinanceWithdrawDetail = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceWithdrawDetail, params });
};
export const getFinanceWithdrawReviewCount = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceWithdrawReviewCount, params });
};

export const setFinanceWithdrawSuccess = (params: any) => {
  return defHttp.post(
    { url: Api.SetFinanceWithdrawSuccess, params },
    { isTransformResponse: false },
  );
};

export const setFinanceWithdrawFailed = (params: any) => {
  return defHttp.post(
    { url: Api.SetFinanceWithdrawFailed, params },
    { isTransformResponse: false },
  );
};

export const setFinanceCoinSuccess = (params: any) => {
  return defHttp.post({ url: Api.SetFinanceCoinSuccess, params }, { isTransformResponse: false });
};

export const setFinanceCoinFailed = (params: any) => {
  return defHttp.post({ url: Api.SetFinanceCoinFailed, params }, { isTransformResponse: false });
};

/* 线上取款 */
/* 公司入款 */
export const getFinanceCompanyDepositList = (params: any) => {
  return defHttp.post({ url: Api.GetFinanceCompanyDepositList, params });
};
export const reviewFinanceCompanyDeposit = (params: any) => {
  return defHttp.post(
    { url: Api.ReviewFinanceCompanyDeposit, params },
    { isTransformResponse: false },
  );
};
export const insertFinanceCompanyDeposit = (params: any) => {
  return defHttp.post(
    { url: Api.InsertFinanceCompanyDeposit, params },
    { isTransformResponse: false },
  );
};
export const getFinanceCompanyDepositDetail = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceCompanyDepositDetail, params });
};
export const getFinanceCompanyDepositReviewCount = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceCompanyDepositReviewCount, params });
};
/* 公司入款 */
/* 货币取款 */
export const getFinanceCoinWithdrawList = (params: any) => {
  return defHttp.post({ url: Api.GetFinanceCoinWithdrawList, params });
};
export const reviewFinanceCoinWithdraw = (params: any) => {
  return defHttp.post(
    { url: Api.ReviewFinanceCoinWithdraw, params },
    { isTransformResponse: false },
  );
};
export const insertFinanceCoinWithdraw = (params: any) => {
  return defHttp.post(
    { url: Api.InsertFinanceCoinWithdraw, params },
    { isTransformResponse: false },
  );
};
export const getFinanceCoinWithdrawDetail = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceCoinWithdrawDetail, params });
};
export const getFinanceCoinWithdrawReviewCount = (params: any) => {
  return defHttp.get({ url: Api.GetFinanceCoinWithdrawReviewCount, params });
};
/* 货币取款 */

//获取分类列表(sg)
export const getMerchantTreeById = (params: MerchantTreeParams) => {
  return defHttp.get({ url: Api.GetMerchantTreeById, params });
};

//入款卡管理-列表(sg)
export const getBankcardList = (params: any) => {
  return defHttp.post({ url: Api.GetBankcardList, params });
};

//入款卡管理-列表(sg)
export const getBankcardListAll = (params: any) => {
  return defHttp.get({ url: Api.GetBankcardListAll, params });
};

//获取银行卡列表
export const getBankList = (params: any) => {
  return defHttp.get({ url: Api.GetBankList, params });
};

// 虚币入款卡下拉-不分币种、不分页
export const getDepositCoinAll = (params: any) => {
  return defHttp.get({ url: Api.GetDepositCoinAll, params });
};

//入款卡管理-列表 排序(sg)
// export const sortBankcardList = (params: any) => {
//   return defHttp.post(
//     { url: Api.SortBankcardList, params },
//     { errorMessageMode: 'none', isTransformResponse: false },
//   );
// };

//入款卡管理-列表 排序(sg)
export const sortmethodList = (params: any) => {
  return defHttp.post(
    { url: Api.SortmethodList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//法币入款卡和虚拟币-排序
export const sortBankcardList = (params: any) => {
  return defHttp.post(
    { url: Api.SortBankcardList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//修改入款卡管理(sg)
export const updateBankcard = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateBankcard, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//新增入款卡管理(sg)
export const insertBankcard = (params: any) => {
  return defHttp.post(
    { url: Api.InsertBankcard, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//删除入款卡管理(sg)
export const delBankcardList = (params: any) => {
  return defHttp.post(
    { url: Api.DelBankcardList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//状态入款卡管理(sg)
export const stateBankcardList = (params: any) => {
  return defHttp.post(
    { url: Api.StateBankcardList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取存取总汇(sg)
export const getTransactionList = (params: any) => {
  return defHttp.post({ url: Api.GetTransaction, params });
};

//获取存取总汇(sg)
export const getTransactionLisnew = (params: any) => {
  return defHttp.post({ url: Api.GetTransactionLisnew, params });
};

/* 支付管理 */
export const getPaymentMerchantList = (params: any) => {
  return defHttp.get({ url: Api.GetPaymentMerchantList, params });
};

/* 支付方式列表 */
export const getAllCurrencyList = (params: any) => {
  return defHttp.get({ url: Api.GetAllCurrencyList, params });
};

/* 支付平台列表 */
export const getAllMethodList = () => {
  return defHttp.get({ url: Api.GetAllMethodList });
};

//支付配置-添加
export const updateSetting = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateSetting, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//支付配置-修改
export const insertSetting = (params: any) => {
  return defHttp.post(
    { url: Api.InsertSetting, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

/* 支付配置-列表 */
export const getSettingList = (params: any) => {
  return defHttp.get({ url: Api.SettingList, params });
};

/* 删除支付方式 */
export const deleteSetting = (params: any) => {
  return defHttp.get(
    { url: Api.DeleteSetting, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

/* 支付平台列表 */
export const detailSetting = (params: any) => {
  return defHttp.get({ url: Api.DetailSetting, params });
};

/* 支付配置的多币种的详情 */
export const paymentSettingDetail = (params: any) => {
  return defHttp.get({ url: Api.PaymentSettingDetail, params });
};
//代付-新增
export const insertWithdraw = (params: any) => {
  return defHttp.post(
    { url: Api.InsertWithdraw, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 代付-编辑
export const updateWithdraw = (params: any) => {
  return defHttp.post(
    { url: Api.updateWithdraw, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 代付-列表
export const getwithdrawList = (params: any) => {
  return defHttp.get({ url: Api.GetwithdrawList, params });
};

// 支付配置-列表
export const PaymentSettingLevel = () => {
  return defHttp.get({ url: Api.PaymentSettingLevel });
};

// 代付-更新状态
export const updateState = (params: any) => {
  return defHttp.get(
    { url: Api.updateState, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 代付-删除
export const deleteState = (params: any) => {
  return defHttp.get(
    { url: Api.DeleteState, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//代付-授权额度
export const updateMerchantWithdraw = (params: any) => {
  return defHttp.post(
    { url: Api.updateMerchantWithdraw, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//代付-授权额度
export const updateMerchantWithdrawCredit = (params: any) => {
  return defHttp.post(
    { url: Api.updateMerchantWithdrawCredit, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const getPaymentMerchantDetail = (params: any) => {
  return defHttp.get({ url: Api.GetPaymentMerchantDetail, params });
};
export const getCompanyCurrencyList = (params: any) => {
  return defHttp.get({ url: Api.GetCompanyCurrencyList, params });
};

export const getWithdrawMerchant = (params: any) => {
  return defHttp.get({ url: Api.GetWithdrawMerchant, params });
};
export const getOptionReasonApi = (params: any) => {
  return defHttp.get({ url: Api.GetOptionReason, params });
};
export const getWithdrawCoinMerchant = (params: any) => {
  return defHttp.get({ url: Api.GetWithdrawCoinMerchant, params });
};

export const getMethodCompanyList = (params: any) => {
  return defHttp.get({ url: Api.GetMethodCompanyList, params });
};
export const insertPaymentMerchant = (params: any) => {
  return defHttp.post(
    { url: Api.InsertPaymentMerchant, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
export const updatePaymentMerchant = (params: any) => {
  return defHttp.post(
    { url: Api.UpdatePaymentMerchant, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const updateModifyMerchant = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateModifyMerchant, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const updatePaymentMerchantState = (params: any) => {
  return defHttp.get(
    { url: Api.UpdatePaymentMerchantState, params },
    { isTransformResponse: false },
  );
};
export const delPaymentMerchant = (params: any) => {
  return defHttp.get({ url: Api.DelPaymentMerchant, params }, { isTransformResponse: false });
};
export const getPaymentMerchantPromoList = (params: any) => {
  return defHttp.get(
    { url: Api.GetPaymentMerchantPromoList, params },
    { isTransformResponse: false },
  );
};

export const getPaymentMerchantV2PromoList = (params: any) => {
  return defHttp.get(
    { url: Api.GetPaymentMerchantV2PromoList, params },
    { isTransformResponse: false },
  );
};

export const updatePaymentMerchantPromo = (params: any) => {
  return defHttp.post(
    { url: Api.UpdatePaymentMerchantPromo, params },
    { isTransformResponse: false },
  );
};

export const updatePromoPayment = (params: any) => {
  return defHttp.post({ url: Api.UpdatePromoPayment, params }, { isTransformResponse: false });
};

export const getPaymentMethodList = (params: any) => {
  return defHttp.get({ url: Api.GetPaymentMethodList, params });
};
export const updateMethodTagMerchant = (params: DeleteDepositCardParams) => {
  return defHttp.post({ url: Api.UpdateMethodTagMerchant, params }, { isTransformResponse: false });
};
/* 支付管理 */

export const exportRechargeList = (params: GetRechargeOrderListParams) => {
  return defHttp.post(
    { url: '', params, responseType: 'arraybuffer' },
    { isReturnNativeResponse: true },
  );
};

export const exportDepositSummartList = (params: depositSummaryParams) => {
  return defHttp.post(
    { url: '', params, responseType: 'arraybuffer' },
    { isReturnNativeResponse: true },
  );
};

export const noticeFinanceCount = () => {
  return defHttp.get({ url: Api.NoticeFinanceCount });
};

/*  导出 */
export const exportOnlineList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportOnlineList, params },
    { isTransformResponse: false, isExport: true },
  );
};
export const exportCompanyList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportCompanyList, params },
    { isTransformResponse: false, isExport: true },
  );
};
export const exportDepositOnlineList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportDepositOnlineList, params },
    { isTransformResponse: false, isExport: true },
  );
};
export const exportWithdrawList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportWithdrawList, params },
    { isTransformResponse: false, isExport: true },
  );
};
export const exportcoinWithdrawList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportcoinWithdrawList, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportcoinTransactionList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportcoinTransactionList, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const getDepositBankList = (params: any) => {
  return defHttp.get({ url: Api.GetDepositBankList, params });
};

export const GetWithdrawMerchantMist = (params: any) => {
  return defHttp.get({ url: Api.GetWithdrawMerchantMist, params });
};

export const withdraw_type_sort = (params: any) => {
  return defHttp.post(
    { url: Api.withdraw_type_sort, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const withdraw_merchant_sort = (params: any) => {
  return defHttp.post(
    { url: Api.withdraw_merchant_sort, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const clearwithdrawAmount = (params: any) => {
  return defHttp.post(
    { url: Api.ClearwithdrawAmount, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
