import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';
import { useUserStoreWithOut } from '/@/store/modules/user';

const { VITE_GLOB_API_URL } = getAppEnvConfig();

enum Api {
  /* 埋点列表 */
  GetBuriedPointList = '/channel/track/config',
  InsertBuriedPoint = '/channel/track/config/insert', //新增
  UpdateBuriedPoint = '/channel/track/config/update', //编辑
  DeleteBuriedPoint = '/channel/track/config/delete', //删除
  /**统计代码 */
  GetStaticsCodeList = '/stats/code/list', //列表
  //渠道统计
  PostChannelReport = '/channel/report/v2',
  PostChannelReportEffect = '/channel/report/effect', // 推广效果
  PostChannelReportEffectGameMap = '/channel/report/effect/game/map', // 推广效果悬浮窗口
  GetChannelLinkSelect = '/channel/link/select', // 渠道下拉列表
  GetStaticsCodeDomainList = '/stats/code/domain/list', //域名列表
  PostStaticsCodeInsert = '/stats/code/insert', //新增
  PostStaticsCodeUpdate = '/stats/code/update', //更新
  GetStaticsCodeDelete = '/stats/code/delete', //删除
  GetStaticsCodeDomainDelete = '/stats/code/domain/delete', //域名删除
  GetStaticsCodeDetail = '/stats/code/detail', //详情
  /* 渠道链接 */
  InsertChannelList = '/channel/link/insert', //新增链接
  UpdateChannelList = '/channel/link/update', //编辑链接
  GetChannelDetail = '/channel/link/detail', //链接详情
  GetChannelList = '/channel/link/list', //链接列表
  GetChannelAppList = '/channel/app/links', //app链接列表
  GetDomainList = '/domain/child/list', //域名列表
  DeleteChannelLink = '/channel/link/update/state', //删除链接
  OpenChannelState = '/channel/link/update/app/open', //更新大厅APP展示状态
  ChannelProviders = '/channel/group/list', //渠道商列表
  ChannelProvidersInsert = '/channel/group/insert', //新增渠道商
  ChannelProvidersUpdate = '/channel/group/update', //更新渠道商

  /* 渠道统计 */
  GetChannelReport = '/channel/report', //渠道统计
  GetChannelReportRetain = '/channel/report/retain', //tank
  GetChannelReportDate = '/channel/report/by/date', //渠道统计 - 内页(按日期)
  GetChannelReportDau = '/channel/report/dau', //渠道管理 - 日活分析
  /* 验证账号 */
  GetExistAccount = '/channel/link/agent/exists',
  GetDomainMeili = '/domain/meili', //模糊查询
  getDomainCache = '/domain/cache', //缓存查询
  /**落地页管理 */
  PostChannelTemplateList = '/channel/template/list', //落地页列表
  PostChannelTemplateInsert = '/channel/template/insert', //落地页新增
  PostChannelTemplateUpdate = '/channel/template/update', //落地页修改
  GetChannelTemplateDelete = '/channel/template/delete', //落地页删除
  ChannelUpload = '/channel/upload', //图片上传
  ChannelUploadOpen = '/channel/link/update/app/open', //跟新app
  BatchUpdateOpen = '/channel/link/batch/update/app', //跟新app

  GetTemplateList = '/channel/link/template/list', //获取列表
  /**广告分组*/
  PostAdGroupList = '/ad/group/list', // 广告分组列表
  PostAdGroupInsert = '/ad/group/insert', //广告分组新增
  PostAdGroupUpdate = '/ad/group/update', //广告分组更新
  GetAdGroupDelete = '/ad/group/delete', //广告分组更新
  /**竞价ROI*/
  GetAdGroupSelect = '/ad/group/select', //广告分组下拉框
  GetAdBidsChannelDetail = '/ad/bids/channel/detail', //获取渠道名称
  PostAdBidsInsert = '/ad/bids/insert', //竞价roi新增
  PostAdBidsUpdate = '/ad/bids/update', //竞价roi更新
  PostAdBidsList = '/ad/bids/list', //竞价roi更新
  GetAdBidsDetail = '/ad/bids/detail', //竞价roi明细
  /**月广告ROI统计 */
  PostAdMonthlyList = '/ad/monthly/list', //月广告ROI统计列表
  PostAdMonthlyInsert = '/ad/monthly/insert', //新增 or 续费
  PostAdMonthlyUpdate = '/ad/monthly/update', //更新
  GetAdMonthlyDelete = '/ad/monthly/delete', //删除
  GetAdMonthlyDetail = '/ad/monthly/detail', //详情
}

