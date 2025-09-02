export type UpdateAdvertiseParams = {
  title: string;
  expireTime: string;
  previewUrl: string;
  jumpUrl: string;
  status: number;
  caption: string;
  spaceId: string;
};

export interface AdvertiseItem {
  id: number;
  spaceId: string;
  title: string;
  caption: string;
  previewUrl: string;
  jumpUrl: string;
  status: number;
  createTime: string;
  updateTime: string;
  expireTime: string;
  createBy: number;
  updateBy: number;
  operatorName: string;
}
