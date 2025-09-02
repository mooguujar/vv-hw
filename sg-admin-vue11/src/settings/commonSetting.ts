import { nextTick } from 'vue';
import { useGameSortStore } from '/@/store/modules/gameSort';
// 客户端
export const Client = {
  24: 'PC',
  25: 'H5',
  26: 'Android',
  27: 'IOS',
};

export const OPEN_TERMINAL_OPTIONS = ['PC', 'H5', 'Android', 'IOS'];
export const FIATCURRENCY = ['701', '702', '703', '704', '705']; // 法币
export const VIRTUALCURRENCY = ['706', '707']; // 虚列币

// 客户端列表
export const clientList = [
  { label: Client[24], value: 24 },
  { label: Client[25], value: 25 },
  { label: Client[26], value: 26 },
  { label: Client[27], value: 27 },
];

export const clientListString = [
  { label: Client[24], value: '24' },
  { label: Client[25], value: '25' },
  { label: Client[26], value: '26' },
  { label: Client[27], value: '27' },
];

export const ClientMappings = {
  PC: '24',
  H5: '25',
  Android: '26',
  IOS: '27',
  其他: '28',
};

//会员日志-登录日志
export const deviceMap = {
  '24': 'PC',
  '25': 'H5',
  '26': 'Android',
  '27': 'IOS',
  '28': '其他',
};

//加减款统一配置 --end

export interface TabItem {
  key: string;
  value: string;
}

//加减款处理币种
export const currentyOptions = {
  '701': 'CNY',
  '702': 'BRL',
  '703': 'INR',
  '704': 'KVND',
  '705': 'THB',
  '706': 'USDT',
  '707': 'BTC',
  '708': 'ETH',
  '709': 'BNB',
  '710': 'EUR',
  '711': 'JPY',
  '712': 'CAD',
  '713': 'ARS',
  '714': 'CLP',
  '715': 'PEN',
  '716': 'MXN',
  '717': 'LTC',
  '718': 'DOGE',
  '719': 'BCH',
  '720': 'XRP',
  '721': 'EOS',
  '722': 'TRX',
  '723': 'USDC',
  '724': 'APE',
  '725': 'BUSD',
  '726': 'CRO',
  '727': 'DAI',
  '728': 'LINK',
  '729': 'SAND',
  '730': 'SHIB',
  '731': 'UNI',
  '732': 'MATIC',
  '733': 'KRW',
  '734': 'IDR',
  '735': 'PHP',
};

//协议类型定义
export const protocolOptions = {
  '1801': 'ERC20',
  '1802': 'TRC20',
  '1803': 'USDT',
  '1804': 'BTC',
  '1805': 'Omni',
  '1806': 'ETH',
  '1807': 'ERC20',
  '1808': 'BNB',
  '1809': 'BEP20',
};

// 游戏平台
export const gamingPlatform = [
  { label: 'EVO', value: 101 },
  { label: 'PG', value: 301 },
  { label: 'EVOSlot', value: 302 },
  { label: 'IMSB', value: 401 },
];

// 注册配置
export const siteProtocolOptions = [
  {
    label: 'POP/SMTP',
    value: '1',
  },
  {
    label: 'IMAP/SMTP',
    value: '2',
  },
];

// 站点id
export const SiteId = '1';

// 路由
export const RouterNameList = [
  'Member',
  'Finance',
  'Promotion',
  'Report',
  'DiscountActivity',
  'Risk',
  'System',
];
export const chineseNumbersArray = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '二十一',
  '二十二',
  '二十三',
  '二十四',
  '二十五',
  '二十六',
  '二十七',
  '二十八',
  '二十九',
  '三十',
  '三十一',
  '三十二',
  '三十三',
  '三十四',
  '三十五',
  '三十六',
  '三十七',
  '三十八',
  '三十九',
  '四十',
  '四十一',
  '四十二',
  '四十三',
  '四十四',
  '四十五',
  '四十六',
  '四十七',
  '四十八',
  '四十九',
  '五十',
];

