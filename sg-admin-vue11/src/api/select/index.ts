import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 业务类型
  GetFinancePlatformList = '/finance/payment/merchant/all',
  GetFinanceMethodList = '/finance/payment/method/all',
  // 优惠报表
  FetchReportActivity = '/report/activity', //外层
  FetchReportActivityDetail = '/report/activity/detail', //内层
  ExportReportActivityExport = '/report/activity/export', //导出
}

export const getFinancePlatformList = (params) =>
  defHttp.get({ url: Api.GetFinancePlatformList, params: params });

export const getFinanceMethodList = (params) => {
  return defHttp.get({ url: Api.GetFinanceMethodList, params: params });
};
export const fetchReportActivity = (params) => {
  return defHttp.post({ url: Api.FetchReportActivity, params: params });
};
export const fetchReportActivityDetail = (params) => {
  return defHttp.post({ url: Api.FetchReportActivityDetail, params: params });
};
export const exportReportActivityExport = (params) => {
  return defHttp.post(
    { url: Api.ExportReportActivityExport, params: params },
    { isTransformResponse: false, isExport: true },
  );
};
