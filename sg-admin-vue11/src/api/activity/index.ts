import { defHttp } from '/@/utils/http/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_API_URL } = getAppEnvConfig();
enum Api {
  /* 利息宝配置列表 */
  InsertInterest = '/interest/config/insert', //新增利息宝配置
  UpdateInterest = '/interest/config/update', //更新利息宝配置
  GetInterestList = '/interest/config/list', //利息宝配置列表
  GetInterestDetail = '/interest/config/detail', //利息宝配置详情
  UpdateInterestState = '/interest/config/update/state', //利息宝状态更新
  InterestConfigDelete = '/interest/config/delete', //保险库删除
  GetUseList = '/interest/config/currency', //已设置的币种
  UpdatePromoActive = '/promo/update', //活动编辑
  //币种配置
  /* 利息宝配置列表 */
  /* 活动管理 - start */
  GetPromoList = '/promo/list', //活动列表
  InsertPromoActive = '/promo/insert', //新增活动
  GetPromoDetail = '/promo/detail', //获取活动详情
  UploadPromoImage = 'promo/upload', //图片上传
  UpdatePromoClose = '/promo/offline', //活动关闭
  GetPromoBonusList = '/promo/bonus/review/list', //活动审核列表
  UpdateReviewBonus = '/promo/bonus/review', //活动申请
  UpdatePrompClocse = '/promo/recommend', //活动推荐/取消推荐
  GetBonusRecordList = '/promo/bonus/record', //查看活动记录
  UpdatePromoDisplay = '/promo/display', //活动显示隐藏
  UpdateMerchantClose = '/promo/close', //活动关闭
  GetPromoRedenvelope = '/promo/hongbao/record/list', //红包记录
  /* 活动管理 - end */

  GetPromoReviewList = '/promo/agent/review/list', //推广活动审核
  promo_lucky_bet_review = '/promo/lucky/bet/review/list', //幸运活动审核
  UpdateAgentReview = '/promo/agent/bonus/review', //推广活动申请
  lucky_bet_bonus_review = '/promo/lucky/bet/bonus/review', //推广活动申请
  GetturntableReviewList = '/promo/turntable/review/list', //列表
  UpdateTurntableReview = '/promo/turntable/bonus/review', //推广活动申请
  GetbonusList = '/promo/bonus/list', //优惠明细列表
  GetbonusTypeList = '/promo/bonus/list/type', //优惠明细列表
  GetbusinessTypeList = '/promo/bonus/list/business', //优惠明细列表
  GetProfitReviewList = '/promo/profit/review/list', //列表
  UpdateBonusReview = '/promo/profit/bonus/review', //推广活动申请
  DeletePromo = '/promo/delete', //删除
  GetReviewReviewList = '/promo/review/name', //删除
  GetPromoDepositReviewList = '/promo/deposit/review/list', //充值活动审核列表

  GetPromoAppreciatioBonusList = '/promo/Appreciatio/bonus/list', //会员答谢礼审核列表
  PostPromoDepositBonusReview = '/promo/deposit/bonus/review', //充值活动审核
  PostAppreciatioBonusReview = '/promo/Appreciatio/bonus/review', //会员答谢礼审核
  GetInviteFriendsList = '/promo/invite/friends/review/list', //邀请好友列表
  PostPromoInviteFriendsBonusReview = '/promo/invite/friends/bonus/review', //邀请好友列表审核
  GetPromoDepositOrderList = '/promo/deposit/order/list', //充值活动关联订单列表
  PostPromoDailyBonusList = '/promo/daily/bonus/list', //每日奖励审核列表
  GetPromoDailyBonusReview = '/promo/daily/bonus/review', //每日奖励审核接口
  GetPromoCategoryList = '/promo/category/list', //活动分类列表
  DeletePromoCategory = '/promo/category/delete', //活动分类删除
  InsertPromoCategory = '/promo/category/insert', //活动分类新增
  SortPromoCategory = '/promo/category/sort', //活动分类排序
  RemovePromoCategory = '/promo/category/bind/delete', //活动分类移除

  PostPromoInviteFriendsTotalDepositList = '/promo/invite/friends/total/deposit/list', //累计存款明细
  PostPromoInviteFriendsValidBetList = '/promo/invite/friends/valid/bet/list', //有效投注明细