export const optionSetting = {
  '101': 'EVO视讯',
  '102': 'PP视讯',
  '103': 'DB视讯',
  '104': 'AG视讯',
  '105': 'BG视讯',
  '106': 'DG视讯',
  '107': 'BBIN真人',
  '201': 'JDB捕鱼',
  '202': 'FG捕鱼',
  '203': 'BG捕鱼',
  '204': 'MT捕鱼',
  '205': 'DB捕鱼',
  '206': 'CQ9捕鱼',
  '207': '开元捕鱼',
  '208': 'AG捕鱼',
  '209': 'LEG捕鱼',
  '210': '天游捕鱼',
  '301': 'PG老虎机',
  '303': 'PP老虎机',
  '304': 'BTG老虎机',
  '305': 'Netent老虎机',
  '306': 'Nolimit City老虎机',
  '307': 'Red Tiger老虎机',
  '308': 'JDB老虎机',
  '310': 'MG老虎机',
  '311': 'Hacksaw老虎机',
  '312': 'AG老虎机(XIN)',
  '313': 'FG老虎机',
  '314': 'DB老虎机',
  '315': 'CQ9老虎机',
  '316': 'AG老虎机(YOPLAY)',
  '317': 'BBIN老虎机',
  '318': 'MT电子',
  '319': '乐游电子',
  '320': '天游电子',
  '401': 'IM体育',
  '501': '开元棋牌',
  '502': 'MT棋牌',
  '503': 'DB棋牌',
  '504': 'FG棋牌',
  '505': '乐游棋牌',
  '506': '天游棋牌',
  '801': '赌场游戏',
};

export const optionsConfim = {
  1: '自动确认',
  2: '脚本确认',
  3: '人工确认',
};

export const optionsTransfer = {
  1: '转账失败',
  2: '转账成功',
  3: '转账处理中',
};

//1自动确认 2脚本确认 3人工确认
//1转账失败 2转账成功 3转账处理中'

export let commomVenueList = {
  '1': '视讯',
  '2': '捕鱼',
  '3': '老虎机',
  '4': '体育',
  '5': '棋牌',
  // '6':'电竞',
  '7': '彩票',
  '8': '赌场游戏',
};

export let optionsGamesList = [
  { value: '101', label: 'EVO视讯', type: 1 },
  { value: '102', label: 'PP视讯', type: 1 },
  { value: '103', label: 'DB视讯', type: 1 },
  { value: '104', label: 'AG视讯', type: 1 },
  { value: '105', label: 'BG视讯', type: 1 },
  { value: '106', label: 'DG视讯', type: 1 },
  { value: '107', label: 'BBIN视讯', type: 1 },
  { value: '108', label: 'SEXYBCRT视讯', type: 1 },
  { value: '109', label: '完美视讯', type: 1 },
  { value: '201', label: 'JDB捕鱼', type: 2 },
  { value: '202', label: 'FG捕鱼', type: 2 },
  { value: '203', label: 'BG捕鱼', type: 2 },
  { value: '204', label: 'MT捕鱼', type: 2 },
  { value: '205', label: 'DB捕鱼', type: 2 },
  { value: '206', label: 'CQ9捕鱼', type: 2 },
  { value: '207', label: '开元捕鱼', type: 2 },
  { value: '208', label: 'AG捕鱼', type: 2 },
  { value: '209', label: 'LEG捕鱼', type: 2 },
  { value: '210', label: '天游捕鱼', type: 2 },
  { value: '212', label: 'JILI捕鱼', type: 2 },
  { value: '213', label: 'FC捕鱼', type: 2 },
  { value: '301', label: 'PG老虎机', type: 3 },
  { value: '303', label: 'PP老虎机', type: 3 },
  { value: '304', label: 'BTG老虎机', type: 3 },
  { value: '305', label: 'Netent老虎机', type: 3 },
  { value: '306', label: 'Nolimit City老虎机', type: 3 },
  { value: '307', label: 'Red Tiger老虎机', type: 3 },
  { value: '308', label: 'JDB老虎机', type: 3 },
  { value: '310', label: 'MG老虎机', type: 3 },
  { value: '311', label: 'Hacksaw老虎机', type: 3 },
  { value: '312', label: 'AG老虎机(XIN)', type: 3 },
  { value: '313', label: 'FG老虎机', type: 3 },
  { value: '314', label: 'DB老虎机', type: 3 },
  { value: '315', label: 'CQ9老虎机', type: 3 },
  { value: '316', label: 'AG老虎机(YOPLAY)', type: 3 },
  { value: '317', label: 'BBIN老虎机', type: 3 },
  { value: '318', label: 'MT老虎机', type: 3 },
  { value: '320', label: '天游老虎机', type: 3 },
  { value: '321', label: 'JILI老虎机', type: 3 },
  { value: '322', label: 'FC老虎机', type: 3 },
  { value: '401', label: 'IM体育', type: 4 },
  { value: '501', label: '开元棋牌', type: 5 },
  { value: '502', label: 'MT棋牌', type: 5 },
  { value: '503', label: 'DB棋牌', type: 5 },
  { value: '504', label: 'FG棋牌', type: 5 },
  { value: '505', label: 'LEG棋牌', type: 5 },
  { value: '506', label: '天游棋牌', type: 5 },
  { value: '508', label: 'JILI棋牌', type: 5 },
  { value: '801', label: '赌场游戏', type: 8 },
];

