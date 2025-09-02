import { BasicPageParams } from '/@/api/model/baseModel';

export type perListParams = BasicPageParams & {
  status?: Number;
};

export type cityParams = {};

export type delePerParams = {};

export type beautyparams = BasicPageParams & {};

export type perEditParams = {};

export type ClassifyParams = {};

export type videoParams = BasicPageParams & {};

export type shortParams = BasicPageParams & {};

export type detailParams = {};

export type videoDetailParams = {
  id?: number;
};

export type perSave = {};

export type perSaveParams = {};

export type passParams = {};

export type deleParamsCom = [id?: string, bbsId?: number];

export type perStateParams = {};

export type commentUpdateParams = {};

export type countUnlockparams = {
  peripheralId?: String;
  page: 1;
  page_size: 25;
};

export type unlockExportParams = {};