  GetCategoryList = '/promo/category/list', //分类接口
  GetExchangeCurrency = '/exchange/code/config/currency', //兑换码列表已知币种
  GetExchangeCodeList = '/exchange/code/config/list', //兑换码列表
  InsertExchangeCode = '/exchange/code/config/insert', //兑换码新增
  UpdateExchangeCodeClose = '/exchange/code/config/close', //兑换码关闭
  DeleteExchangeCode = '/exchange/code/config/delete', //兑换码删除
  GetExchangeCode = '/exchange/code/list', //兑换码删除
  ExportExchangeCode = '/exchange/code/export', //兑换码列表导出
}
/* 利息宝配置列表- start */
export const insertInterest = (params: any) =>
  defHttp.post({ url: Api.InsertInterest, params }, { isTransformResponse: false });

export const updateInterest = (params: any) =>
  defHttp.post({ url: Api.UpdateInterest, params }, { isTransformResponse: false });

export const getInterestList = (params: any) => defHttp.get({ url: Api.GetInterestList, params });

export const getInterestDetail = (params: any) =>
  defHttp.get({ url: Api.GetInterestDetail, params });

export const getExchangeCurrency = (params: any) =>
  defHttp.get({ url: Api.GetExchangeCurrency, params });

export const getExchangeCodeList = (params: any) =>
  defHttp.get({ url: Api.GetExchangeCodeList, params });

export const insertExchangeCode = (params: any) =>
  defHttp.post({ url: Api.InsertExchangeCode, params }, { isTransformResponse: false });

export const updateExchangeCodeClose = (params: any) =>
  defHttp.get({ url: Api.UpdateExchangeCodeClose, params });

export const deleteExchangeCode = (params: any) =>
  defHttp.get({ url: Api.DeleteExchangeCode, params });

export const getExchangeCode = (params: any) =>
  defHttp.get({ url: Api.GetExchangeCode, params });

export const exportExchangeCode = (params: any) =>
  defHttp.get({ url: Api.ExportExchangeCode, params }, { isTransformResponse: false, isExport: true });

export const updateInterestState = (params: any) =>
  defHttp.get({ url: Api.UpdateInterestState, params }, { isTransformResponse: false });
export const interestConfigDelete = (params: any) =>
  defHttp.get({ url: Api.InterestConfigDelete, params }, { isTransformResponse: false });

export const getUseList = () => defHttp.post({ url: Api.GetUseList });
/* 利息宝配置列表- end */
// /活动审核列表/

export const getPromoBonusList = (params: any) =>
  defHttp.get({ url: Api.GetPromoBonusList, params });

/*活动管理- start*/
export const getPromoList = (params: any) => defHttp.get({ url: Api.GetPromoList, params });

export const getbonusList = (params: any) => defHttp.get({ url: Api.GetbonusList, params });

export const getPromoReviewList = (params: any) =>
  defHttp.get({ url: Api.GetPromoReviewList, params });
export const promo_lucky_bet_review = (params: any) =>
  defHttp.get({ url: Api.promo_lucky_bet_review, params });
export const postPromoDepositBonusReview = (params: any) =>
  defHttp.post({ url: Api.PostPromoDepositBonusReview, params });
export const postAppreciatioBonusReview = (params: any) =>
  defHttp.post({ url: Api.PostAppreciatioBonusReview, params });
export const getPromoDepositReviewList = (params: any) =>
  defHttp.get({ url: Api.GetPromoDepositReviewList, params });
export const getPromoAppreciatioBonusList = (params: any) =>
  defHttp.get({ url: Api.GetPromoAppreciatioBonusList, params });
export const postPromoInviteFriendsBonusReview = (params: any) =>
  defHttp.post({ url: Api.PostPromoInviteFriendsBonusReview, params });
export const getInviteFriendsList = (params: any) =>
  defHttp.get({ url: Api.GetInviteFriendsList, params });
export const getPromoDepositOrderList = (params: any) =>
  defHttp.get({ url: Api.GetPromoDepositOrderList, params });
export const getPromoDailyBonusReview = (params: any) =>
  defHttp.get({ url: Api.GetPromoDailyBonusReview, params });

export const getturntableReviewList = (params: any) =>
  defHttp.get({ url: Api.GetturntableReviewList, params });

// 邀请好友-明细弹窗
// 累计存款明细
export const getPromoInviteFriendsTotalDepositList = (params: any) =>
  defHttp.post({ url: Api.PostPromoInviteFriendsTotalDepositList, params });