let plateOptions: any = [];
const info_venue = async () => {
  const gameSortStore = useGameSortStore();
  await gameSortStore.setgame_typeList();
  plateOptions = [];
  let { getPlatformList, getgame_typeList } = useGameSortStore();
  for (const key in getPlatformList) {
    plateOptions.push(...(getPlatformList[key] as any));
  }
  plateOptions =
    plateOptions &&
    plateOptions.map((item: any) => {
      return {
        ...item,
        label: item.platform_name,
        name: item.platform_name,
        value: item.platform_id,
        type: item.game_type,
        // state: platform_ids.value.some((el) => el == item.platform_id) ? 1 : 2,
      };
    });
  getgame_typeList = getgame_typeList.filter((item: any) => {
    return item.name != '全部' && item.game_type != '6' && item.game_type != 'all';
  });
  optionsGamesList = plateOptions;
  Object.keys(commomVenueList).forEach((key) => {
    commomVenueList[key] = (getgame_typeList as any).find((o) => o.game_type == key)?.name || [];
  });
};
nextTick(() => {
  info_venue();
});

export const coinType = {
  zh_CN: 'CNY',
  pt_BR: 'BRL',
  vi_VN: 'KVND',
  th_TH: 'THB',
  hi_IN: 'INR',
  en_US: 'USDT',
};

//  1 a01
//  2 btf
//  3 wi6
//  4 ju8
//  5 btb
//  6 x02
//  7 v03

export const SiteCurrencyIdMap = {
  '1': '701', // wi6
  '3': '702', // wi6
  '2': '704', // betff
  '5': '704', // betbo
  '6': '701', // x02
  '7': '701', // v03
};

export const SiteTimeIdMap = {
  '1': 'Etc/GMT', // wi6
  '3': 'America/Sao_Paulo', // wi6
  '2': 'Asia/Ho_Chi_Minh', // betff
  '5': 'Asia/Ho_Chi_Minh', // betbo
  '6': 'Asia/Shanghai', // x02
  '7': 'Asia/Shanghai', // v03
};

export const LimitSize = ['1', '2', '3', '4', '5', '6', '7', '9'];

