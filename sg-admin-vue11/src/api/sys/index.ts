import {
  AccountParams,
  AccountListItem,
  AccountListGetResultModel,
  PlatformListRequest,
  PlatformUpdateState,
  GameUpdateState,
  GamePlatformUpdateState,
  GameUpdate,
  GameBacthUpdate,
  GameListRequest,
  GameListResponse,
  InsertSiteNotice,
  SortNoticeItem,
  SiteSettingState,
  UserParams,
  insertParamsAccount,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_API_URL } = getAppEnvConfig();

enum Api {
  /* 用户管理 */
  feedback_insert = '/own/feedback/insert', //
  feedback_list = '/own/feedback/list', //
  feedback_update = '/own/feedback/update', //

  chat_list = '/own/feedback/chat/list', //
  chat_insert = '/own/feedback/chat/insert', //   新增问题反馈消息- dreamy

  GetUserListByPage = '/admin/list', // 用户列表
  UpdateUserInfo = '/admin/update', // 编辑用户
  AddUserInfo = '/admin/insert', // 添加用户
  GetAdminDetail = '/admin/detail', // 登录用户的信息
  adminGroupSite = '/admin/group/site', // 可用站点列表
  adminGroupSiteLink = '/admin/site/link', // 可用站点列表
  /* 用户管理 */

  /* 场馆管理 */
  GetPlatformSearch = '/platform/search', // 场馆搜索
  GetPlatformSearchAll = '/platform/search/all', // 场馆搜索(搜索全部)
  GetPlatformList = '/platform/list', // 场馆列表
  UpdatePlatform = '/platform/update', // 编辑场馆
  UpdatePlatformMaintained = '/platform/maintained', // 场馆列表-维护/解除维护
  UpdatePlatformState = '/platform/update/state', // 场馆列表-上线下线
  UpdatePlatformRate = '/platform/update/rate', // 场馆列表-返水比例更新(该场馆下的所有游戏)
  /* 场馆管理 */

  /* 游戏管理 */
  GetSearchGameList = '/game/search', // 游戏管理列表页面
  GetSearchGameAllList = '/game/search/all', // 游戏列表(搜索全部)
  GetGameList = '/game/list', // 游戏管理列表页面
  UpdateBacthGame = '/game/update/batch', // 批量编辑游戏
  UpdateGame = '/game/update', // 编辑游戏
  UploadGame = '/game/upload', // 上传游戏图标
  UpdateGameState = '/game/update/state', // 游戏上线下线
  UpdateGameRate = '/game/update/rate', // 游戏列表-返水比例更新
  UpdateGameBacthSorting = '/game/update/batch/sorting', // 批量修改游戏的排序
  UpdateGameHot = '/game/update/hot', //更新推荐状态
  /* 游戏管理 */

  /* 游戏排序 */
  GetGameCategoryList = '/category/list', // 游戏类别-列表
  UpdateGameCategory = '/category/update', // 游戏类别-编辑多语言名称
  InsertGameCategory = '/category/insert', // 游戏类别-新增
  GetPlatformGames = '/game/platform/games', // 不分页获取游戏列表
  DelGameCategory = '/category/delete', // 删除分类
  UpdateGameCategoryState = '/category/update/state', // 更新类别状态
  UpdateGameCategoryItem = '/category/update/item', // 设置游戏类别-更新类别项
  GetGameCategoryIndexList = '/category/index/list', // 设置体育排序
  UpdateGameCategoryIndex = '/category/index', // 设置首页排序
  UpdateGameCategorySports = '/category/sports', // 设置体育排序
  UpdateLangSync = '/category/lang/sync', //同步多语言配置/category/lang/sync
  GetAllPlatform = '/platform/all', // 场馆名称查询全部
  GetVenuesPlatform = '/platform/venues', //场馆游戏厂商列表
  UpdateCategoryName = '/category/update/name', //更新名字
  GetVenueAll = '/platform/venue/all', //品牌格式
  UpdateVenuesSort = '/platform/update/venues/sorting', //品牌列表排序
  //
  /* 游戏排序 */

