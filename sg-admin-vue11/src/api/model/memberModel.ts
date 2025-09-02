import { BasicPageParams } from '/@/api/model/baseModel';
//会员查询
export type inquireParams = BasicPageParams & {
  id?: any;
  state?: Number;
  userName?: string;
  email?: string;
  vip?: Number;
  os?: String;
};
//修改会员
export type UpdateParams = {
  uid?: string;
  state?: number;
  type?: number;
  note?: string;
  phone?: string;
};
export type historyParams = BasicPageParams & {
  uid: string;
};
export type activeParams = BasicPageParams & {};

export type vipParams = BasicPageParams & {};

export type diamondParams = BasicPageParams & {};
//会员新增
export type saveParams = BasicPageParams & {};

interface Import {
  member_type: number;
  parent_name: string;
  username: string;
  realname: string;
  source: string;
  password: string;
  agency_rebate_state: number;
}

//会员导入
export type importParams = {
  import_method?: string;
  security_code?: string;
  d: Array<Import>;
};
export type outpayParams = BasicPageParams & {
  currency_id?: string;
};
//重置资金密码
export type payPwdParams = BasicPageParams & {
  uid?: string;
  created_at?: string;
};
export type memberIdParams = {
  page?: Number;
  currency_type?: Number;
  page_size?: Number;
  word?: String;
  user_type: 0 | 1 | 2 | 3 | 4; // 0查所有 1查询会员 2查代理（代理、大股东） 3查代理 4查股东
};

export type UpdateStateParams = {
  uid?: string;
  state?: number;
  bonus_state?: number;
  commission_state?: number;
  rebate_state?: number;
  note?: string;
};
export type sysParams = {
  username?: String;
  remark?: String;
  currency?: String;
  amount?: String;
  bet_multiplier?: String;
  action?: String;
};

export type nameParams = {
  memberId?: '';
};

export type logParams = BasicPageParams & {
  type?: Number;
};

export type vipUpdateParams = {
  vip?: Number;
  money?: Number;
  days?: Number;
  diamondGift?: Number;
  vipGift?: Number;
  remarks: String;
};

export type vipAddParams = {
  id?: number; //  id
  level?: String; //等级名称，数字，前端需要拼接"VIP"后再显示
  alias?: String; //别称
  deposit?: Number; //流水要求
  save_deposit?: Number; //保级流水
  daily_gift?: Number; //每日礼金
  week_gift?: Number; //每周礼金
  month_gift?: Number; //每月礼金
  up_gift?: Number; //晋级礼金
  birthday_gift?: Number; //生日礼金
  rebate_config?: String;
  is_default?: 1 | 2; //是否默认：1：是，2否
};

export type batchParams = {
  action?: Number;
  wallet_type?: Number;
  currency_id?: String;
  batch_lines?: String;
  bet_multiplier?: Number;
  remark?: String;
};

export type EnableParams = {
  uid?: String;
  record?: any;
};
export type EnableUpdataParams = {
  uids: string;
  state: number;
  remark: string;
};
export type SortParams = {
  id: Number;
  sortBefore: Number;
  sortAfter: Number;
};

export type vipUserParams = BasicPageParams & {};

export type sysMoreParams = BasicPageParams & {};

export type deleParams = {
  id?: number;
};
//编辑会员
export type updateParams = {
  realname?: string;
  vip?: string;
  parent_name?: string;
  phone?: string;
  level_id?: string;
};

export type payParams = {};

export type userListparams = BasicPageParams & {};

export type vipType = {};

export type VipParams = {};

export type viptypeParams = {};
export type getLevelListParams = BasicPageParams & {};

export type addLevelParams = {
  level_id?: number;
  name?: string;
  min_deposit: string;
  bet_multiplier: number;
  is_default?: number;
};

export type detailsParams = {
  uid?: Number;
};

export type cashtypeParams = {
  cash_type?: string;
};

export type logHistoryParams = {
  userId?: number;
};

export type treeParams = {
  level?: string;
  id?: string;
};

export type funParams = BasicPageParams & {
  start_time?: string;
  end_time?: string;
  username?: string;
  business_id?: number;
  currency_id?: number;
  change_id?: number;
};

//银行卡状态
export type bankSateRarams = {
  id?: string;
  state?: number;
};

//修改会员层级
export type updataBatchParams = {
  level_id: string;
  username: string;
  is_lock: number;
};

//验证会员

export type existParams = {
  agent_username?: string;
  username?: string;
};

//查询会员账号

export type getMemberIdParams = {
  word?: string;
  user_type: number;
};

export type updataBatchVipParams = {
  level: string;
  username: string;
  is_lock: number;
};
