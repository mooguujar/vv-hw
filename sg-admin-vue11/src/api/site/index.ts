import { defHttp } from '/@/utils/http/axios';

enum Api {
  BuildAppPkg = '/app/pkg/build',
  GetBuildAppPkglist = '/app/pkg/list',
  GetChatList = '/chat/list',
  DeleteChatList = '/chat/delete',
  GetLimitCountry = '/area/limit/country',
  GetBlackList = '/blacklist/list', //获取黑名单
  InsertBlackList = '/blacklist/insert', //IP黑名单添加
  UpdateBlackList = '/blacklist/update', //IP黑名单修改
  DeleteBlackList = '/blacklist/delete', //黑名单删除
  DeleteChatBatchList = '/chat/batch/delete',
  SpeakAmount = '/chat/bound',
  ForbidInsert = '/forbid/insert',
  ForbidList = '/forbid/list',
  FrobidBatchInsert = '/forbid/batch/insert', //手动禁言
  ForbidUpdate = '/forbid/update',
  ForbidBatchDelete = '/forbid/batch/delete',
  ChatLangList = '/chat/lang/list',
  GetZkSiteAppUpdateDetail = '/zk/site/app/update/detail', //app更新详情获取
}

// 打包接口
export const buildAppPkg = (params) => {
  return defHttp.post({ url: Api.BuildAppPkg, params }, { isTransformResponse: false });
};

// 获取打包list接口
export const getBuildAppPkglist = (params) => {
  return defHttp.get({ url: Api.GetBuildAppPkglist, params });
};

export const chatList = (params) => {
  return defHttp.post({ url: Api.GetChatList, params });
};

export const deleteChatList = (params) => {
  return defHttp.post({ url: Api.DeleteChatBatchList, params }, { isTransformResponse: false });
};

export const getLimitCountry = (params) => {
  return defHttp.get({ url: Api.GetLimitCountry, params });
};
//获取黑名单
export const getBlackList = (params) => {
  return defHttp.post({ url: Api.GetBlackList, params });
};

//添加黑名单
export const insertBlackList = (params) => {
  return defHttp.post({ url: Api.InsertBlackList, params }, { isTransformResponse: false });
};

//更新黑名单
export const updateBlackList = (params) => {
  return defHttp.post({ url: Api.UpdateBlackList, params }, { isTransformResponse: false });
};

//删除黑名单
export const deleteBlackList = (params) => {
  return defHttp.get({ url: Api.DeleteBlackList, params }, { isTransformResponse: false });
};
export const deleteChatBatchList = (params) => {
  return defHttp.post({ url: Api.DeleteChatBatchList, params }, { isTransformResponse: false });
};
export const speakAmount = (params) => {
  return defHttp.post({ url: Api.SpeakAmount, params }, { isTransformResponse: false });
};
//禁言接口
export const forbidInsert = (params) => {
  return defHttp.post({ url: Api.ForbidInsert, params }, { isTransformResponse: false });
};
//禁言列表
export const forbidList = (params) => {
  return defHttp.post({ url: Api.ForbidList, params });
};
export const frobidBatchInsert = (params) => {
  return defHttp.post({ url: Api.FrobidBatchInsert, params }, { isTransformResponse: false });
};
export const forbidUpdate = (params) => {
  return defHttp.post({ url: Api.ForbidUpdate, params }, { isTransformResponse: false });
};
export const forbidBatchDelete = (params) => {
  return defHttp.post({ url: Api.ForbidBatchDelete, params }, { isTransformResponse: false });
};
export const chatLangList = (params) => {
  return defHttp.post({ url: Api.ChatLangList, params });
};
// app更新详情获取
export const getZkSiteAppUpdateDetail = () => {
  return defHttp.get({ url: Api.GetZkSiteAppUpdateDetail });
};
