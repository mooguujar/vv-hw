import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  LoginAdminResultModel,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/back/v2/sys/login',
  GetUserInfo = '/auth/back/v2/sys/user/info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  GetOssUrl = '/app/back/v2/oss/config',

  GetSite = '/app/api/site/all',

  LoginAdmin = '/admin/login',
  Logout = '/admin/logout',
  PrivGroup = '/admin/priv/by/group',

  // 信息公告
  RemoveNotificationsList = '/notifications/remove/all',
  RemoveNotifications = '/notifications/remove',
  ReadNotifications = '/notifications/read',
  merchantNotice = '/zk/notice/read',
  GetNotice = '/notifications/notice',
  GetFinance = '/notifications/finance',
  GetRisk = '/notifications/risk',
  GetPromo = '/notifications/promo',
  ModifyPassword = '/admin/update/self/password',
  /** ROI密码 */
  PostRoiPwdUpdate = '/ad/pwd/update', // 修改Roi密码接口
  GetIfRoiPwdSet = '/ad/pwd/assert/set', // 是否已创建Roi密码
  PostRoiPwdSet = '/ad/pwd/set', // 创建Roi密码
  GetRoiPwdVerify = '/ad/pwd/verify', // 验证Roi密码
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<{ code: string; data: GetUserInfoModel; text: string }>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none', isReturnNativeResponse: true },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}
export function getOssUrl() {
  return defHttp.get({ url: Api.GetOssUrl }, { isReturnNativeResponse: false });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout }, { isReturnNativeResponse: true });
}

export function getSite() {
  return defHttp.get({ url: Api.GetSite }, { isReturnNativeResponse: true });
}

export function getPrivGroup(params) {
  return defHttp.get({ url: Api.PrivGroup, params }, { isTransformResponse: true });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

/**
 * @description: user login api
 */
export function loginAdmin(params: LoginAdminResultModel) {
  return defHttp.post<LoginAdminResultModel>(
    {
      url: Api.LoginAdmin,
      params,
    },
    {
      isTransformResponse: false,
    },
  );
}

export function getNotice(params: any) {
  return defHttp.get({ url: Api.GetNotice, params });
}
export function getFinance(params: any) {
  return defHttp.get({ url: Api.GetFinance, params });
}
export function getRisk(params: any) {
  return defHttp.get({ url: Api.GetRisk, params });
}
export function getPromo(params: any) {
  return defHttp.get({ url: Api.GetPromo, params });
}

export function removeNotificationsList(params: any) {
  return defHttp.post({ url: Api.RemoveNotificationsList, params }, { isTransformResponse: false });
}

export function removeNotifications(params: any) {
  return defHttp.post({ url: Api.RemoveNotifications, params }, { isTransformResponse: false });
}

export function readNotifications(params: any) {
  return defHttp.post({ url: Api.ReadNotifications, params }, { isTransformResponse: false });
}
export function readMerchantNotice(params: any) {
  return defHttp.get({ url: Api.merchantNotice, params }, { isTransformResponse: false });
}
export function modifyPassword(params: any) {
  return defHttp.post({ url: Api.ModifyPassword, params }, { isTransformResponse: false });
}
export function roiPwdUpdate(params: any) {
  return defHttp.post({ url: Api.PostRoiPwdUpdate, params }, { isTransformResponse: false });
}
export function roiPwdIfSet(params: any) {
  return defHttp.get({ url: Api.GetIfRoiPwdSet, params }, { isTransformResponse: false });
}
export function roiPwdSet(params: any) {
  return defHttp.post(
    { url: Api.PostRoiPwdSet, params },
    { errorMessageMode: 'none', isReturnNativeResponse: true },
  );
}
export function roiPwdVerify(params: any) {
  return defHttp.get(
    { url: Api.GetRoiPwdVerify, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
}
