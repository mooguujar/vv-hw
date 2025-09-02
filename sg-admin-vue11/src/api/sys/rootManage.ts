import { defHttp } from '/@/utils/http/axios';
import {
  GroupListParams,
  CheckExistParams,
  InsertGroupParams,
  UpdateGroupParams,
  PrivParams,
} from '@/api/sys/model/systemModel';

enum Api {
  // group列表
  GroupList = '/admin/group/list',
  // group名称存在
  CheckExist = '/admin/group/name/exist',
  // group角色新增
  InsertGroup = '/admin/group/insert',
  // group角色修改
  UpdateGroup = '/admin/group/update',
  // group角色删除
  DeleteGroup = '/admin/group/delete',
  // priv列表
  //   PrivList = '/admin/priv/list',
  // priv 会员登陆后查询权限资源列表
  GetPrivList = '/admin/priv/by/site/id',

  // priv 会员登陆后查询权限资源列表
  admin_list = '/admin/list',

  // priv 关联账号更新接口
  admin_link = '/admin/group/admin/link',

  GetadminPrivList = '/admin/priv/list',
}

export const getGroupList = (params: GroupListParams) =>
  defHttp.post({ url: Api.GroupList, params });

export const checkExist = (params: CheckExistParams) =>
  defHttp.get({ url: Api.CheckExist, params });

export const insertGroup = (params: InsertGroupParams) =>
  defHttp.post({ url: Api.InsertGroup, params });

export const updateGroup = (params: UpdateGroupParams) =>
  defHttp.post({ url: Api.UpdateGroup, params });

export const deleteGroup = (params) => defHttp.get({ url: `${Api.DeleteGroup}?gid=${params}` });

export const getPrivList = (params: PrivParams) =>
  defHttp.get({ url: `${Api.GetPrivList}?site_id=${params}` });

export const admin_list = (params: any) => {
  let { page, gid, zk, page_size } = params;
  return defHttp.get({
    url: `${Api.admin_list}?state=0&page=${page}&gid=${gid + ''}&zk=${zk}&page_size=${page_size}`,
  });
};

export const admin_link = (params: any) => defHttp.post({ url: Api.admin_link, params });


export const getadminPrivList = () => defHttp.get({ url: Api.GetadminPrivList });
