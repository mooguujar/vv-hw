import { defHttp } from '/@/utils/http/axios';
import {
  insertCommissionParams,
  insertlevelParams,
  deletelevelParams,
  insertPerformanceParams,
  updatelevelParams,
  insertGlobeParams,
  updateGlobeParams,
  getListParams,
  lockStateParams,
  getDetailParams,
  setParams,
} from '@/api/model/commissionModel';

enum Api {
  /*佣金配置*/
  GetCommissionConfig = '/commission/config/detail/v1', //佣金管理-佣金配置详情
  GetCommissionConfigV1 = '/commission/config/detail/v1', // 代理配置-代理配置详情
  UpdateCommissionConfigV1 = '/commission/config/update/v1', // 代理配置-代理配置-更新或新增
  InsertCommissionModel = '/commission/config/model/insert', //新增佣金配置
  InsertLevelConfig = '/commission/config/level/insert', //梯级新增佣金配置
  DeleteLavelConfig = '/commission/config/level/delete', //佣金配置梯级删除
  UpdateLevelConfig = '/commission/config/level/update',
  DeleteLavelConfigGame = '/commission/config/delete', //游戏类型Tab删除
  InsertPerformanceConfig = '/commission/config/performance/insert', //新增梯级业绩计算
  UpdatePerformanceConfig = '/commission/config/performance/update', //修改业绩计算
  InsertGlobeConfig = '/commission/config/global/insert', //新增结算配置
  UpdateGlobeConfig = '/commission/config/global/update', //编辑结算
  /*佣金配置*/
  /*佣金审核*/
  GetReviewList = '/commission/review/list', //审核佣金明细
  GetTotalReviewList = '/commission/review/total', //审核佣金总计
  GetRecordList = '/commission/records/list', //佣金发放明细
  GetTotleRecordList = '/commission/records/total', //佣金发放汇总
  UpdateSendSingleReview = '/commission/review/send/single', //佣金审核单个发放
  UpdateLockreview = '/commission/review/lock', //佣金审核锁定
  GetDetailSendAll = '/commission/review/send/all/detail', //获取一键发放详情
  UpdateSendReviewAll = '/commission/review/send/all', //佣金发放
  ExportCommissionRecords = '/commission/records/list/export', //佣金记录导出
  ExportCommissionReview = '/commission/review/list/export', // 佣金审核导出
  GetDetailRecordList = '/commission/records/detail', //佣金发放记录详情
  GetSummaryRecordList = '/commission/records/summary', //佣金发放记录汇总
  /*佣金审核*/
  //
}

// 代理配置-代理配置详情
export const getCommissionConfigV1 = () => {
  return defHttp.get({ url: Api.GetCommissionConfigV1 });
};

// 代理配置-代理配置-更新或新增
export const updateCommissionConfigV1 = (params: any) => {
  return defHttp.post({ url: Api.UpdateCommissionConfigV1, params });
};

//获取佣金配置详情
export const getCommissionConfig = () => {
  return defHttp.get({ url: Api.GetCommissionConfig });
};

//新增佣金配置
export const insertCommissionModel = (params: insertCommissionParams) => {
  return defHttp.post({ url: Api.InsertCommissionModel, params });
};

//梯级新增佣金配置
export const insertLevelConfig = (params: insertlevelParams) => {
  return defHttp.post({ url: Api.InsertLevelConfig, params });
};
//佣金配置梯级删除;
export const deleteLavelConfig = (params: deletelevelParams) => {
  return defHttp.post(
    { url: Api.DeleteLavelConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
export const updateLevelConfig = (params: updatelevelParams) => {
  return defHttp.post({ url: Api.UpdateLevelConfig, params });
};
//佣金配置游戏删除;
export const deleteLavelConfigGame = (params: deletelevelParams) => {
  return defHttp.post({ url: Api.DeleteLavelConfigGame, params });
};

//新增佣金业绩计算
export const insertPerformanceConfig = (params: insertPerformanceParams) => {
  return defHttp.post(
    { url: Api.InsertPerformanceConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//编辑佣金业绩计算
export const updatePerformanceConfig = (params: insertPerformanceParams) => {
  return defHttp.post(
    { url: Api.UpdatePerformanceConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//新增结算配置
export const insertGlobeConfig = (params: insertGlobeParams) => {
  return defHttp.post(
    { url: Api.InsertGlobeConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//修改结算配置
export const updateGlobeConfig = (params: updateGlobeParams) => {
  return defHttp.post(
    { url: Api.UpdateGlobeConfig, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//佣金审核明细
export const getReviewList = (params: getListParams) => {
  return defHttp.post({ url: Api.GetReviewList, params });
};

//佣金审核总计
export const getTotalReviewList = (params: getListParams) => {
  return defHttp.post({ url: Api.GetTotalReviewList, params });
};

//佣金发放记录
export const getRecordList = (params: getListParams) => {
  return defHttp.post({ url: Api.GetRecordList, params });
};
//佣金发放汇总
export const getTotleRecordList = (params: getListParams) => {
  return defHttp.post({ url: Api.GetTotleRecordList, params });
};

//佣金审核锁定
export const updateLockreview = (params: lockStateParams) => {
  return defHttp.post(
    { url: Api.UpdateLockreview, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//获取一键发放详情
export const getDetailSendAll = (params: getDetailParams) => {
  return defHttp.post({ url: Api.GetDetailSendAll, params });
};

//佣金审核一件发放
export const updateSendReviewAll = (params: getDetailParams) => {
  return defHttp.post(
    { url: Api.UpdateSendReviewAll, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//佣金记录导出
export const exportCommissionRecords = (params: getListParams) => {
  return defHttp.post(
    { url: Api.ExportCommissionRecords, params },
    { isTransformResponse: false, isExport: true },
  );
};

//审核记录导出
export const exportCommissionReview = (params) => {
  return defHttp.post(
    { url: Api.ExportCommissionReview, params },
    { isTransformResponse: false, isExport: true },
  );
};
//佣金单个发放
export const updateSendSingleReview = (params: setParams) => {
  return defHttp.post(
    { url: Api.UpdateSendSingleReview, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//佣金发放记录
export const getDetailRecordList = (params: any) => {
  return defHttp.post(
    { url: Api.GetDetailRecordList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};

//佣金发放记录汇总
export const getSummaryRecordList = (params: any) => {
  return defHttp.post(
    { url: Api.GetSummaryRecordList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
};
