export interface SearchApiRequestParams {
  order?: string;
  page: number;
  rows: number;
  sidx?: string;
  state?: number;
  title?: string;
  type?: number;
  ucode?: string;
}

export interface AddApiRequestParams {
  beginTime: string;
  content: string;
  endTime: string;
  id?: number;
  popNum: number;
  showType: string;
  state: number;
  title: string;
  type: number;
}

export interface EditBulletinData {
  beginTime?: string;
  content?: string;
  endTime?: string;
  id?: number;
  popNum?: number;
  showType?: string;
  state?: number;
  title?: string;
  type?: number;
  updateBy?: number;
  updateName?: string;
  updateTime?: string;
}
