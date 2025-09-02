import { defHttp } from '/@/utils/http/axios';
import {
  insertdParams,
  getDataParams,
  deteParams,
  stateParams,
  insertdChildParams,
  cdnUpdateParams,
  createdParams,
  createdChildParams,
  deteBatchParams,
  clearParams,
} from '@/api/model/domainModal';

enum Api {
  InsertDomainName = '/domain/create', //创建主域名
  GetdomainListData = '/domain/list', //主域名列表
  DeleteDomain = '/domain/delete', //删除主域名
  StateUpdateDomain = '/domain/update/state', //主域名启用停用
  GetChildDomainList = '/domain/child/list', //子域名列表,
  InsertChildDomainName = '/domain/child/create', //子域名 - 新增
  DomainChildUpdate = '/domain/child/update', //子域名 - 删除
  GetDomainResolve = '/domain/resolve/list', //自定义域名解析
  DeleteChildDomain = '/domain/child/delete', // 删除域名
  GetCdnlinkList = '/site/cdn/link/list', //CDN管理列表
  UpdateCdnLink = '/site/cdn/link/update', //CDN更新
  UpdateDomainVerify = '/domain/verify', //主域名验证
  CreateResolveDomain = '/domain/resolve/create', //创建域名解析
  UpdateResolveDomain = '/domain/resolve/update', //更新域名解析
  BatchDeleteDomain = '/domain/batch/delete', //主域名批量删除
  BatchDeleteChildDomain = '/domain/child/batch/delete', //子域名批量删除
  BatchDeleteResolveDomain = '/domain/resolve/batch/delete', // 域名自定义解析批量删除
  UrlClear = '/domain/purge/cache/url', //url清理缓存 - 批量
  DirectoryClear = '/domain/purge/cache/directory', //目录清理缓存 - 批量
  DomainUpdateRemark = '/domain/update/remark', //编辑
	UpdateChildDomain = '/domain/child/update', //编辑web大厅
	UpdateMainDomain = '/domain/update'  //编辑主域名
}
export function urlClear(params: clearParams) {
  return defHttp.post({ url: Api.UrlClear, params });
}

export function directoryClear(params: clearParams) {
  return defHttp.post({ url: Api.DirectoryClear, params });
}

export const insertDomainName = (params: insertdParams) => {
  return defHttp.post({ url: Api.InsertDomainName, params }, { isTransformResponse: false });
};

export const getdomainListData = (params: getDataParams) => {
  return defHttp.post({ url: Api.GetdomainListData, params });
};

export const deleteDomain = (params: deteParams) => {
  return defHttp.get({ url: Api.DeleteDomain, params }, { isTransformResponse: false });
};

export const stateUpdateDomain = (params: stateParams) => {
  return defHttp.get({ url: Api.StateUpdateDomain, params }, { isTransformResponse: false });
};

export const getChildDomainList = (params: getDataParams) => {
  return defHttp.post({ url: Api.GetChildDomainList, params });
};

export const insertChildDomainName = (params: insertdChildParams) => {
  return defHttp.post({ url: Api.InsertChildDomainName, params }, { isTransformResponse: false });
};

export const getDomainResolve = (params: getDataParams) => {
  return defHttp.post({ url: Api.GetDomainResolve, params });
};

export const deleteChildDomain = (params: deteParams) => {
  return defHttp.get({ url: Api.DeleteChildDomain, params }, { isTransformResponse: false });
};

export const getCdnlinkList = (params: getDataParams) => {
  return defHttp.get({ url: Api.GetCdnlinkList, params });
};

export const updateCdnLink = (params: cdnUpdateParams) => {
  return defHttp.post({ url: Api.UpdateCdnLink, params }, { isTransformResponse: false });
};

export const updateDomainVerify = (params: deteParams) => {
  return defHttp.get({ url: Api.UpdateDomainVerify, params }, { isTransformResponse: false });
};

export const createResolveDomain = (params: createdChildParams) => {
  return defHttp.post({ url: Api.CreateResolveDomain, params }, { isTransformResponse: false });
};
export const updateResolveDomain = (params: createdChildParams) => {
  return defHttp.post({ url: Api.UpdateResolveDomain, params }, { isTransformResponse: false });
};

export const batchDeleteDomain = (params: deteBatchParams) => {
  return defHttp.post({ url: Api.BatchDeleteDomain, params }, { isTransformResponse: false });
};

export const batchDeleteChildDomain = (params: deteBatchParams) => {
  return defHttp.post({ url: Api.BatchDeleteChildDomain, params }, { isTransformResponse: false });
};
//
export const batchDeleteResolveDomain = (params: deteBatchParams) => {
  return defHttp.post(
    { url: Api.BatchDeleteResolveDomain, params },
    { isTransformResponse: false },
  );
};
//

export const domainUpdateRemark = (params: deteParams) => {
  return defHttp.get({ url: Api.DomainUpdateRemark, params }, { isTransformResponse: false });
};


//updateChildDomain
export const updateChildDomain = (params: deteParams) => {
  return defHttp.post({ url: Api.UpdateChildDomain, params }, { isTransformResponse: false });
};

//编辑域名
export const updateMainDomain = (params: any) => {
	return defHttp.get({url: Api.UpdateMainDomain, params}, {isTransformResponse: false})
}