// 有效投注明细
export const getPromoInviteFriendsValidBetList = (params: any) =>
  defHttp.post({ url: Api.PostPromoInviteFriendsValidBetList, params });

export const updatePromoActive = (params: any) =>
  defHttp.post(
    { url: Api.UpdatePromoActive, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
export const PostPromoDailyBonusList = (params: any) =>
  defHttp.post(
    { url: Api.PostPromoDailyBonusList, params },
    { errorMessageMode: 'none', isTransformResponse: true },
  );
export const insertPromoActive = (params: any) =>
  defHttp.post(
    { url: Api.InsertPromoActive, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
export const getPromoDetail = (params: any) => defHttp.get({ url: Api.GetPromoDetail, params });
//export const uploadPromoImage = (params: any) => defHttp.post({ url: Api.UploadPromoImage, params })
export const uploadPromoImage = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    { url: `${VITE_GLOB_API_URL}/${Api.UploadPromoImage}?t=${userStore.getToken}` },
    params,
  );
};
/*活动管理- end*/
/*关闭活动*/
export const updatePromoClose = (params: any) =>
  defHttp.get({ url: Api.UpdatePromoClose, params }, { isTransformResponse: false });
/*关闭活动*/

// /活动推荐/
export const updatePrompClose = (params: any) =>
  defHttp.get({ url: Api.UpdatePrompClocse, params }, { isTransformResponse: false });

//活动申请

export const updateReviewBonus = (params: any) =>
  defHttp.post({ url: Api.UpdateReviewBonus, params }, { isTransformResponse: false });

export const updateTurntableReview = (params: any) =>
  defHttp.post({ url: Api.UpdateTurntableReview, params }, { isTransformResponse: false });

//活动入库

export const updateAgentReview = (params: any) =>
  defHttp.post({ url: Api.UpdateAgentReview, params }, { isTransformResponse: false });
//幸运赌注审核
export const lucky_bet_bonus_review = (params: any) =>
  defHttp.post({ url: Api.lucky_bet_bonus_review, params }, { isTransformResponse: false });

export const getBonusRecordList = (params: any) =>
  defHttp.get({ url: Api.GetBonusRecordList, params });

//活动显示隐藏
export const updatePromoDisplay = (params: any) =>
  defHttp.get({ url: Api.UpdatePromoDisplay, params });

//活动红包记录
export const getPromoRedenvelope = (params: any) =>
  defHttp.post({ url: Api.GetPromoRedenvelope, params });

export const getbonusTypeList = (params: any) => defHttp.get({ url: Api.GetbonusTypeList, params });

export const getbusinessTypeList = (params: any) =>
  defHttp.get({ url: Api.GetbusinessTypeList, params });

export const getProfitReviewList = (params: any) =>
  defHttp.get({ url: Api.GetProfitReviewList, params });

export const updateBonusReview = (params: any) =>
  defHttp.post({ url: Api.UpdateBonusReview, params }, { isTransformResponse: false });

export const updateMerchantClose = (params: any) =>
  defHttp.get({ url: Api.UpdateMerchantClose, params }, { isTransformResponse: false });

export const deletePromo = (params: any) =>
  defHttp.get({ url: Api.DeletePromo, params }, { isTransformResponse: false });

export const getReviewReviewList = (params: any) =>
  defHttp.get({ url: Api.GetReviewReviewList, params });
// 活动分类列表
export const getPromoCategoryList = (params: any) =>
  defHttp.get({ url: Api.GetPromoCategoryList, params }, { isTransformResponse: false });
// 活动分类删除
export const deletePromoCategory = (params: any) =>
  defHttp.get({ url: Api.DeletePromoCategory, params }, { isTransformResponse: false });
// 活动分类新增
export const insertPromoCategory = (params: any) =>
  defHttp.post({ url: Api.InsertPromoCategory, params }, { isTransformResponse: false });
// 活动分类排序
export const sortPromoCategory = (params: any) =>
  defHttp.post({ url: Api.SortPromoCategory, params }, { isTransformResponse: false });
// 活动分类移除
export const removePromoCategory = (params: any) =>
  defHttp.post({ url: Api.RemovePromoCategory, params }, { isTransformResponse: false });
// 活动分类列表
export const getCategoryList = (params: any) => defHttp.get({ url: Api.GetCategoryList, params });
