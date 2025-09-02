import { BasicPageParams } from '/@/api/model/baseModel';

export type createdParams = {
  cdn_name?: string;
  name?: string;
};
export type getDataParams = BasicPageParams & {
  operate_name?: string;
  cdn_name?: string;
  name?: string;
  state?: number;
  use_state?: number;
  use_type?: number;
  is_page?: number;
  domain_name?: string;
};

export type deteParams = {
  id?: string;
};

export type stateParams = {
  id: string | number;
  state?: number;
};

export interface insertdChildParams {
  domain_id?: string;
  use_type?: number;
  child_name: string;
}

export type cdnUpdateParams = {
  cdn_id?: string;
  state?: number;
};

export type createdChildParams = {
  domain_id?: string;
  host_record?: string;
  resolve_type?: string;
  record_value?: string;
  ttl?: number;
};

export type deteBatchParams = {
  ids?: string;
};

export type clearParams = {
  name: string;
};
