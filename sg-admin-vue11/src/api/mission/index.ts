import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';
import { useUserStoreWithOut } from '/@/store/modules/user';

const { VITE_GLOB_API_URL } = getAppEnvConfig();

enum Api {
  /** 任务管理接口 */
  GetMissionList = '/job/list', //任务列表
  InsertMission = '/job/insert', //新增任务
  UpdateMission = '/job/update', //更新任务
  GetMissionDetail = '/job/detail11', //任务详情
  UpdateMissionState = '/job/update/state', //任务状态更新
  CloseMissionState = '/job/close', //任务状态关闭
  MissionDelete = '/job/delete', //任务删除
  UploadMissionImage = '/job/upload', //任务图片上传
  UploadfeedbackImage = '/own/feedback/upload', //任务图片上传
  InsertMissionCategory = '/job/category/insert', //任务分类新增
  MissionCategoryNameList = '/job/category/name/list', //任务分类名称列表
  MissionCategoryList = '/job/category/list', //任务分类管理列表
  DeleteMissionCategory = '/job/category/delete', //任务分类管理删除
  UpdateMissionCategory = '/job/category/update', //任务分类管理更新
  MissionCategoryDetail = '/job/category/detail', //任务分类管理详情
  CloseMissionCategory = '/job/category/close', //任务分类状态关闭
  RelatedMissionCategory = '/job/category/related', //任务分类批量关联
  RelatedMissionCategoryList = '/job/category/related/list', //任务分类关联记录
  GetRelatedList = '/job/category/related/list', //任务分类关联记录
  GetReceiveList = '/job/receive/list', //任务领取记录
  SortCategoryList = '/job/category/sort/update', //分类排序
  sortMission_list = '/job/sort/update', //分类排序
}
export const UpdateMission = (params: any) =>
  defHttp.post(
    { url: Api.UpdateMission, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
export const GetMissionDetail = (params: any) => defHttp.get({ url: Api.GetMissionDetail, params });

export const InsertMission = (params: any) =>
  defHttp.post(
    { url: Api.InsertMission, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务状态关闭 */
export const closeMissionState = (params: any) =>
  defHttp.get(
    { url: Api.CloseMissionState, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务删除 */
export const missionDelete = (params: any) =>
  defHttp.get(
    { url: Api.MissionDelete, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务管理接口列表 */
export const getMissionList = (params: any) =>
  defHttp.get({ url: Api.GetMissionList, params }, { isAllResponse: true });
/** 任务分类管理名称列表 */
export const getMissionCategoryNameList = (params: any) =>
  defHttp.get(
    { url: Api.MissionCategoryNameList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务分类管理列表 */
export const getMissionCategoryList = (params: any) =>
  defHttp.get({ url: Api.MissionCategoryList, params });
/** 任务分类管理新增 */
export const insertMissionCategory = (params: any) =>
  defHttp.post(
    { url: Api.InsertMissionCategory, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务分类管理修改 */
export const updateMissionCategory = (params: any) =>
  defHttp.post(
    { url: Api.UpdateMissionCategory, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务分类管理删除 */
export const deleteMissionCategory = (params: any) =>
  defHttp.get(
    { url: Api.DeleteMissionCategory, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务分类状态关闭 */
export const closeMissionCategory = (params: any) =>
  defHttp.get(
    { url: Api.CloseMissionCategory, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
/** 任务分类关联记录 */
export const relatedMissionCategoryList = (params: any) =>
  defHttp.get({ url: Api.RelatedMissionCategoryList, params });
/** 任务分类批量关联 */
export const relatedMissionCategory = (params: any) =>
  defHttp.post(
    { url: Api.RelatedMissionCategory, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );

/** 任务图片上传 */
export const uploadMissionImage = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    { url: `${VITE_GLOB_API_URL}${Api.UploadMissionImage}?t=${userStore.getToken}` },
    params,
  );
};
export const uploadfeedbackImage = (params) => {
  const userStore = useUserStoreWithOut();
  return defHttp.uploadFile(
    {
      url: `${VITE_GLOB_API_URL}${Api.UploadfeedbackImage}?t=${userStore.getToken}`,
    },
    params,
  );
};

/** 任务管理接口列表 */
export const getRelatedList = (params: any) => defHttp.get({ url: Api.GetRelatedList, params });

export const getReceiveList = (params: any) => defHttp.get({ url: Api.GetReceiveList, params });

export const sortCategoryList = (params: any) =>
  defHttp.post(
    { url: Api.SortCategoryList, params },
    { errorMessageMode: 'none', isTransformResponse: false },
  );

export const sortMission_list = (params: any) =>
  defHttp.post({ url: Api.sortMission_list, params }, { isTransformResponse: false });