  /* (弹窗公告 /跑马灯)新增 */
  GetSiteNoticetList = '/site/notice/list', // (弹窗公告 /跑马灯)列表
  marquee_list = '/site/marquee/list', // (弹窗公告 /跑马灯)列表
  UpdateSiteNoticet = '/site/notice/update', // 编辑(弹窗公告 /跑马灯)
  marquee_update = '/site/marquee/update', // 编辑(弹窗公告 /跑马灯)
  marquee_insert = '/site/marquee/insert', // 编辑(弹窗公告 /跑马灯)
  InsertSiteNoticet = '/site/notice/insert', // 新增(弹窗公告 /跑马灯)
  GetGetSiteNoticetDetail = '/site/notice/detail', // (弹窗公告 /跑马灯)详情
  DeleteSiteNoticet = '/site/notice/delete', //删除(弹窗公告 /跑马灯)
  marquee_delete = '/site/marquee/delete', //删除(弹窗公告 /跑马灯)
  UploadSiteNotice = '/site/notice/upload', // 站内公告(跑马灯)图片上传
  UpdateSiteNoticetState = '/site/notice/update/state', // 状态(弹窗公告 /跑马灯)
  PromoActivitySort = '/promo/update/batch/sorting', // 状态(弹窗公告 /跑马灯)
  marquee_update_state = '/site/marquee/update/state', // 状态(弹窗公告 /跑马灯)
  SiteNoticetSort = '/site/notice/sort', // 状态(弹窗公告 /跑马灯)
  marquee_sort = '/site/marquee/sort', // 状态(弹窗公告 /跑马灯)
  /* (弹窗公告 /跑马灯)新增 */

  /*消息中心-用户反馈*/
  GetFeedbackList = '/feedback/list', //用户反馈列表
  UpdateFeedback = '/feedback/update', //用户反馈编辑
  GetfeedbackChatList = '/feedback/chat/list', //用户反馈对话内容列表
  InsertFeedbackChat = '/feedback/chat/insert', //用户反馈回复反馈消息
  /*消息中心-用户反馈*/

  /*消息中心-站内信*/
  DelStationInfo = '/site/station/info/delete', //撤回-站内信
  GetStationInfolist = '/site/station/info/list', //站内信列表
  InserStationInfo = '/site/station/info/insert', //站内信新增
  GetStationDetaillist = '/site/station/info/detail/list', //站内信详情列表
  DelStationDetailInfo = '/site/station/info/detail/delete', //撤回-站内信详情删除
  /*消息中心-站内信*

  /*管理员日志*/
  GetLoginLog = '/admin/login/log/list', //管理员日志
  /*管理员日志*/

  /*管理员操作日志*/
  GetAdminOperationModel = '/admin/operation/module', //操作日志下拉框事件
  GetOperationLog = '/admin/operation/log/list',
  /*管理员操作日志*/

  /*站点配置*/
  GetSiteDetail = '/site/setting', //站点配置 - 详情
  GetZkNoticeList = '/zk/notice/list', // 商户功能列表
  GetNoticeRead = '/zk/notice/read', // 公告点击次数统计
  UpdateSiteSetting = '/site/setting/update', //站点配置 - 更新/新增
  GetNoticeTodayExists = '/notice/limit/today/exists', //商户站点公告今日不再提示查询
  SetNoticeTodayLimit = '/notice/limit/today', //商户站点公告今日不再提示设置

  limit_count = '/zk/notice/limit/count', //今日不再提示的已读

  SetNoticeTodayTimes = '/notice/limit/today/times', //商户站点公告弹窗次数+1
  /*站点配置*/

  /*品牌设置*/
  UpdateSiteBrand = '/site/brand/update', //品牌设置 - 更新
  GetSiteBrandDetail = '/site/brand/detail', //品牌设置 - 详情
  UploadCategoryBrand = '/site/brand/category/info/update', //品牌设置 小类 修改
  UpdateSiteBrandBottomCheckbox = '/site/brand/bottom/checkbox/update', //品牌设置 bottom 勾选
  UploadSiteBrand = '/site/brand/upload', //品牌设置 图片上传
  GetBrandDetail = '/site/brand/detail', //限额查看
  SiteBrandVersionUpdate = '/site/brand/version/update', //app 更新保存接口
  SiteBrandVersionList = '/site/brand/version/list', //app 更新列表

  /*品牌设置*/

  /*站点设置*/
  GetTransactionList = '/site/finance/transaction/list', //帐变列表
  GetTransactiontype = '/site/finance/transaction/type', //帐变列表
  GetDepositList = '/site/finance/deposit/list', //充值订单
  GetPaymentList = '/site/finance/payment/company/list', //支付平台下拉选单
  GetSiteBill = '/site/bill', //站点账单
  GetSiteBillDetail = '/site/bill/detail', //站点账单详情
  SetSitWithdraw = '/site/withdraw', //站点帐单-支付
  /*站点设置*/