// 初始化币种使用
export const currentyOptionsList = [
  {
    attr: '1',
    id: '702',
    name: 'BRL',
    pid: '700',
    sortlevel: '007002',
  },
  {
    attr: '1',
    id: '701',
    name: 'CNY',
    pid: '700',
    sortlevel: '007001',
  },
  {
    attr: '1',
    id: '703',
    name: 'INR',
    pid: '700',
    sortlevel: '007003',
  },
  {
    attr: '1',
    id: '704',
    name: 'KVND',
    pid: '700',
    sortlevel: '007004',
  },
  {
    attr: '1',
    id: '705',
    name: 'THB',
    pid: '700',
    sortlevel: '007005',
  },
  {
    attr: '2',
    id: '706',
    name: 'USDT',
    pid: '700',
    sortlevel: '007006',
  },
  {
    attr: '2',
    id: '707',
    name: 'BTC',
    pid: '700',
    sortlevel: '007007',
  },
  {
    attr: '2',
    id: '708',
    name: 'ETH',
    pid: '700',
    sortlevel: '007008',
  },
  {
    attr: '2',
    id: '709',
    name: 'BNB',
    pid: '700',
    sortlevel: '007009',
  },
  {
    attr: '1',
    id: '710',
    name: 'EUR',
    pid: '700',
    sortlevel: '007010',
  },
  {
    attr: '1',
    id: '711',
    name: 'JPY',
    pid: '700',
    sortlevel: '007011',
  },
  {
    attr: '1',
    id: '712',
    name: 'CAD',
    pid: '700',
    sortlevel: '007012',
  },
  {
    attr: '1',
    id: '713',
    name: 'ARS',
    pid: '700',
    sortlevel: '007013',
  },
  {
    attr: '1',
    id: '714',
    name: 'CLP',
    pid: '700',
    sortlevel: '007014',
  },
  {
    attr: '1',
    id: '715',
    name: 'PEN',
    pid: '700',
    sortlevel: '007015',
  },
  {
    attr: '1',
    id: '716',
    name: 'MXN',
    pid: '700',
    sortlevel: '007016',
  },
  {
    attr: '2',
    id: '717',
    name: 'LTC',
    pid: '700',
    sortlevel: '007017',
  },
  {
    attr: '2',
    id: '718',
    name: 'DOGE',
    pid: '700',
    sortlevel: '007018',
  },
  {
    attr: '2',
    id: '719',
    name: 'BCH',
    pid: '700',
    sortlevel: '007019',
  },
  {
    attr: '2',
    id: '720',
    name: 'XRP',
    pid: '700',
    sortlevel: '007020',
  },
  {
    attr: '2',
    id: '721',
    name: 'EOS',
    pid: '700',
    sortlevel: '007021',
  },
  {
    attr: '2',
    id: '722',
    name: 'TRX',
    pid: '700',
    sortlevel: '007022',
  },
  {
    attr: '2',
    id: '723',
    name: 'USDC',
    pid: '700',
    sortlevel: '007023',
  },
  {
    attr: '2',
    id: '724',
    name: 'APE',
    pid: '700',
    sortlevel: '007024',
  },
  {
    attr: '2',
    id: '725',
    name: 'BUSD',
    pid: '700',
    sortlevel: '007025',
  },
  {
    attr: '2',
    id: '726',
    name: 'CRO',
    pid: '700',
    sortlevel: '007026',
  },
  {
    attr: '2',
    id: '727',
    name: 'DAI',
    pid: '700',
    sortlevel: '007027',
  },
  {
    attr: '2',
    id: '728',
    name: 'LINK',
    pid: '700',
    sortlevel: '007028',
  },
  {
    attr: '2',
    id: '729',
    name: 'SAND',
    pid: '700',
    sortlevel: '007029',
  },
  {
    attr: '2',
    id: '730',
    name: 'SHIB',
    pid: '700',
    sortlevel: '007030',
  },
  {
    attr: '2',
    id: '731',
    name: 'UNI',
    pid: '700',
    sortlevel: '007031',
  },
  {
    attr: '2',
    id: '732',
    name: 'MATIC',
    pid: '700',
    sortlevel: '007032',
  },
  {
    attr: '1',
    id: '733',
    name: 'KRW',
    pid: '700',
    sortlevel: '007033',
  },
  {
    attr: '1',
    id: '734',
    name: 'IDR',
    pid: '700',
    sortlevel: '007034',
  },
  {
    attr: '1',
    id: '735',
    name: 'PHP',
    pid: '700',
    sortlevel: '007035',
  },
];
