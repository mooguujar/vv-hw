import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type insertCommissionParams = {
  model_ids?: string;
};

export type insertlevelParams = {
  commission_id?: string;
  level?: number;
  effective_amount?: string;
  rebate_ratio?: string;
};

export type deletelevelParams = {
  id?: string;
};

export type insertPerformanceParams = {
  type?: number;
  commission_id: string;
  config_amount: string;
};

export type updatelevelParams = {
  id: string;
  effective_amount: string;
  rebate_ratio: string;
};

export type insertGlobeParams = {
  send_type?: number;
  commission_max_limit: string;
  commission_settlement_type: number;
};

export type updateGlobeParams = {
  id?: string;
  send_type?: number;
  commission_max_limit?: string;
  commission_settlement_type?: number;
};

export type getListParams = BasicPageParams & {
  currency_id?: string;
  start_time?: string;
  end_time?: string;
};

export type lockStateParams = {
  id?: string;
  state?: number;
};

export type getDetailParams = {
  currency_id?: string;
  start_time?: string;
  end_time?: string;
};

export type setParams = {
  id?: string;
};