  /*站点配置*/
  ConfigList = '/zk/site/detail', //站点列表
  DetailMaintain = '/zk/site/detail/maintain', //站点列表点击维护
  ConfigCredit = '/site/config/credit/list', //站点额度
  UpdateMaintain = '/zk/site/update/maintain', // 设置维护设置状态
  ConfigCostDetail = '/site/config/cost/detail', //站点费率详情
  ConfigFeeDetail = '/site/platform/fee/detail', //站点游戏平台费率
  GamePlat = '/game/type/and/platform/list', //平台列表
  /*站点配置*/

  /*区域限制*/
  GetAreaLimitList = '/area/limit/list', //区域限制列表
  GetCountryList = '/tree/list', //获取国家列表
  InsertArealimit = '/area/limit/insert', //新增区域限制
  UpdateArealimit = '/area/limit/update', //更新区域限制
  GetAreaDetail = '/area/limit/detail', //区域限制详情
  DeleteAreaLimit = '/area/limit/delete', //删除区域限制
  BatchDeleteAreaLimit = '/area/limit/batch/delete', //删除区域限制
  /*区域限制*/

  /*IP白名单列表*/
  GetWhitelistList = '/whitelist/list', //IP白名单
  InsertWhitelistList = '/whitelist/insert', //新增IP白名单
  UpdateWhitelistList = '/whitelist/update', //修改IP白名单
  DeleteWhitelistList = '/whitelist/delete', //IP白名单删除
  /*IP白名单列表*/

  /* 权限管理模块-管理员列表 */
  GetAdminList = '/admin/list', //账号列表
  InsertAdminList = '/admin/insert', //新增管理员
  UpdateState = '/admin/update/state', //修改会员状态
  UpdateAdminAccount = '/admin/update', //修改管理员
  UpdateAdminAccount_limit = '/admin/limit/update', //修改管理员
  UpdateAdminPassword = '/admin/update/password', //修改会员密码
  DeleteAdmin = '/admin/delete', //会员账号删除
  limit_detail = '/admin/limit/detail', //额度
  limit_bulk = '/admin/limit/bulk', //额度

  AdminGroupsList = '/admin/list/groups', //权限下拉列表
  GetUpdateKey = '/admin/update/otp', //登录密钥更新
  /* 权限管理模块-管理员列表 */

  /*赛事列表*/
  EventlistList = '/sports/event/list',
  GetSports = '/sports',
  PostEventblock = '/sports/event/block',
  OutrightlistList = '/sports/outright/list',
  LotteryList = '/site/finance/payment/company/list',
  LotteryTy = '/cp/categories', //彩种类型
  LotteryReportIssue = '/cp/report/issue', //开奖号码
  LotteryReportList = '/cp/report/list', //彩票统计
  /*赛事列表*/
}

/*IP白名单列表*/
export const getWhitelistList = (params: any) => defHttp.get({ url: Api.GetWhitelistList, params });

export const insertWhitelistList = (params: any) =>
  defHttp.post({ url: Api.InsertWhitelistList, params }, { isTransformResponse: false });

export const updateWhitelistList = (params: any) =>
  defHttp.post({ url: Api.UpdateWhitelistList, params }, { isTransformResponse: false });

export const deleteWhitelistList = (params: any) =>
  defHttp.post({ url: Api.DeleteWhitelistList, params }, { isTransformResponse: false });

/*IP白名单列表*/

/*区域限制*/
export const batchDeleteAreaLimit = (params: any) =>
  defHttp.post({ url: Api.BatchDeleteAreaLimit, params }, { isTransformResponse: false });

export const deleteAreaLimit = (params: any) =>
  defHttp.get({ url: `${Api.DeleteAreaLimit}?id=${params.id}` }, { isTransformResponse: false });

export const getAreaDetail = (params: any) =>
  defHttp.get({ url: `${Api.GetAreaDetail}?id=${params.id}` });

export const updateArealimit = (params: any) =>
  defHttp.post({ url: Api.UpdateArealimit, params }, { isTransformResponse: false });

export const insertArealimit = (params: any) =>
  defHttp.post({ url: Api.InsertArealimit, params }, { isTransformResponse: false });

