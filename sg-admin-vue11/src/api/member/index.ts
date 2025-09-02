import { defHttp } from '/@/utils/http/axios';
import {
  inquireParams,
  UpdateParams,
  saveParams,
  outpayParams,
  payPwdParams,
  sysParams,
  logParams,
  vipAddParams,
  EnableParams,
  deleParams,
  userListparams,
  EnableUpdataParams,
  memberIdParams,
  getLevelListParams,
  addLevelParams,
  detailsParams,
  cashtypeParams,
  treeParams,
  funParams,
  batchParams,
  importParams,
  bankSateRarams,
  updataBatchParams,
  updataBatchVipParams,
  existParams,
  getMemberIdParams,
  historyParams,
  UpdateStateParams,
} from '../model/memberModel';

enum Api {
  /*  公共分类 */
  GetTreeList = '/tree/list', //获取公共字典{国家，货币种类}
  GetTransactionTypeList = '/finance/balance/transaction/types', //财务管理获取业务类型（存取总汇）
  GetNoticeList = '/badge/notify', //徽章消息数量查询
  /* 公共分类 */
  /* 会员列表 */
  getMemberList = '/member/list', //获取会员列表
  UservEnable = '/member/update/state', //开启/停用会员
  bonusEnable = '/member/update/bonus/state', //更改反水状态
  userSave = '/member/insert', //新增会员
  UpdateMember = '/member/update', // 修改会员
  getByMemberId = '/member/agent/search', //代理列表模糊搜索
  GetMemberUpdateDetail = '/member/update/detail', // 拉取修改会员详情
  ResetMemberLoginPassword = '/member/reset/login/password', // 会员重置密码
  GetMemberDetails = '/member/detail', //获取查看会员详情
  GetLinkedList = '/member/linked/list', //关联账号
  Getbalance = '/member/balance', //账号余额获取
  GetbalanceLocker = '/member/balance/locker', //刷新保险库余额
  ExistsMember = '/member/exists', //校验会员名是否存在
  UpdatestateMember = '/member/update/state', //会员状态修改
  GetMerchantNote = '/member/note',

  update_bonus = '/member/update/bonus', //优惠正常
  update_commission = '/member/update/commission', //返佣正常
  update_rebate = '/member/update/rebate', //返水正常

  GetBalanceAgency = '/member/balance/agency', //会员代理余额
  GetFundsDetailLog = '/member/detail/funds/log', //会员详情-资金日志
  GetBalanceTransaction = '/member/detail/balance/transaction', //会员详情-帐变记录
  GetBalanceTransaction1 = '/member/platform/balance/transaction', //会员详情-帐变记录
  GetFundsListLog = '/member/funds/log/list',
  GetMemberReanameist = '/member/name', //获取姓名下拉
  GetMemberLevelLog = '/member/level/log/list', //会员层级列表日志
  /* 会员编辑 */
  userPwd = '/member/reset/login/password', //重置用户密码
  googlePwd = '/member/reset/google/password', //重置谷歌密码
  resetpayPwd = '/member/reset/pay/password', //重置资金密码
  exportMemList = '/member/export', //导出会员
  ImportMemberModule = '/member/import', //导出会员
  GetHistoryListNote = '/member/note/list', //历史备注列表
  UpdateBatchMember = '/member/batch/update', //批量修改会员 /member/batch/update
  /* 会员列表 */

