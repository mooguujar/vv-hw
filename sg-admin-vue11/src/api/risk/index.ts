import { defHttp } from '/@/utils/http/axios';

enum Api {
  /* 黑名单 */
  GetRiskBlackList = '/blacklist/list', //IP黑名单列表
  UpdateRiskBlack = '/blacklist/update', //IP黑名单新增和编辑
  DeletRiskBlack = '/blacklist/update/state', //IP黑名单批量删除
  /* 黑名单 */

  /* 盈利榜单 */
  GetwinTopList = '/risk/win/top/list', //盈利榜单列表
  UpdatewinTopList = '/risk/win/top/update', //更新盈利榜单列表
  /* 盈利榜单 */

  /* 低倍打码 */
  GetLowList = '/risk/low/list', //低倍打码列表
  UpdateLowList = '/risk/low/update', //低倍打码更新
  DetailLowList = '/risk/low/detail', //低倍打码详情
  /* 低倍打码 */

  /* 高倍爆奖 */
  GetHighList = '/risk/high/list', //高倍爆奖列表
  UpdateHighList = '/risk/high/update', //高倍爆奖更新
  /* 高倍爆奖 */

  /* 监控参数 */
  /* 监控参数 */
  GetRiskWinConfig = '/risk/win/config', //获取风控参数配置数据
  GetRiskLowConfig = '/risk/low/config',
  GetRiskHighConfig = '/risk/high/config',
  GetRiskMutualConfig = '/risk/mutual/config',
  GetRiskLinkedConfig = '/risk/linked/config',

  UpdateRiskConfig = '/risk/config/update', //修改风控参数配置数据
  /* 监控参数 */

  /* 关联记录 */
  GetAssociateList = '/risk/associate/list', //获取关联记录列表
  UpdatAassociateList = '/risk/associate/update', //更新关联记录
  GetAssociateDetailList = '/risk/associate/detail/list', //获取关联记录详情列表
  UpdateAssociateDetailList = '/risk/associate/detail/update', //更新关联记录详情
  /* 关联记录 */

  /* 对打监控 */
  GetFightList = '/risk/fight/list', //获取对打记录列表
  UpdatFightList = '/risk/fight/update', //更新对打记录
  GetFightDetailList = '/risk/fight/detail/list', //获取对打记录详情列表
  GetFightSite = '/risk/fight/site', // 获取对打监控站点
  /* 对打监控 */

  /* 未完成记录 */
  GetNoticeList = '/risk/notice', //低倍打码、高倍爆奖、盈利榜单、对打监控 未完成记录
  /* 未完成记录 */
}
//IP黑名单列表
export const getRiskBlackList = (params: any) =>
  defHttp.post({ url: Api.GetRiskBlackList, params });
//IP黑名单新增
export const updateRiskBlack = (params: any) =>
  defHttp.post({ url: Api.UpdateRiskBlack, params }, { isTransformResponse: false });
// IP黑名单批量删除
export const deletRiskBlack = (params) => {
  params['state'] = 3; //目前这个接口只用于删除state写死3
  return defHttp.post({ url: Api.DeletRiskBlack, params }, { isTransformResponse: false });
};
// 盈利榜单列表
export const getwinTopList = (params) => {
  return defHttp.post({ url: Api.GetwinTopList, params });
};
// 更新盈利榜单列表
export const updatewinTopList = (params) => {
  return defHttp.post({ url: Api.UpdatewinTopList, params }, { isTransformResponse: false });
};
// 低倍打码列表
export const getLowList = (params) => {
  return defHttp.post({ url: Api.GetLowList, params });
};
// 低倍打码更新
export const updateLowList = (params) => {
  return defHttp.post({ url: Api.UpdateLowList, params }, { isTransformResponse: false });
};
// 低倍打码详情
export const detailLowList = (params) => {
  return defHttp.post({ url: Api.DetailLowList, params });
};
// 获取风控参数配置数据
export const getRiskWinConfig = () => {
  return defHttp.get({ url: Api.GetRiskWinConfig });
};
export const getRiskLowConfig = () => {
  return defHttp.get({ url: Api.GetRiskLowConfig });
};
export const getRiskHighConfig = () => {
  return defHttp.get({ url: Api.GetRiskHighConfig });
};
export const getRiskMutualConfig = () => {
  return defHttp.get({ url: Api.GetRiskMutualConfig });
};
export const getRiskLinkedConfig = () => {
  return defHttp.get({ url: Api.GetRiskLinkedConfig });
};

// 修改风控参数配置数据
export const updateRiskConfig = (params) => {
  return defHttp.post({ url: Api.UpdateRiskConfig, params }, { isTransformResponse: false });
};

// 高倍爆奖列表
export const getHighList = (params) => {
  return defHttp.post({ url: Api.GetHighList, params });
};
// 高倍爆奖更新
export const updateHighList = (params) => {
  return defHttp.post({ url: Api.UpdateHighList, params }, { isTransformResponse: false });
};
// 关联记录列表
export const getAssociateList = (params) => {
  return defHttp.post({ url: Api.GetAssociateList, params });
};
// 更新关联记录列表
export const updatAassociateList = (params) => {
  return defHttp.post({ url: Api.UpdatAassociateList, params }, { isTransformResponse: false });
};
// 关联关联记录详情-列表
export const getAssociateDetailList = (params) => {
  return defHttp.post({ url: Api.GetAssociateDetailList, params });
};
// 更新关联记录详情
export const updateAssociateDetailList = (params) => {
  return defHttp.post(
    { url: Api.UpdateAssociateDetailList, params },
    { isTransformResponse: false },
  );
};
// 对打记录列表
export const getFightList = (params) => {
  return defHttp.post({ url: Api.GetFightList, params });
};
// 更新记录列表
export const updatFightList = (params) => {
  return defHttp.post({ url: Api.UpdatFightList, params }, { isTransformResponse: false });
};
// 对打记录详情列表
export const getFightDetailList = (params) => {
  return defHttp.post({ url: Api.GetFightDetailList, params });
};
//获取未完成列表数据
export const getNoticeList = () => defHttp.get({ url: Api.GetNoticeList });
// 获取对打监控站点
export const getFightSite = () => defHttp.get({ url: Api.GetFightSite });
