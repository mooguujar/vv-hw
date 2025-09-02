import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type GetRedeemCodeParams = BasicPageParams & {
  giftCode?: string;
  giftType?: number;
  limit?: number;
  holderName?: string;
  status?: number;
  userName?: string;
};

export type BatchGenerateRedeemCodeParams = {
  generateNum: number;
  validDays: number;
  vipType: number;
}

export interface RedeemCodeItem {
  expireTime: string,
  giftCode: string,
  giftType: number,
  handId: number,
  handName: number,
  id: number,
  status: number,
  useTime: string,
  userId: number,
  userName: string,
  vipDays: number,
  vipType: number
}