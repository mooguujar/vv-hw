import { BasicPageParams } from '/@/api/model/baseModel';

export type ActingParams = BasicPageParams & {
  agentName?: string,
  order?: string,
  sidx?: string,
  ucode?: string,
  username?: string
};

export type DesMemberParams = BasicPageParams & {
  ets?: string,
  memberId?: number,
  order?: string,
  sidx?: string,
  sts?: string,
  superiorAgentMemberId?: string,
  ucode?: string,
  username?: string
}

export type UpdateParams = {
  id?: number;
}