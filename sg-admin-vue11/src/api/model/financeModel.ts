import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type MerchantTreeParams = {
  level?: string;
};

export type DepositCardParams = BasicPageParams & {
  state?: boolean;
  type?: number;
};

export type SaveDepositCardParams = {
  id: number;
  branch?: boolean;
  cardNumber?: string;
  commonAmount?: string;
  holderName?: string;
  name?: string;
  openLevel?: string;
  openTerminal?: string;
  qrUrl?: string;
  state?: number;
  type?: number;
  currency_id?: string;
};

export type DeleteDepositCardParams = number[];

export type GetRechargeOrderListParams = {
  channelId?: number;
  cname?: string;
  etime?: number;
  ets?: string;
  limit: number;
  n?: string;
  order?: number;
  orderNo?: string;
  os?: string;
  p?: string;
  page: number;
  pageType?: number; // 1:在线支付,2:公司入款,3:货币入款
  rows?: number;
  state?: number;
  stime?: number;
  sts?: string;
  type?: number;
  types?: number[];
  memberId?: string;
  vip?: number;
  way?: number;
};

export type AuditRechargeParams = {
  // amount?: number;
  // channelName?: string;
  // channelNo?: string;
  // channelOrder?: string;
  // fee?: number;
  // handTime?: string;
  // money?: number;
  // orderNo?: string;
  // siteId?: number;
  id: string;
  state?: number;
  remark?: string;
  reason?: string;
  rate?: string;
  max?: string;
};

export type MemberAccountRecordParams = BasicPageParams & {
  recordType?: string;
  memberId?: string;
  order?: string;
  ets?: string;
  sts?: string;
};

export type PaymentPlatformParams = BasicPageParams & {
  merchant?: string;
  way?: number;
};

export type PaymentMethodParams = BasicPageParams & {
  id?: number;
  openClient?: number;
  remarks?: string;
  state?: number;
  wayType?: number;
  wayTypeName?: string;
};

export interface DepositCardItem {
  id: string;
  branch?: boolean;
  cardNumber?: string;
  commonAmount?: string;
  holderName?: string;
  name?: string;
  openLevel?: string;
  openTerminal?: string;
  qrUrl?: string;
  state?: string;
  type?: number;
  updateBy: number;
  updateTime: string;
  createBy: number;
  createTime: string;
  exchangeRate: number;
}

export interface RechargeOrderItem {
  agentId: number;
  amount: number;
  appVer: string;
  bank: string;
  bigAgentState: number;
  cardBranch: string;
  cardHolder: string;
  cardName: string;
  cardNo: string;
  cardNumber: string;
  channelId: number;
  channelName: string;
  channelNo: string;
  channelOrder: string;
  classifyId: number;
  coin: number;
  coinRate: number;
  createTs: number;
  days: number;
  depositCardId: number;
  devBand: string;
  devName: string;
  deviceId: string;
  diamondGift: number;
  fee: number;
  formData: string;
  gold: number;
  handTime: string;
  html: string;
  id: number;
  ids: number;
  money: number;
  nickName: string;
  noRebate: number;
  orderNo: string;
  os: string;
  osVer: string;
  parentId: number;
  payerAccount: string;
  payerName: string;
  phone: string;
  pnickName: string;
  pphone: string;
  pusername: string;
  reason: string;
  state: number;
  subState: number;
  type: number;
  typeName: string;
  types: number[];
  memberId: string;
  username: string;
  vip: number;
  vipEndDate: string;
  vipGift: number;
  way: number;
  zone: string;
}

export interface RechargeOrderListResult {
  code: string;
  data: {
    endRow: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    navigateFirstPage: number;
    navigateLastPage: number;
    navigatePages: number;
    navigatepageNums: number[];
    nextPage: number;
    pageNum: number;
    pageSize: number;
    pages: number;
    prePage: number;
    size: number;
    startRow: number;
    total: number;
    list: RechargeOrderItem[];
  };
  text: string;
}

export interface PaymentPlatformChannelItem {
  channel: number;
  way: number;
  fee: number;
  moneys: string;
  fixedMoneys: string;
  moneyStart: number;
  moneyEnd: number;
  productId: string;
}

export interface PaymentPlatformItem {
  id: number;
  appId: number;
  state: number;
  merchant: number;
  merchantCode: string;
  merchantName: string;
  payDomain: string;
  key0: string;
  channelList: PaymentPlatformChannelItem[];
  wayInfo: string;
  moneyInfo: string;
}

export interface PaymentMethodItem {
  icon: number;
  id: number;
  openClient: number;
  remarks: string;
  site: number;
  sort: number;
  state: number;
  stateName: string;
  wayName: number;
  wayType: number;
  wayTypeName: string;
}

export interface UserVipItem {
  label: string;
  value: string;
  // sort: number,
  // desc: string
}

export type GetDepositCardResutlModel = BasicFetchResult<DepositCardItem>;

export type GetRechargeOrgerListResutlModel = RechargeOrderListResult;

export type commissionWithdrawalParams = {
  audit?: number;
  auditByName?: string;
  username?: string;
  order?: string;
  startTime?: string;
  endTime?: string;
  ucode?: string;
  sidx?: string;
  rows?: number;
  page?: number;
};
export interface commissionWithdrawalOrder {
  // amount?: number;
  // audit?: number;
  // auditBy?: number;
  // currencyNum?: number;
  // exchangeRate?: number;
  // fee?: number;
  // handTime?: string;
  // id?: number;
  // money?: number;
  // orderNo?: string;
  // payTime?: string;
  // reason?: string;
  state: number;
  // memberId?: string;
  // username?: string;
  // why?: string;
  withdraw_count?: number;
}
export interface commissionWithdrawalResponse {
  code: string;
  data: {
    current: number;
    hitCount: boolean;
    optimizeCountSql: boolean;
    orders: {
      asc: boolean;
      column: string;
    }[];
    pages: number;
    records: commissionWithdrawalOrder[];
    searchCount: boolean;
    size: number;
    total: number;
  };
  error?: string;
  text: string;
}

export type commissionWithdrawalResutlModel = BasicFetchResult<commissionWithdrawalResponse>;

export type withdrawalsAuditParams = {
  withdraw_merchant_id?: string;
  remark?: string;
  reason?: string;
  state: number;
  id: string;
};

export type depositSummaryParams = {
  businessTypes?: string;
  sts: string;
  ets: string;
  memberId?: string;
};
export interface depositSummaryOrder {
  amount?: number;
  amountEnd?: number;
  amountStart?: number;
  businessType?: number;
  businessTypeName?: string;
  buzId?: string;
  id?: number;
  remark?: string;
  style?: number;
  styleName?: string;
  typeName?: string;
  memberId?: string;
  way?: number;
  wayName?: string;
}
interface depositSummaryResponse {
  code: string;
  data: {
    current: number;
    hitCount: boolean;
    optimizeCountSql: boolean;
    orders: { asc: boolean; column: string }[];
    pages: number;
    records: depositSummaryOrder[];
    searchCount: boolean;
    size: number;
    total: number;
  };
  error?: string;
  text: string;
}

export type depositSummaryResutlModel = BasicFetchResult<depositSummaryResponse>;

// 支付管理
interface CompanyCurrency {}