export const getCountryList = (params: any) =>
  defHttp.get({ url: `${Api.GetCountryList}?level=${params.level}` });

export const getAreaLimitList = (params: any) =>
  defHttp.post({ url: Api.GetAreaLimitList, params });
/*区域限制*/

/*站点设置*/

export const GetZkNoticeList = (params: any) => defHttp.get({ url: Api.GetZkNoticeList, params });

export const GetNoticeRead = (params: any) =>
  defHttp.get({ url: `${Api.GetNoticeRead}?id=${params.id}` });

export const getNoticeTodayExists = (params: any) =>
  defHttp.get(
    { url: `${Api.GetNoticeTodayExists}?code=${params.code}` },
    { isTransformResponse: false },
  );

export const setNoticeTodayLimit = (params: any) =>
  defHttp.get(
    { url: `${Api.SetNoticeTodayLimit}?code=${params.code}` },
    { isTransformResponse: false },
  );
export const limit_count = (params: any) =>
  defHttp.post({ url: Api.limit_count, params }, { isTransformResponse: false });

export const setNoticeTodayTimes = (params) =>
  defHttp.post({ url: Api.SetNoticeTodayTimes, params }, { isTransformResponse: false });

export const getPaymentList = (params: any) => defHttp.get({ url: Api.GetPaymentList, params });

export const getDepositList = (params: any) => defHttp.post({ url: Api.GetDepositList, params });

export const getTransactionList = (params: any) =>
  defHttp.post({ url: Api.GetTransactionList, params });

export const getTransactiontype = () => defHttp.get({ url: Api.GetTransactiontype });

export const getSiteBill = (params: any) => defHttp.post({ url: Api.GetSiteBill, params });

export const getSiteBillDetail = (params: any) =>
  defHttp.post({ url: Api.GetSiteBillDetail, params });

export const setSitWithdraw = (params: any) => defHttp.post({ url: Api.SetSitWithdraw, params });
/*站点设置*/

/*站点配置*/
export const configList = () => defHttp.get({ url: Api.ConfigList });

//站点列表点击维护
export const detailMaintain = () => defHttp.get({ url: Api.DetailMaintain });

export const configCredit = (params: any) => defHttp.post({ url: Api.ConfigCredit, params });

export const updateMaintain = (params: any) =>
  defHttp.post({ url: Api.UpdateMaintain, params }, { isTransformResponse: false });

export const getCostDetail = (params: SiteSettingState) =>
  defHttp.get({ url: Api.ConfigCostDetail, params });
export const getFeeDetail = (params: SiteSettingState) =>
  defHttp.get({ url: Api.ConfigFeeDetail, params });
export const getGamePlat = (params: SiteSettingState) => defHttp.get({ url: Api.GamePlat, params });
/*站点配置*/

/*品牌设置*/
export const uploadCategoryBrand = (params) =>
  defHttp.post({ url: Api.UploadCategoryBrand, params }, { isTransformResponse: false });

export const getSiteBrandDetail = (params: any) =>
  defHttp.get({ url: Api.GetSiteBrandDetail, params });

export const updateSiteBrand = (params) =>
  defHttp.post({ url: Api.UpdateSiteBrand, params }, { isTransformResponse: false });

export const updateSiteBrandBottomCheckbox = (params) =>
  defHttp.post({ url: Api.UpdateSiteBrandBottomCheckbox, params }, { isTransformResponse: false });

export const uploadSiteBrand = (params, type: any) => {
  const userStore = useUserStoreWithOut();
  // 基础 URL
  let url = `${VITE_GLOB_API_URL}${Api.UploadSiteBrand}?t=${userStore.getToken}`;

  // 根据 type 动态添加 flag 参数
  if (type === 'pcLogDataIcon') {
    url += '&flag=loading'; // 添加 flag=loading
  }
  return defHttp.uploadFile(
    { url }, // 使用动态生成的 URL
    params,
  );
};

export const getBrandDetail = (params: SiteSettingState) =>
  defHttp.get({ url: Api.GetBrandDetail, params }, { isTransformResponse: false });
export const updateMinigameBrand = (params) =>
  defHttp.post({ url: Api.UpdateMinigameBrand, params }, { isTransformResponse: false });
export const siteBrandVersionUpdate = (params) =>
  defHttp.post({ url: Api.SiteBrandVersionUpdate, params }, { isTransformResponse: false });
export const getSiteBrandVersionList = () => defHttp.get({ url: Api.SiteBrandVersionList });
//UpdateMinigameBrand
/*品牌设置*/