//新增链接
export const insertChannelList = (params: any) =>
  defHttp.post({ url: Api.InsertChannelList, params }, { isTransformResponse: false });

//编辑链接
export const updateChannelList = (params: any) =>
  defHttp.post({ url: Api.UpdateChannelList, params }, { isTransformResponse: false });

//获取链接详情
export const getChannelDetail = (params: any) => defHttp.get({ url: Api.GetChannelDetail, params });

//链接列表
export const getChannelList = (params: any) => defHttp.post({ url: Api.GetChannelList, params });

//链接列表
export const getChannelAppList = (params: any) =>
  defHttp.get({ url: Api.GetChannelAppList, params }, { isTransformResponse: false });

//域名列表
export const getDomainList = (params: any) =>
  defHttp.post({ url: Api.GetDomainList, params }, { isTransformResponse: false });

//删除链接
export const deleteChannelLink = (params: any) =>
  defHttp.post({ url: Api.DeleteChannelLink, params }, { isTransformResponse: false });

/**
 * 渠道商列表
 * @param params
 * @returns
 */
export const channelProviders = (params: any) =>
  defHttp.get({ url: Api.ChannelProviders, params }, { isTransformResponse: false });

/**
 * 新增渠道商
 * @param params
 * @returns
 */
export const channelProvidersInsert = (params: any) =>
  defHttp.post({ url: Api.ChannelProvidersInsert, params }, { isTransformResponse: false });

/**
 * 更新渠道商
 * @param params
 * @returns
 */
export const channelProvidersUpdate = (params: any) =>
  defHttp.post({ url: Api.ChannelProvidersUpdate, params }, { isTransformResponse: false });

//更新大厅APP展示状态
export const openChannelState = (params: any) =>
  defHttp.post({ url: Api.OpenChannelState, params }, { isTransformResponse: false });

//渠道统计
export const getChannelReport = (params: any) =>
  defHttp.post({ url: Api.GetChannelReport, params });

//渠道统计 - 内页(按日期)
export const getChannelReportDate = (params: any) =>
  defHttp.post({ url: Api.GetChannelReportDate, params });
//渠道统计 - 日活分析
export const getChannelReportDau = (params: any) =>
  defHttp.post({ url: Api.GetChannelReportDau, params }, { isTransformResponse: false });
//渠道统计 - 弹框
export const getChannelReportRetain = (params: any) =>
  defHttp.post({ url: Api.GetChannelReportRetain, params });

//埋点列表
export const getBuriedPointList = (params: any) =>
  defHttp.post({ url: Api.GetBuriedPointList, params }, { isTransformResponse: false });

//新增链接
export const insertBuriedPoint = (params: any) =>
  defHttp.post({ url: Api.InsertBuriedPoint, params }, { isTransformResponse: false });

//删除埋点
export const deleteBuriedPoint = (params: any) =>
  defHttp.post({ url: Api.DeleteBuriedPoint, params }, { isTransformResponse: false });

//编辑链接
export const updateBuriedPoint = (params: any) =>
  defHttp.post({ url: Api.UpdateBuriedPoint, params }, { isTransformResponse: false });

export const getExistAccount = (params: any) =>
  defHttp.get(
    { url: `${Api.GetExistAccount}?account=${params}` },
    { isTransformResponse: false, isMessageModal: false },
  );

//模糊查询

export const getDomainCache = (params: any) =>
  defHttp.get({ url: Api.getDomainCache, params }, { isTransformResponse: false });

export const getDomainMeili = (params?: any) =>
  defHttp.get({ url: Api.GetDomainMeili, params }, { isTransformResponse: false });
// 落地页
export const postChannelTemplateList = (params: any) =>
  defHttp.post({ url: Api.PostChannelTemplateList, params }, { isTransformResponse: false });

export const postChannelTemplateInsert = (params: any) =>
  defHttp.post({ url: Api.PostChannelTemplateInsert, params }, { isTransformResponse: false });

export const postChannelTemplateUpdate = (params: any) =>
  defHttp.post({ url: Api.PostChannelTemplateUpdate, params }, { isTransformResponse: false });

export const getChannelTemplateDelete = (params?: any) =>
  defHttp.get({ url: Api.GetChannelTemplateDelete, params }, { isTransformResponse: false });

export const uploadUnderGroundManager = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    { url: `${VITE_GLOB_API_URL}${Api.ChannelUpload}?t=${userStore.getToken}` },
    params,
  );
};

//更新APP引导
export const channelUploadOpen = (params: any) =>
  defHttp.post({ url: Api.ChannelUploadOpen, params }, { isTransformResponse: false });

