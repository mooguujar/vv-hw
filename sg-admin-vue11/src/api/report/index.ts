import { defHttp } from '/@/utils/http/axios';
import { ActingParams, DesMemberParams } from '../model/reportModel';

enum Api {
  /* 报表管理 */
  GetBetRecordList = '/report/game/record/list', //投注记录
  GetPlatformGameList = '/report/game', //平台报表
  GetGameListByMember = '/report/game/by/member', //平台报表/按会员
  GetGameListByGame = '/report/game/by/game', //平台报表/按游戏
  GetMemberReportList = '/report/member', //会员报表
  PostReportMemberSingle = '/report/member/single',
  GetDayReportList = '/report/day', //每日报表
  GetBetDetailReportList = '/report/member/bet/detail', //会员投注详情和投注记录的投注总汇共用一个接口
  GetHourReportList = '/report/hour/list', //小时报表

  //综合报表
  GetDataOverviewList = '/report/general/data_overview', //数据总览
  GetDataOverviewDetailList = '/report/general/data_overview/detail', //数据总览详情
  GetDataCategoryOverviewList = '/report/general/category_overview', //分类总览
  GetDataOperationsOverviewList = '/report/general/operations_overview', //分类总览
  GetDataPeopleOverviewList = '/report/general/people_overview', //人数总览
  ReportGeneralDataOverviewCur = '/report/general/data_overview/cur', // 综合报表顶部币种

  //首存报表
  GetreportDepositList = '/report/firstdeposit/list',
  //留存报表
  GetreportRetainList = '/report/retain/list',

  GetDepositList = '/app/back/report/depositList', //首存报表
  Getgame_typeList = '/game/type/and/platform/list', //游戏大类及游戏平台列表
  /* 报表管理 */

  // 代理报表
  GetActingList = '/report/agent',
  ExportActingList = '/app/back/report/agentExport',
  // 佣金报表
  GetCommissionList = '/app/back/report/commission/list',
  ExportCommissionList = '/app/back/report/commission/export',
  // 会员报表
  GetDesMemberList = '/app/back/report/memberList',
  GetDesMemberTotal = '/app/back/report/memberTotal',
  // 首存报表
  ExportDepositList = '/app/back/report/depositExport',
  // 综合报表
  GetComplexReportList = '/app/back/report/complexReport1',
  GetContentFlow = '/app/back/report/contentFlow',
  GetDepositWithdrawFlow = '/app/back/report/depositWithdrawFlow',
  GetNewUserFlow = '/app/back/report/newUserFlow',
  GetOnlineFlow = '/app/back/report/onlineFlow',
  GetProfitFlow = '/app/back/report/commissionFlow',
  //留存报表
  GetRetentionList = '/app/back/report/stayUser',
  ExportRetentionList = '/app/back/report/stayUserExport',

  // 平台报表导出
  ExportReportGame = '/report/game/export',
  ExportReportMember = '/report/member/export',
  ExportReportDay = '/report/day/export',
  ExportReportAgent = '/report/agent/export',

  ExportReportFirstdeposit = '/report/firstdeposit/export',
  ExportReportRetain = '/report/retain/export',
  ExportReportHour = '/report/hour/export',
}
//投注报表;
export const getBetRecordList = (params: any) =>
  defHttp.post({ url: Api.GetBetRecordList, params });

//平台报表
export const getPlatformGameList = (params: any) =>
  defHttp.post({ url: Api.GetPlatformGameList, params });

//平台报表-按会员
export const getGameListByMember = (params: any) =>
  defHttp.post({ url: Api.GetGameListByMember, params });

//平台报表-按游戏
export const getGameListByGame = (params: any) =>
  defHttp.post({ url: Api.GetGameListByGame, params });

//会员报表
export const getMemberReportList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetMemberReportList, params });
// 会员报表单日详情
export const postReportMemberSingle = (params: any) =>
  defHttp.post({ url: Api.PostReportMemberSingle, params });
//会员报表投注详情
export const getBetDetailReportList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetBetDetailReportList, params });

//每日报表
export const getDayReportList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetDayReportList, params });

//小时报表
export const getHourReportList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetHourReportList, params });

//数据总览
export const getDataOverviewList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetDataOverviewList, params });

//数据总览详情
export const getDataOverviewDetailList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetDataOverviewDetailList, params });

//数据总览
export const getDataCategoryOverviewList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetDataCategoryOverviewList, params });

//人数总览
export const getDataPeopleOverviewList = () => defHttp.post({ url: Api.GetDataPeopleOverviewList });
//顶部币种
export const reportGeneralDataOverviewCur = (params) =>
  defHttp.post({ url: Api.ReportGeneralDataOverviewCur, params });

//运营总览
export const getDataOperationsOverviewList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetDataOperationsOverviewList, params });
//首存报表
export const getDepositList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetDepositList, params });

//游戏大类及游戏平台列表
export const getgame_typeList = () => defHttp.get({ url: Api.Getgame_typeList });

//留存报表
export const getreportDepositList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetreportDepositList, params });

//留存报表
export const getreportRetainList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetreportRetainList, params });

export const getActingList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetActingList, params });

export const exportActingList = (params: any) =>
  defHttp.post(
    { url: Api.ExportActingList, params, responseType: 'arraybuffer' },
    { isReturnNativeResponse: true },
  );

export const getCommissionList = (params: ActingParams) =>
  defHttp.post({ url: Api.GetCommissionList, params });
export const exportCommissionList = (params: any) =>
  defHttp.post(
    { url: Api.ExportCommissionList, params, responseType: 'arraybuffer' },
    { isReturnNativeResponse: true },
  );

export const getDesMemberList = (params: DesMemberParams) =>
  defHttp.post({ url: Api.GetDesMemberList, params });
export const getDesMemberTotal = (params: any) =>
  defHttp.post({ url: Api.GetDesMemberTotal, params });

export const exportDepositList = (params: any) =>
  defHttp.post(
    { url: Api.ExportDepositList, params, responseType: 'arraybuffer' },
    { isReturnNativeResponse: true },
  );

export const getComplexReportList = (params: any) =>
  defHttp.post({ url: Api.GetComplexReportList, params });
export const getContentFlow = (params: any) => defHttp.post({ url: Api.GetContentFlow, params });
export const getDepositWithdrawFlow = (params: any) =>
  defHttp.post({ url: Api.GetDepositWithdrawFlow, params });
export const getNewUserFlow = (params: any) => defHttp.post({ url: Api.GetNewUserFlow, params });
export const getOnlineFlow = (params: any) => defHttp.post({ url: Api.GetOnlineFlow, params });
export const getProfitFlow = (params: any) => defHttp.post({ url: Api.GetProfitFlow, params });
export const getRetentionList = (params: any) =>
  defHttp.post({ url: Api.GetRetentionList, params });

export const exportRetentionList = (params: any) => {
  return defHttp.post(
    { url: Api.ExportRetentionList, params, responseType: 'arraybuffer' },
    { isReturnNativeResponse: true },
  );
};

export const exportReportGame = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportGame, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportReportMember = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportMember, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportReportDay = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportDay, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportReportAgent = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportAgent, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportReportFirstdeposit = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportFirstdeposit, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportReportRetain = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportRetain, params },
    { isTransformResponse: false, isExport: true },
  );
};

export const exportReportHour = (params: any) => {
  return defHttp.post(
    { url: Api.ExportReportHour, params },
    { isTransformResponse: false, isExport: true },
  );
};
