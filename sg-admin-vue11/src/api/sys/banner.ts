import { useUserStoreWithOut } from '/@/store/modules/user';
import { getAppEnvConfig } from '/@/utils/env';
import { defHttp } from '/@/utils/http/axios';
import {
  BannerListGetResultModel,
  BannerParams,
  BannerSwitch,
  BannerDelete,
} from '@/api/sys/model/systemModel';

const { VITE_GLOB_API_URL } = getAppEnvConfig();

enum Api {
  // 站点banner列表
  BannerList = '/site/banner/list',
  // 站点banner新增
  InsertBanner = '/site/banner/insert',
  // 图片上传
  UploadBannerPic = '/site/banner/v4/upload',
  // banner开/关
  SwitchBanner = '/site/banner/update/state',
  // 删除banner
  DeleteBanner = '/site/banner/delete',
  // 修改banner
  UpdateBanner = '/site/banner/update',

  BannerDetail = '/site/banner/detail',

  /* (轮播相关接口) */
  InsertBannerV2 = '/site/banner/v4/insert',
  // 站点banner修改
  UpdateBannerV2 = '/site/banner/v4/update',
  // 站点banner列表
  GetBannerV2List = '/site/banner/v4/list',
  // 站点banner详情
  GetBannerV2Detail = '/site/banner/v4/detail',
  // 站点banner排序
  SortBannerV2List = '/site/banner/v4/sort',
  // 站点banner图片上传
  UploadBannerV2 = '/site/banner/v4/upload',
  //站点banner删除
  DeleteBannerV2 = '/site/banner/v4/delete',
  //站点banner状态开关
  UpdateBannerV2state = '/site/banner/v4/update/state',
  // 站点banner活动列表
  GetBannerV2PromoList = '/site/banner/v4/promo/list',
  /* (轮播相关接口)*/
}
export const getBannerList = (params: BannerParams) =>
  defHttp.get<BannerListGetResultModel>({ url: Api.BannerList, params });

// BannerListItem 內容未知 因此內容先沒寫
export const insertBanner = (params: any) =>
  defHttp.post({ url: Api.InsertBanner, params }, { isTransformResponse: false });

// export const UploadBannerPic = (params: BannerUploadPic) =>
//   defHttp.post({ url: Api.UploadBannerPic, params });

export const SwitchBanner = (params: BannerSwitch) =>
  defHttp.post({ url: Api.SwitchBanner, params });

export const DeleteBanner = (params: BannerDelete) =>
  defHttp.post({ url: Api.DeleteBanner, params });

export const UpdateBanner = (params: any) =>
  defHttp.post({ url: Api.UpdateBanner, params }, { isTransformResponse: false });

export const UploadBannerPic = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    { url: `${VITE_GLOB_API_URL}${Api.UploadBannerPic}?t=${userStore.getToken}` },
    params,
  );
};

export const getBannerDetail = (params) => {
  return defHttp.get({
    url: `${Api.BannerDetail}?id=${params.id}&banner_type=${params.banner_type}`,
  });
};

/* (轮播相关接口) */
export const insertBannerV2 = (params: any) =>
  defHttp.post({ url: Api.InsertBannerV2, params }, { isTransformResponse: false });

export const updateBannerV2 = (params: any) =>
  defHttp.post({ url: Api.UpdateBannerV2, params }, { isTransformResponse: false });

export const getBannerV2List = (params: any) => defHttp.get({ url: Api.GetBannerV2List, params });

export const getBannerV2Detail = (params: any) =>
  defHttp.get({ url: Api.GetBannerV2Detail, params });

export const sortBannerV2List = (params: any) =>
  defHttp.post({ url: Api.SortBannerV2List, params });

export const deleteBannerV2 = (params: any) => defHttp.post({ url: Api.DeleteBannerV2, params });

export const updateBannerV2state = (params: any) =>
  defHttp.post({ url: Api.UpdateBannerV2state, params });

export const uploadBannerV2 = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    { url: `${VITE_GLOB_API_URL}${Api.UploadBannerV2}?t=${userStore.getToken}` },
    params,
  );
};

export const getBannerV2PromoList = (params: any) =>
  defHttp.get({ url: Api.GetBannerV2PromoList, params });

/* (轮播相关接口)*/