  /* VIP等级 */
  GetVipUserList = '/member/vip/level/list/v2', // VIP等级列表
  // AddVip = '/member/vip/level/insert', // 新增VIP等级
  AddVip = '/member/vip/level/update', // 新增VIP等级
  UpdateVip = '/member/vip/level/update', // 编辑VIP等级
  GetVipLevelSelect = '/member/vip/level/list/v2', // VIP等级下拉列表
  GetMemberVipCurrency = '/member/vip/currency/list', //VIP等级币种汇率
  SetMemberCurrency = '/member/vip/currency/set', //VIP经验汇率设置
  GetPlatefromAll = '/platform/all', //获取平台游戏列表
  GetBonusList = '/member/vip/bonus/list', //VIP等级领取记录
  UpdateMemberVip = '/member/vip/update/batch', //VIP层级修改
  GetMemberListLevel = '/report/member/total', //VIP等级列表
  GetDetailVipConfig = '/member/vip/multiple/list', //vip倍率配置
  UpdateVipConfig = '/member/vip/multiple/update', //VIP倍率修改
  UpdateLevelVip = '/member/vip/level/update', // VIP编辑
  // InsertVipLevel = '/member/vip/level/insert', //新增VIP等级
  InsertVipLevel = '/member/vip/level/update', //新增VIP等级
  DeleteVipLevel = '/member/vip/level/delete', //删除VIP等级
  GetVipLevelList = '/member/vip/base/list', //等级列表
  UpdateRebateLevel = '/member/vip/level/update/rebate', // VIP返水配置
  GetConfigMemberVip = '/member/vip/config/list', //VIP配置列表
  UpdateConfigMemberVip = '/member/vip/config/update', //VIP配置修改
  UpdateVipBase = '/member/vip/base/update', //VIP等级修改
  UpdateVipRebate = '/member/vip/rebate/update', //VIP 反水结算
  UpdateVipRebateWay = '/member/vip/config/rebate/update', //VIP 反水发送方式
  UpdateVipUpdate = '/member/vip/config/update', //VIP 反水发送方式
  GetRebateVipList = '/member/vip/rebate/list', //反水配置列表
  UpdataRebateConig = '/member/vip/config/rebate/update', //反水配置方式
  GetMemberVIPList = '/member/vip/nav', //VIP列表
  DeleteBasicVip = '/member/vip/base/delete', //删除VIP等级
  GetMemberRebateConfig = '/member/rebate/config', //获取VIP设置配置
  UpdateMeberConfigRebate = '/member/rebate/config/update', //更新VIP等级
  /* VIP等级 */
  /** 奖金 */
  UpdateVipPrize = '/member/vip/prize/update',
  GetPrizeLevelList = '/member/vip/prize/list',
  UpdateScoreConfig = '/member/vip/config/score/update',
  InsertBaseVip = '/member/vip/base/insert', //VIP新增
  UpdatePrizeConfig = '/member/vip/config/prize/update',

  /* 会员层级 */
  GetLevelList = '/member/level/list', //获取会员层级列表
  InsertLevel = '/member/level/insert', //会员层级添加
  GetLevelSelect = '/member/level/select', //会员层级下拉
  UpdateLevel = '/member/level/update', //编辑会员层级
  DeleteLevel = '/member/level/delete', //删除会员层级
  UpdateMemberLevel = '/member/level/update/batch', //会员层级修改
  /* 会员层级 */

  /* 会员日志 */
  GetAmountLogPage = '/member/funds/log/list', //资金日志
  GetloginList = '/member/login/log/list', //登录日志
  GetuOperationList = '/member/operation/log/list', //操作日志
  GetMemberLogVip = '/member/vip/log/list', //VIP变更日志
  GetPaymentTransferList = '/finance/payment/balance/transfer/list', //兑换日志
  ExportLevelLog = '/member/level/log/export', //导出日志
  /* 会员日志 */

  /* 出款卡管理 */
  GetOutpayList = '/member/bankcard/list', //获取出款卡银行卡列表
  GetWalletList = '/member/wallet/list', //获取钱包列表
  UpdateBankState = '/member/bankcard/update/state', //银行卡停用/启用
  member_bankcard_update = '/member/bankcard/update', //银行卡编辑
  bankcard_delete = '/member/bankcard/delete', //银行卡删除
  UpdateWalletState = '/member/wallet/update/state', //虚拟币停用/启用
  /* 出款卡管理 */
  /*加减款*/
  BalanceUpdate = '/member/balance/adjust', //加减款更新
  GetBalanceClass = '/member/balance/adjust/class', //加减款类型
  BatchBalanceUpdate = '/member/balance/adjust/batch', //批量加减款
  GetbalanceMember = '/member/balance/all', //加款余额显示
  /*打码详情*/
  GetBetDetail = '/member/detail/bet/detail', //打码详情
  /*打码详情*/
  GetBetDetailchannel = '/member/channel/detail', //打码详情
  GetMemberNameList = '/member/name', //模糊搜索
  /*场馆余额列表*/
  GetBalanceVenues = '/game/venue/balance',
  SetBalanceRecycle = '/game/venue/balance/recycle',
  /*场馆列表*/
  GetTransferGameList = '/game/venue/transfer/list',
  /*返水列表 */
  GetMemberRebateList = '/member/rebate/sum/list',

  GetReviewCount = '/promo/review/count',
}

/**
 * @description: Get user menu based on id
 */
//获取会员列表
export const getMemberList = (params: inquireParams) => {
  return defHttp.post({ url: Api.getMemberList, params });
};

