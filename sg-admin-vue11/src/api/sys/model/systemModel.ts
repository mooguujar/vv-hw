import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type BannerParams = {
  banner_type: Number;
};
export type BannerListGetResultModel = BasicFetchResult<BannerListItem>;

export interface BannerListItem {
  banner_type?: Number;
  client?: String[]; //["24","25","26","27"]
  jump_type?: Number;
  jump_url?: String; //http://www.abc.com
  state: 1;
  content?: {
    [country: string]: string;
    //  cn_zh: '內容'
    //  en_us: 'content'
  };
  image_url?: {
    [country: string]: string;
    //  cn_zh: "http://123.com"
    //  en_us: "http://123.com"
  };
  image_info?: {
    banner_style?: 1 | 2 | 3; //1靠右 2靠左 3自定义
    color: String; //颜色
    icon_tab: String; //TAB 1或者游戏
    icon: String; //a.png'
    button_state: 1; //1显示 2关闭
    button_text: String; //按钮文字
    button_jump_type: 1 | 2 | 3 | 4 | 5; //按钮跳转类型 1自定义 2娱乐城 3体育 4优惠活动 5联盟中心
    button_jump_url: String; //http://123.com
  };
}
export type BannerUploadPic = {
  uploadfile?: String;
  lang?: String; // 语系 zh_CN: 简中 en: 英文
};

export type BannerSwitch = {
  id: String;
  banner_type?: Number;
  state?: Number;
};
export type BannerDelete = {
  id: String;
  banner_type?: Number;
};
export type BannerItemUpdate = {};

export type AccountParams = BasicPageParams & {
  state?: Number;
  gid?: String;
  name?: String;
};

export type RoleParams = {
  roleName?: string;
  roleId?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export interface AccountListItem {
  id?: Number;
  name?: string;
  password?: string;
  state?: number;
  group_id?: number;
  seamo?: string;
}

export interface SortNoticeItem {
  id: string;
  notice_type: number;
  index_id: string;
  sort_after: number;
  sort_before: number;
}
/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>;

export interface PlatformListRequest {
  page: number;
  page_size: number;
  name?: string; // 中文
  en_name?: string; // 英文名
  pt_name?: string; // 葡文名
  vn_name?: string; // 越南名
  th_name?: string; // 泰文名
  id?: string; // 场馆id
  game_type?: 1 | 3 | 4; // 游戏类型:1=真人,2=捕鱼,3=电子,4=体育,5=棋牌,6=电竞
  maintained?: 0 | 1 | 2; // 维护状态0全部1正常2维护中
  state: 1 | 2; // 上线状态1上线2下线
}

export interface SiteSettingState {
  site_id?: number;
  tag?: any;
}

export interface PlatformUpdateState {
  id: number;
  state?: 1 | 2;
  maintained?: 1 | 2;
}

export interface GameUpdate {
  id: string;
  platform_id: string;
  name: string;
  en_name: string;
  pt_name: string;
  th_name: string;
  vn_name: string;
  client_type: string; // 响应时需转换为json，提交时需转换为字符串
  game_type: number;
  game_id: string;
  img: string;
  sorting: number;
  created_at: number;
  online: number;
  is_hot: number;
  is_new: number;
  is_fav: number;
  tag_id: string;
  currency: string; // 响应时需转换为json，提交时需转换为字符串
  lang: string; // 响应时需转换为json，提交时需转换为字符串
}

export interface GameBacthUpdate {
  id: number;
  type: 'hot' | 'fav' | 'rec'; // hot热门 fav收藏 rec推荐
  val: 1 | 2;
}

export interface GameUpdateState {
  id: number;
  online: 1 | 2;
}

export interface GamePlatformUpdateState {
  id?: number;
  platform_id?: number;
  online: 1 | 2;
  is_hot?: number;
}

export interface GameListRequest {
  page: number;
  page_size: number;
  name?: string; // 中文
  en_name?: string; // 英文名
  pt_name?: string; // 葡文名
  vn_name?: string; // 越南名
  th_name?: string; // 泰文名
  game_type?: 1 | 3; // 游戏类型:1=真人,2=捕鱼,3=电子,4=体育,5=棋牌,6=电竞
  online?: 1 | 2; // 是否上线:1=上线,2=下线
  is_hot?: 1 | 2; // 是否热门 1是 2否
  is_new?: 1 | 2; // 是否推荐 1是 2否
  tag_id?: number; // 游戏标签
  platform_id?: string; // 场馆id
}

export interface GameListResponse {
  d: GameUpdate;
  s: number;
  t: number;
}

export interface InsertSiteNotice {
  notice_type: 1 | 2; //公告类型 1:弹窗公告 2:跑马灯
  send_type: 1; //发送人群 1:全部会员 2:指定会员 3:会员层级 4:vip等级 5:全部代理
  usernames: string; //指定会员 ['a', 'b] 需要转换
  user_levels: string; //指定层级 [1,2,3] 需要转换
  vip_levels: string; //指定vip等级 [1,2,3] 需要转换
  title: string; //标题
  start_time: string; //开始时间
  end_time: string; //结束时间
  client: string; //客户端 '1,2,3,4' 需要转换
  bounce_location: 1 | 2 | 3; //弹跳位置 1:不限制 2:登录前 3:登录后
  bounce_frequency: 1 | 2; //弹跳频率 1:不限制 2:自定义
  bounce_frequency_limit: number; //自定义频率次数 （次/日）
  pop_up_type: 1 | 2; //弹窗内容类型 1:文字 2:图片
  content: string; //内容 {"lang":"abc"} 需要转换
  image_url: string; //预览图生成的Url '{"lang":"http://123.com"}'
  state: 1 | 2; //状态 1:显示  2:隐藏
  image_info: {
    pop_up_style: 1; // 弹窗样式
    // style_url: 'http://abc';
    color: string; // 弹窗颜色 用于反显
    icon_tab: string; // 图标分组 用于反显
    icon: string; // 图标名 用于反显
  }; //图片信息
}

export type UserParams = BasicPageParams & {
  state?: string;
  gid?: string;
  name?: string;
};

export type insertParamsAccount = {
  username?: string;
  nickname?: string;
  password?: string;
  group_id?: string;
  sites?: any;
  state?: number;
  seamo?: string;
};

export type GroupListParams = BasicPageParams &{
  pid?: String; // pid没有就不填 如果是二级角色得传当前列表那一列数据的pid
  site_id: String; // site_id是你登陆当前站点的id
}

export interface CheckExistParams {
  name: String;
  site_id: String;
}

export interface InsertGroupParams {
  pid?: String; // pid  一層不要傳, 二級帶上級的gid塞到新增下級的pid
  permission?: String; // 权限id
  name: String; //名称
  noted?: String; //节点
  state?: Number; // 状态 1:显示 2:隐藏
}
// export interface UpdateGroupParams {
//   gid: String;
//   permission?: Array; // 权限id
//   name?: String; //名称
//   noted?: String; //节点
// }

export interface UpdateGroupParams {
  gid: String;
  permission?: any; // 权限id
  name?: String; //名称
  noted?: String; //节点
}

export interface PrivParams {
  site_id: String;
}