export const getAdminDetail = () => defHttp.get({ url: Api.GetAdminDetail });

export const adminGroupSite = () => defHttp.get({ url: Api.adminGroupSite });

export const adminGroupSiteLink = (params: any) =>
  defHttp.post({ url: Api.adminGroupSiteLink, params }, { isTransformResponse: false });

export const getSiteDetails = (params: SiteSettingState) =>
  defHttp.get({ url: Api.GetSiteDetail, params });

export const updateSiteSettings = (params) =>
  defHttp.post({ url: Api.UpdateSiteSetting, params }, { isTransformResponse: false });

export const siteNoticetSort = (params: SortNoticeItem) =>
  defHttp.post({ url: Api.SiteNoticetSort, params }, { isTransformResponse: false });

export const marquee_sort = (params: SortNoticeItem) =>
  defHttp.post({ url: Api.marquee_sort, params }, { isTransformResponse: false });

export const promoActivitySort = (params: SortNoticeItem) =>
  defHttp.post({ url: Api.PromoActivitySort, params }, { isTransformResponse: false });

export const getUserListByPage = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.GetUserListByPage, params });

export const feedback_insert = (params) => defHttp.post({ url: Api.feedback_insert, params });
export const feedback_list = (params) => defHttp.post({ url: Api.feedback_list, params });
export const feedback_update = (params) =>
  defHttp.post({ url: Api.feedback_update, params }, { noMessageMode: true });

export const chat_list = (params) =>
  defHttp.post({ url: Api.chat_list, params }, { noMessageMode: true });
export const chat_insert = (params) => defHttp.post({ url: Api.chat_insert, params });

export const addUserInfo = (params: AccountListItem) =>
  defHttp.post({ url: Api.AddUserInfo, params });

export const updateUserInfo = (params: AccountListItem) =>
  defHttp.post({ url: Api.UpdateUserInfo, params });

export const getPlatformSearch = (params: PlatformListRequest) =>
  defHttp.get<GameListResponse>({ url: Api.GetPlatformSearch, params });

export const getPlatformSearchAll = (params: PlatformListRequest) =>
  defHttp.get<GameListResponse>({ url: Api.GetPlatformSearchAll, params });

export const getPlatformList = (params: PlatformListRequest) =>
  defHttp.get<GameListResponse>({ url: Api.GetPlatformList, params });

export const updatePlatform = (params: GameUpdate) =>
  defHttp.post({ url: Api.UpdatePlatform, params }, { isTransformResponse: false });

export const updatePlatformMaintained = (params: PlatformUpdateState) =>
  defHttp.get({ url: Api.UpdatePlatformMaintained, params }, { isTransformResponse: false });

export const updatePlatformState = (params: PlatformUpdateState) =>
  defHttp.post({ url: Api.UpdatePlatformState, params }, { isTransformResponse: false });

export const getGameList = (params: GameListRequest) =>
  defHttp.get<GameListResponse>({ url: Api.GetGameList, params });

export const getSearchGameList = (params) =>
  defHttp.get<GameListResponse>({ url: Api.GetSearchGameList, params });

export const getSearchGameAllList = (params) =>
  defHttp.get<GameListResponse>({ url: Api.GetSearchGameAllList, params });

export const updateGame = (params: GameUpdate) =>
  defHttp.post({ url: Api.UpdateGame, params }, { isTransformResponse: false });

export const updateBacthGame = (params: GameBacthUpdate) => {
  const { type, ...otherParams } = params;
  return defHttp.get(
    { url: `${Api.UpdateBacthGame}/${type}`, params: otherParams },
    { isTransformResponse: false },
  );
};
export const uploadGame = (params: GameUpdateState) =>
  defHttp.post({ url: Api.UploadGame, params }, { isTransformResponse: false });

export const updateGameState = (params: GamePlatformUpdateState) =>
  defHttp.post({ url: Api.UpdateGameState, params }, { isTransformResponse: false });

