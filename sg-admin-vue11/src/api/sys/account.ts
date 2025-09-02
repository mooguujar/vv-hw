import { AccountParams, AccountListItem, AccountListGetResultModel } from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetUserListByPage = '/admin/list',
  UpdateUserInfo = '/admin/update',
  AddUserInfo = '/admin/insert',
}

//用户管理页面
export const getUserListByPage = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.GetUserListByPage, params });

export const addUserInfo = (params: AccountListItem) =>
  defHttp.post({ url: Api.AddUserInfo, params });

export const updateUserInfo = (params: AccountListItem) =>
  defHttp.post({ url: Api.UpdateUserInfo, params });