// 会员（活跃会员）停用
export const uservEnable = (params: EnableUpdataParams) => {
  return defHttp.post(
    { url: Api.UservEnable, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 反水 （正常）停用
export const bonusEnable = (params: EnableParams) => {
  return defHttp.post(
    { url: Api.bonusEnable, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//导出会员
export const exportMemList = (params: importParams) => {
  return defHttp.post(
    { url: Api.exportMemList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//导入会员
export const importMemberModule = (params: importParams) => {
  return defHttp.post(
    { url: Api.ImportMemberModule, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//备注历史列表 GetListNote
export const getHistoryListNote = (params: historyParams) => {
  return defHttp.post({ url: Api.GetHistoryListNote, params });
};
//会员层级修改
export const updateMemberLevel = (params: updataBatchParams) => {
  return defHttp.post(
    { url: Api.UpdateMemberLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//层级日志到出
export const exportLevelLog = (params: updataBatchParams) => {
  return defHttp.post(
    { url: Api.ExportLevelLog, params },
    { isTransformResponse: false, isExport: true },
  );
};
//GetLevelLogExport
//会员层级列表
export const getMemberLevelLog = (params: inquireParams) => {
  return defHttp.post({ url: Api.GetMemberLevelLog, params });
};

//会员层级列表
export const getMemberListLevel = (params: inquireParams) => {
  return defHttp.post({ url: Api.GetMemberListLevel, params });
};
//VIP层级修改

export const updateMemberVip = (params: updataBatchVipParams) => {
  return defHttp.post(
    { url: Api.UpdateMemberVip, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
export const updateVipPrize = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateVipPrize, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//VIP编辑
export const updateVipBase = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateVipBase, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//新增VIP
export const updateLevelVip = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateLevelVip, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//新增VIP
export const deleteLevelVip = (params: any) => {
  return defHttp.get(
    { url: Api.DeleteVipLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取VIP列表
export const getMemberVIPList = () => {
  return defHttp.get({ url: Api.GetMemberVIPList });
};
//
export const insertBaseVip = (params: any) => {
  return defHttp.post(
    { url: Api.InsertBaseVip, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//VIP配置列表
export const getConfigMemberVip = (params: any) => {
  return defHttp.get({ url: Api.GetConfigMemberVip, params });
};
//VIP反水配置
export const updateVipRebateWay = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateVipRebateWay, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
/**
 * vip批量修改
 * @param params
 * @returns
 */
export const updateVipUpdate = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateVipUpdate, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//批量修改会员状态
export const updateBatchMember = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateBatchMember, params },
    { errorMessageMode: '', isTransformResponse: false },
  );
};

//VIP发放方式更新
export const updateVipRebate = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateVipRebate, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//VIP反水配置
export const updataRebateConig = (params: any) => {
  return defHttp.post(
    { url: Api.UpdataRebateConig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//UpdataRebateConig
//反水配置列表
export const getRebateVipList = (params: any) => {
  return defHttp.get({ url: Api.GetRebateVipList, params });
};
export const deleteBasicVip = (params: any) => {
  return defHttp.get(
    { url: Api.DeleteBasicVip, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const updateRebateLevel = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateRebateLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取VIp等级列表
export const getVipLevelList = () => {
  return defHttp.get({ url: Api.GetVipLevelList });
};

//获取奖金等级列表
export const getPrizeLevelList = (params: cashtypeParams) => {
  return defHttp.get({ url: Api.GetPrizeLevelList, params });
};

export const insertVipLevel = (params: any) => {
  return defHttp.post(
    { url: Api.InsertVipLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//积分配置更新
export const updateScoreConfig = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateScoreConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//奖金条件更新
export const updatePrizeConfig = (params: any) => {
  return defHttp.post(
    { url: Api.UpdatePrizeConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//
//获取VIP倍率配置
export const getDetailVipConfig = () => {
  return defHttp.get({ url: Api.GetDetailVipConfig });
};
//更新倍率配置
export const updateVipConfig = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateVipConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
// 会员新增
export const userSave = (params: saveParams) => {
  return defHttp.post(
    { url: Api.userSave, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//修改会员
export const updateMember = (params: UpdateParams) => {
  return defHttp.post(
    { url: Api.UpdateMember, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//获取会员修改详情
export const getMemberUpdateDetail = (params: detailsParams) => {
  return defHttp.get({ url: Api.GetMemberUpdateDetail, params });
};

export const resetMemberLoginPassword = (params) => {
  return defHttp.get({ url: Api.ResetMemberLoginPassword, params }, { isTransformResponse: false });
};

//会员资金日志
export const getFundsListLog = (params: funParams) => {
  return defHttp.post({ url: Api.GetFundsListLog, params });
};
//优惠正常
export const update_bonus = (params: UpdateStateParams) => {
  return defHttp.post(
    { url: Api.update_bonus, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//返佣正常
export const update_commission = (params: UpdateStateParams) => {
  return defHttp.post(
    { url: Api.update_commission, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//返水正常
export const update_rebate = (params: UpdateStateParams) => {
  return defHttp.post(
    { url: Api.update_rebate, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//会员状态修改
export const updatestateMember = (params: UpdateStateParams) => {
  return defHttp.post(
    { url: Api.UpdatestateMember, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const getMerchantNote = (params: any) => {
  return defHttp.post(
    { url: Api.GetMerchantNote, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//会员余额代理
export const getBalanceAgency = (params) => {
  return defHttp.get(
    { url: Api.GetBalanceAgency, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//新增VIP等级 /member/vip_level/insert
export const addVip = (params: vipAddParams) => {
  return defHttp.post(
    { url: Api.AddVip, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
// 获取会员查看详情
export const getMemberDetails = (params: detailsParams) => {
  return defHttp.get({ url: Api.GetMemberDetails, params });
};

//VIP新增

//获取关联账号
export const getLinkedList = (params: inquireParams) => {
  return defHttp.post({ url: Api.GetLinkedList, params });
};
//获取钱包余额
export const getbalance = (params: detailsParams) => {
  return defHttp.get({ url: Api.Getbalance, params });
};
//获取保险库余额
export const getbalanceLocker = (params: detailsParams) => {
  return defHttp.get({ url: Api.GetbalanceLocker, params });
};

//会员账号验证
export const existsMember = (params: existParams) => {
  return defHttp.get(
    { url: Api.ExistsMember, params },
    { isMessageModal: false, errorMessageMode: 'none', isTransformResponse: false },
  );
};
//编辑VIP等级
export const updateVip = (params: vipAddParams) => {
  return defHttp.post(
    { url: Api.UpdateVip, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取会员层级列表
export const getLevelList = (params: getLevelListParams) => {
  return defHttp.get({ url: Api.GetLevelList, params });
};

//新增会员层级
export const insertLevel = (params: addLevelParams) => {
  return defHttp.post(
    { url: Api.InsertLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取会员层级下拉
export const getLevelSelect = () => {
  return defHttp.get({ url: Api.GetLevelSelect });
};

//获取会员层级下拉
export const getVipLevelSelect = () => {
  return defHttp.get({ url: Api.GetVipLevelSelect });
};
//VIP汇率获取
export const getMemberVipCurrency = () => {
  return defHttp.get({ url: Api.GetMemberVipCurrency });
};

//VIP汇率设置
export const setMemberCurrency = (params: any) => {
  return defHttp.post(
    { url: Api.SetMemberCurrency, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取平台游戏
export const getPlatefromAll = () => {
  return defHttp.get({ url: Api.GetPlatefromAll });
};

//VIP等级领取记录
export const getBonusList = (params: addLevelParams) => {
  return defHttp.get({ url: Api.GetBonusList, params });
};
//编辑会员/level/update
export const updateLevel = (params: addLevelParams) => {
  return defHttp.post(
    { url: Api.UpdateLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//删除会员层级
export const deleteLevel = (params: deleParams) => {
  return defHttp.post(
    { url: Api.DeleteLevel, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 出款卡里表 /back/user/outPay/list

export const getOutpayList = (params: outpayParams) => {
  return defHttp.post({ url: Api.GetOutpayList, params });
};

//虚拟币列表
export const getWalletList = (params: outpayParams) => {
  return defHttp.post({ url: Api.GetWalletList, params });
};
//银行卡停用启用
export const updateBankState = (params: bankSateRarams) => {
  return defHttp.get(
    { url: Api.UpdateBankState, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
interface member_bankcard_update {
  id: string;
  bank_account: string;
}
//银行卡停用启用
export const member_bankcard_update = (params: member_bankcard_update) => {
  return defHttp.post(
    { url: Api.member_bankcard_update, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//银行卡停用删除
export const bankcard_delete = (params: bankSateRarams) => {
  return defHttp.get(
    { url: Api.bankcard_delete, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//虚拟币停用启用/删除
export const updateWalletState = (params: bankSateRarams) => {
  return defHttp.get(
    { url: Api.UpdateWalletState, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
// 重置用户密码
export const userPwd = (params: payPwdParams) => {
  return defHttp.get(
    { url: Api.userPwd, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 重置谷歌验证码
export const setgooglePwd = (params: payPwdParams) => {
  return defHttp.get(
    { url: Api.googlePwd, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

// 重置资金密码
export const setpayPwd = (params: payPwdParams) => {
  return defHttp.get(
    { url: Api.resetpayPwd, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//用户加减款
export const balanceUpdate = (params: sysParams) => {
  return defHttp.post(
    { url: Api.BalanceUpdate, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//加减款类型
export const getBalanceClass = () => {
  return defHttp.get({ url: Api.GetBalanceClass });
};

//批量加减款
export const batchBalanceUpdate = (params: batchParams) => {
  return defHttp.post(
    { url: Api.BatchBalanceUpdate, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//获取币种列表
export const getTreeList = (params: treeParams) => {
  return defHttp.get({ url: Api.GetTreeList + '?level=' + params.level + '&id=' + params.id });
};

//获取业务类型（存取款总汇）
export const getTransactionTypeList = () => {
  return defHttp.get({ url: Api.GetTransactionTypeList });
};
//代理列表模糊搜索
export const getByMemberId = (params: getMemberIdParams) => {
  return defHttp.get(
    { url: Api.getByMemberId, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
// 钱包，佣金，钻石 接口
export const getAmountLogPage = (params: funParams) => {
  return defHttp.post({ url: Api.GetAmountLogPage, params });
};
// 用户操作日志
export const getuOperationList = (params: logParams) => {
  return defHttp.post({ url: Api.GetuOperationList, params });
};

// 登录日志
export const loginList = (params: logParams) => {
  return defHttp.post({ url: Api.GetloginList, params });
};
// 兑换日志
export const getPaymentTransferList = (params) => {
  return defHttp.post({ url: Api.GetPaymentTransferList, params });
};
//VIP等级列表
export const getVipUserList = (params: userListparams) => {
  return defHttp.get({ url: Api.GetVipUserList, params });
};

//徽章消息数量查询
export const getNoticeList = () => {
  return defHttp.get({ url: Api.GetNoticeList });
};

//模糊查询 GetMemberNameList
export const getMemberNameList = (params: any) => {
  return defHttp.get({ url: Api.GetMemberNameList, params });
};
//VIP变更日志GetMemberLogVip

export const getMemberLogVip = (params: logParams) => {
  return defHttp.post({ url: Api.GetMemberLogVip, params });
};

//详情资金日志查询
export const getFundsDetailLog = (params: logParams) => {
  return defHttp.post({ url: Api.GetFundsDetailLog, params });
};

//详情帐变记录日志查询

export const getBalanceTransaction = (params: logParams) => {
  return defHttp.post({ url: Api.GetBalanceTransaction, params });
};

export const getBalanceTransaction_copy = (params: any) => {
  if (!!!params.username) return undefined;
  return defHttp.post({ url: Api.GetBalanceTransaction1, params });
};

/**
 * 打码详情
 */
export const getBetDetail = (params: logParams) => {
  return defHttp.post({ url: Api.GetBetDetail, params });
};
/**
 * 推广id
 */
export const GetBetDetailchannel = (params: logParams) => {
  return defHttp.post({ url: Api.GetBetDetailchannel, params });
};

/**
 * 余额获取接口
 */
export const getbalanceMember = (params: any) => {
  return defHttp.get({ url: Api.GetbalanceMember, params });
};

/**
 * 获取接口
 */
export const getMemberReanameist = (params: any) => {
  return defHttp.get({ url: Api.GetMemberReanameist, params });
};

/**
 * 获取接口会员场馆
 */
export const getBalanceVenues = (params: any) => {
  return defHttp.get({ url: Api.GetBalanceVenues, params });
};

/**
 * 回收会员场馆
 */
export const setBalanceRecycle = (params: any) => {
  return defHttp.get(
    { url: Api.SetBalanceRecycle, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

/** 场馆列表*/

export const getTransferGameList = (params: any) => {
  return defHttp.get({ url: Api.GetTransferGameList, params });
};

/** 返水列表 **/

export const getMemberRebateList = (params: any) => {
  return defHttp.get({ url: Api.GetMemberRebateList, params });
};

/** VIP返水配置 **/

export const getMemberRebateConfig = () => {
  return defHttp.get({ url: Api.GetMemberRebateConfig });
};

/**  返水配置更新 **/
export const updateMeberConfigRebate = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateMeberConfigRebate, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const getReviewCount = () => {
  return defHttp.get({ url: Api.GetReviewCount });
};