export const updateGameHot = (params: GamePlatformUpdateState) => {
  return defHttp.get(
    { url: Api.UpdateGameHot, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

export const updateGameBacthSorting = (params) =>
  defHttp.post({ url: Api.UpdateGameBacthSorting, params }, { isTransformResponse: false });

export const getGameCategoryList = (params) =>
  defHttp.get(
    {
      url: Api.GetGameCategoryList,
      params,
      responseType: 'arraybuffer',
    },
    { isZstd: true },
  );

export const updateGameCategory = (params) =>
  defHttp.post({ url: Api.UpdateGameCategory, params }, { isTransformResponse: false });

export const insertGameCategory = (params) =>
  defHttp.post({ url: Api.InsertGameCategory, params }, { isTransformResponse: false });
export const getPlatformGames = (params) => defHttp.get({ url: Api.GetPlatformGames, params });

export const delGameCategory = (params) =>
  defHttp.get({ url: Api.DelGameCategory, params }, { isTransformResponse: false });
export const updateGameCategoryState = (params) =>
  defHttp.get({ url: Api.UpdateGameCategoryState, params }, { isTransformResponse: false });
export const updateGameCategoryItem = (params) =>
  defHttp.post({ url: Api.UpdateGameCategoryItem, params }, { isTransformResponse: false });
export const getGameCategoryIndexList = () => defHttp.get({ url: Api.GetGameCategoryIndexList });
export const updateGameCategoryIndex = (params) =>
  defHttp.post({ url: Api.UpdateGameCategoryIndex, params }, { isTransformResponse: false });
export const updateGameCategorySports = (params) =>
  defHttp.post({ url: Api.UpdateGameCategorySports, params }, { isTransformResponse: false });
//管理员登录日志
export const getLoginLog = (params: GameUpdateState) =>
  defHttp.post({ url: Api.GetLoginLog, params });

//管理员操作日志
export const getAdminOperationModel = (params = {}) =>
  defHttp.get({ url: Api.GetAdminOperationModel, params }, { isTransformResponse: false });
export const getOperationLog = (params: GameUpdateState) =>
  defHttp.post({ url: Api.GetOperationLog, params });

/* (弹窗公告 /跑马灯)新增 */
export const getSiteNoticetList = (params) => {
  return defHttp.post({ url: Api.GetSiteNoticetList, params });
};
export const marquee_list = (params) => {
  return defHttp.post({ url: Api.marquee_list, params });
};
export const updateSiteNoticet = (params) => {
  return defHttp.post({ url: Api.UpdateSiteNoticet, params }, { isTransformResponse: false });
};
export const marquee_update = (params) => {
  return defHttp.post({ url: Api.marquee_update, params }, { isTransformResponse: false });
};
export const marquee_insert = (params) => {
  return defHttp.post({ url: Api.marquee_insert, params }, { isTransformResponse: false });
};
export const insertSiteNoticet = (params: InsertSiteNotice) => {
  return defHttp.post({ url: Api.InsertSiteNoticet, params }, { isTransformResponse: false });
};
export const getGetSiteNoticetDetail = (params: any) => {
  return defHttp.get({ url: Api.GetGetSiteNoticetDetail, params });
};
export const deleteSiteNoticet = (params) => {
  return defHttp.post({ url: Api.DeleteSiteNoticet, params }, { isTransformResponse: false });
};
export const marquee_delete = (params) => {
  return defHttp.post({ url: Api.marquee_delete, params }, { isTransformResponse: false });
};
export const marquee_update_state = (params) => {
  return defHttp.post({ url: Api.marquee_update_state, params }, { isTransformResponse: false });
};
export const updateSiteNoticetState = (params) => {
  return defHttp.post({ url: Api.UpdateSiteNoticetState, params }, { isTransformResponse: false });
};

export const uploadSiteNotice = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    { url: `${VITE_GLOB_API_URL}${Api.UploadSiteNotice}?t=${userStore.getToken}` },
    params,
  );
};
/* (弹窗公告 /跑马灯)新增 */

//消息中心-用户反馈列表
export const getFeedbackList = (params) => {
  return defHttp.post({ url: Api.GetFeedbackList, params });
};

//消息中心-用户反馈编辑
export const updateFeedback = (params) => {
  return defHttp.post({ url: Api.UpdateFeedback, params }, { isTransformResponse: false });
};

//消息中心-用户反馈对话内容列表
export const getfeedbackChatList = (params) => {
  return defHttp.post({ url: Api.GetfeedbackChatList, params }, { isTransformResponse: false });
};
//消息中心-用户反馈回复反馈信息
export const insertFeedbackChat = (params) => {
  return defHttp.post({ url: Api.InsertFeedbackChat, params }, { isTransformResponse: false });
};

//站内信-新增
export const inserStationInfo = (params) => {
  return defHttp.post({ url: Api.InserStationInfo, params }, { isTransformResponse: false });
};

//站内信-撤回
export const delStationInfo = (params) => {
  return defHttp.post(
    { url: `${Api.DelStationInfo}?id=${params.id}` },
    { isTransformResponse: false },
  );
};
//站内信-列表
export const getStationInfolist = (params) => {
  return defHttp.post({ url: Api.GetStationInfolist, params });
};

//站内信-站内信详情列表
export const getStationDetaillist = (params) => {
  return defHttp.post({ url: Api.GetStationDetaillist, params });
};

//站内信-站内信详情删除
export const delStationDetailInfo = (params) => {
  return defHttp.post({ url: Api.DelStationDetailInfo, params }, { isTransformResponse: false });
};
//同步多语言
export const updateLangSync = (params: updatalang) => {
  return defHttp.post({ url: Api.UpdateLangSync, params }, { isTransformResponse: false });
};
//获取场馆全部
export const getAllPlatform = () => {
  return defHttp.get({ url: Api.GetAllPlatform });
};
export const getVenuesPlatform = () => defHttp.get({ url: Api.GetVenuesPlatform });
//更改场馆名称
export const updateCategoryName = (params: editParams) => {
  return defHttp.post({ url: Api.UpdateCategoryName, params }, { isTransformResponse: false });
};

//管理员列表
export const getAdminList = (params: UserParams) => {
  return defHttp.get({ url: Api.GetAdminList, params });
};

//新增管理员
export const insertAdminList = (params: insertParamsAccount) => {
  return defHttp.post(
    { url: Api.InsertAdminList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
export const UpdateAdminAccount_limit = (params: any) => {
  return defHttp.post(
    { url: Api.UpdateAdminAccount_limit, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
export const updateAdminAccount = (params: insertParamsAccount) => {
  return defHttp.post(
    { url: Api.UpdateAdminAccount, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
//账号删除
export const deleteAdmin = (params) => {
  return defHttp.get({ url: Api.DeleteAdmin, params }, { isTransformResponse: false });
};
//额度查看单个
export const limit_detail = (params) => {
  return defHttp.get({ url: Api.limit_detail, params }, { isTransformResponse: false });
};
//额度查看多个
export const limit_bulk = (params) => {
  return defHttp.get({ url: Api.limit_bulk, params }, { isTransformResponse: false });
};
//账号更新状态
export const updateState = (params) => {
  return defHttp.post({ url: Api.UpdateState, params }, { isTransformResponse: false });
};

//修改密码
export const updateAdminPassword = (params) => {
  return defHttp.post({ url: Api.UpdateAdminPassword, params }, { isTransformResponse: false });
};

//权限下拉列表
export const adminGroupsList = (params) => {
  return defHttp.get({ url: Api.AdminGroupsList, params });
};

//游戏排序品牌
export const getVenueAll = () => {
  return defHttp.get({ url: Api.GetVenueAll });
};

//品牌排序
export const updateVenuesSort = (params) => {
  return defHttp.post({ url: Api.UpdateVenuesSort, params }, { isTransformResponse: false });
};

//更新Qcode

export const getUpdateKey = (params) => {
  return defHttp.get({ url: Api.GetUpdateKey, params }, { isTransformResponse: false });
};

export const getEventlistList = (params) => {
  return defHttp.post({ url: Api.EventlistList, params });
};

export const getSports = () => {
  return defHttp.get({ url: Api.GetSports });
};

export const postEventblock = (params) => {
  return defHttp.post({ url: Api.PostEventblock, params }, { isTransformResponse: false });
};

export const getOutrightlistList = (params) => {
  return defHttp.post({ url: Api.OutrightlistList, params });
};

/**
 * 彩票列表
 * @param params
 * @returns
 */
export const getLotteryList = (params) => {
  return defHttp.get({ url: Api.LotteryList, params });
};

/**
 * 彩种类型
 * @returns
 */
export const getLotteryTy = () => {
  return defHttp.get({ url: Api.LotteryTy });
};

/**
 * 开奖号码
 * @param params
 * @returns
 */
export const getLotteryReportIssue = (params) => {
  return defHttp.post({ url: Api.LotteryReportIssue, params });
};

/**
 * 彩票统计
 * @param params
 * @returns
 */
export const getLotteryReportList = (params) => {
  return defHttp.post({ url: Api.LotteryReportList, params });
};