export const getBatchUpdateOpen = (params: any) =>
  defHttp.get({ url: Api.BatchUpdateOpen, params }, { isTransformResponse: false });

export const getTemplateList = (params: any) =>
  defHttp.get({ url: Api.GetTemplateList, params }, { isTransformResponse: false });

// 广告分组
export const postAdGroupList = (params: any) =>
  defHttp.post({ url: Api.PostAdGroupList, params }, { isTransformResponse: false });
export const postAdGroupInsert = (params: any) =>
  defHttp.post({ url: Api.PostAdGroupInsert, params }, { isTransformResponse: false });
export const postAdGroupUpdate = (params: any) =>
  defHttp.post({ url: Api.PostAdGroupUpdate, params }, { isTransformResponse: false });
export const getAdGroupDelete = (params: any) =>
  defHttp.get({ url: Api.GetAdGroupDelete, params }, { isTransformResponse: false });

// 竞价ROI
export const getAdGroupSelect = (params?: any) =>
  defHttp.get({ url: Api.GetAdGroupSelect, params }, { isTransformResponse: false });
export const getAdBidsChannelDetail = (params: any) =>
  defHttp.get(
    { url: Api.GetAdBidsChannelDetail, params },
    { isTransformResponse: false, errorMessageMode: 'none' },
  );
export const postAdBidsInsert = (params: any) =>
  defHttp.post({ url: Api.PostAdBidsInsert, params }, { isTransformResponse: false });
export const postAdBidsUpdate = (params: any) =>
  defHttp.post({ url: Api.PostAdBidsUpdate, params }, { isTransformResponse: false });
export const postAdBidsList = (params: any) =>
  defHttp.post({ url: Api.PostAdBidsList, params }, { isTransformResponse: false });
export const getAdBidsDetail = (params: any) =>
  defHttp.get({ url: Api.GetAdBidsDetail, params }, { isTransformResponse: false });

// 月广告ROI统计
export const postAdMonthlyList = (params: any) =>
  defHttp.post({ url: Api.PostAdMonthlyList, params }, { isTransformResponse: false });
export const postAdMonthlyInsert = (params: any) =>
  defHttp.post({ url: Api.PostAdMonthlyInsert, params }, { isTransformResponse: false });
export const postAdMonthlyUpdate = (params: any) =>
  defHttp.post({ url: Api.PostAdMonthlyUpdate, params }, { isTransformResponse: false });
export const getAdMonthlyDelete = (params: any) =>
  defHttp.get({ url: Api.GetAdMonthlyDelete, params }, { isTransformResponse: false });
export const getAdMonthlyDetail = (params: any) =>
  defHttp.get({ url: Api.GetAdMonthlyDetail, params }, { isTransformResponse: false });
// 渠道统计
export const postChannelReport = (params: any) =>
  defHttp.post({ url: Api.PostChannelReport, params }, { isTransformResponse: false });
// 推广效果
export const getStaticsCodeList = (params: any) =>
  defHttp.get({ url: Api.GetStaticsCodeList, params }, { isTransformResponse: false });
// 推广效果悬浮窗口
export const postChannelReportEffectGameMap = (params: any) =>
  defHttp.post({ url: Api.PostChannelReportEffectGameMap, params }, { isTransformResponse: false });
// 统计代码
export const postChannelReportEffect = (params: any) =>
  defHttp.post({ url: Api.PostChannelReportEffect, params }, { isTransformResponse: false });
export const getChannelLinkSelect = (params: any) =>
  defHttp.get({ url: Api.GetChannelLinkSelect, params }, { isTransformResponse: false });
export const getStaticsCodeDomainList = (params: any) =>
  defHttp.get({ url: Api.GetStaticsCodeDomainList, params }, { isTransformResponse: false });
export const postStaticsCodeInsert = (params: any) =>
  defHttp.post({ url: Api.PostStaticsCodeInsert, params }, { isTransformResponse: false });
export const postStaticsCodeUpdate = (params: any) =>
  defHttp.post({ url: Api.PostStaticsCodeUpdate, params }, { isTransformResponse: false });
export const getStaticsCodeDelete = (params: any) =>
  defHttp.get({ url: Api.GetStaticsCodeDelete, params }, { isTransformResponse: false });
export const getStaticsCodeDomainDelete = (params: any) =>
  defHttp.get({ url: Api.GetStaticsCodeDomainDelete, params }, { isTransformResponse: false });
export const getStaticsCodeDetail = (params: any) =>
  defHttp.get({ url: Api.GetStaticsCodeDetail, params }, { isTransformResponse: false });
