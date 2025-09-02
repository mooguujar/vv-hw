import { COLORS } from './const';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
// 客户端
export const Client = {
  24: 'PC',
  25: 'H5',
  26: 'Android',
  27: 'IOS',
  28: 'PWA',
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

export function useBannerTypeOptions() {
  const { t } = useI18n();
  const bannerTypeOptions = [
    { label: t('common.casino'), value: 1 },
    { label: t('common.physical_education'), value: 2 },
  ];
  return { bannerTypeOptions };
}

export const ClientMappings = {
  PC: '24',
  H5: '25',
  Android: '26',
  IOS: '27',
};

//会员日志-登录日志
export const deviceMap = {
  '24': 'PC',
  '25': 'H5',
  '26': 'Android',
  '27': 'IOS',
  '28': 'PWA',
};
// 客户端会员下拉
export function useClientSelect() {
  const { t } = useI18n();
  const clientSelect = [
    { label: t('common.All'), value: '' },
    { label: Client[24], value: '24' },
    { label: Client[25], value: '25' },
    { label: Client[27], value: '27' },
    { label: Client[26], value: '26' },
    { label: Client[28], value: '28' },
  ];
  return { clientSelect };
}

// 客户端
export function useClientType() {
  const { t } = useI18n();
  const clientType = [
    { label: t('WEB'), value: '1' },
    { label: t('APP'), value: '2' },
  ];
  return { clientType };
}

// 财务管理
export function useClientFinanceSelect() {
  const { t } = useI18n();
  const clientFinanceSelect = [
    { label: t('common.All'), value: '' }, //全部 (先撤回，因为转成中文时无变化回中文)
    { label: Client[24], value: '24' },
    { label: Client[25], value: '25' },
    { label: Client[26], value: '26' },
    { label: Client[27], value: '27' },
    { label: Client[28], value: '28' },
  ];
  return { clientFinanceSelect };
}

// 会员类型
export function useMemberTypeList() {
  const { t } = useI18n();
  const memberTypeList = [
    { value: 1, label: t('common.member'), type: 'member' },
    { value: 2, label: t('common.agency'), type: 'proxy' },
    { value: 3, label: t('common.Substantial_shareholder'), type: 'partner' },
  ];
  return { memberTypeList };
}

// 货币自由兑换
export function useSecurityOptions() {
  const { t } = useI18n();
  const securityOptions = [
    { label: t('common.On'), value: 1 },
    { label: t('common.Off'), value: 2 },
  ];
  return { securityOptions };
}

//加减款统一配置 --end

export interface TabItem {
  key: string;
  value: string;
}
export function useGameTabList() {
  const { t } = useI18n();
  const gameTabList: TabItem[] = [
    { key: '4', value: t('table.system.system_sport_game') },
    { key: '1', value: t('table.system.system_real_person') },
    { key: '3', value: t('table.member.member_electic_') },
    { key: '2', value: t('table.member.member_fish') },
    { key: '8', value: t('table.system.system_original_game') },
    { key: '5', value: t('table.member.member_chess') },
    { key: '7', value: t('table.member.member_Lottery') },
  ];
  return { gameTabList };
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
export function usePrizeConditonOptions() {
  const { t } = useI18n();
  const prizeConditon = [
    {
      label: t('modalForm.member.member_requirement_model1'),
      key: 'vrate',
      ty: 819,
      afterLabel: t('modalForm.member.member_requirement_model4'),
    },
    {
      label: t('modalForm.member.member_requirement_model1'),
      key: 'drate',
      ty: 819,
      afterLabel: t('modalForm.member.member_requirement_model5'),
    },
    {
      label: t('modalForm.member.member_requirement_model2'),
      key: 'vrate',
      ty: 820,
      afterLabel: t('modalForm.member.member_requirement_model6'),
    },
    {
      label: t('modalForm.member.member_requirement_model2'),
      key: 'drate',
      ty: 820,
      afterLabel: t('modalForm.member.member_requirement_model7'),
    },
    {
      label: t('modalForm.member.member_requirement_model3'),
      key: 'vrate',
      ty: 821,
      afterLabel: t('modalForm.member.member_requirement_model8'),
    },
    {
      label: t('modalForm.member.member_requirement_model3'),
      key: 'drate',
      ty: 821,
      afterLabel: t('modalForm.member.member_requirement_model9'),
    },
  ];
  return { prizeConditon };
}

//风险管理-IP黑名单
export function useLimitOptions() {
  const { t } = useI18n();
  const limitOptions = [
    {
      label: t('business.common_all'),
      value: 0,
    },
    {
      label: t('modalForm.risk.risk_register'),
      value: 1,
    },
    {
      label: t('modalForm.risk.risk_login'),
      value: 2,
    },
  ];
  return { limitOptions };
}
//游戏平台映射
export function useGameMapping() {
  const { t } = useI18n();
  const gameMapping: any = {
    1: t('table.system.system_real_person'),
    2: t('table.system.system_fish_get'),
    3: t('table.system.system_electronic'),
    4: t('table.system.system_physical_education'),
    8: t('table.system.system_original_game'),
    5: t('table.system.system_get_chess'),
  };
  return { gameMapping };
}
//会员管理-VIP等级-返水配置
export function useGameDictionary() {
  const { t } = useI18n();
  const gameDictionary = {
    1: t('table.system.system_real_man'),
    2: t('table.system.system_fish_get'),
    3: t('table.system.system_elec'),
    4: t('table.system.system_sport'),
    5: t('table.system.system_get_chess'),
    6: t('table.system.system_get_chess'),
    7: t('common.lottery'),
    8: t('table.system.system_original_game'),
  };
  return { gameDictionary };
}

//会员管理-VIP等级-领取记录
export function useReciveRecordsOptions() {
  const { t } = useI18n();

  const reciveRecordsOptions = [
    {
      value: '',
      label: t('common.All'),
    },
    {
      value: '814',
      label: t('member.vip.TransactionRebate'),
    },
    {
      value: '818',
      label: t('member.vip.promotion_bonus'),
    },
    {
      value: '819',
      label: t('member.vip.daily_bonus'),
    },
    {
      value: '820',
      label: t('member.vip.weekly_bonus'),
    },
    {
      value: '821',
      label: t('member.vip.monthly_bonus'),
    },
  ];
  return { reciveRecordsOptions };
}

export function useCashTypeOptions() {
  const { t } = useI18n();

  const cashTypeOptions = {
    814: t('member.vip.TransactionRebate'),
    818: t('member.vip.promotion_bonus'),
    819: t('member.vip.daily_bonus'),
    820: t('member.vip.weekly_bonus'),
    821: t('member.vip.monthly_bonus'),
    822: t('member.vip.TransactionVIpBirthday'),
  };
  return { cashTypeOptions };
}

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

export function useRegisterListOptions() {
  const { t } = useI18n();
  const registerListOptions = [
    { label: t('common.username'), value: 'username' },
    { label: t('modalForm.system.system_email'), value: 'email' },
    { label: t('modalForm.system.system_email_verification'), value: 'email_validation' },
    { label: t('common.Mobile_phone_number'), value: 'phone' },
    { label: t('common.phone_verify'), value: 'phone_validation' },
    { label: t('common.Date_of_birth'), value: 'birthday' },
  ];
  return { registerListOptions };
}

export function useSafetyOptions() {
  const { t } = useI18n();
  const safetyOptions = [
    { label: t('modalForm.member.member_google_code'), value: 1 },
    { label: t('modalForm.member.member_fund'), value: 2 },
    { label: t('common.All'), value: 3 },
  ];
  return { safetyOptions };
}

export function useNeedSpent() {
  const { t } = useI18n();
  const needSpent = [
    { label: t('business.common_yes'), value: 1 },
    { label: t('business.common_no'), value: 2 },
  ];
  return needSpent;
}

//币种对应的用户名语言
export const currencyToRealname = {
  CNY: 'cn_name',
  BRL: 'br_name',
  THB: 'th_name',
  VND: 'vn_name',
  USDT: 'uid',
};

export const bannerjumpTo = [
  { label: t('component.banner.custom'), value: 1 },
  { label: t('component.banner.entertainment_city'), value: 2 },
  { label: t('component.banner.physical_education'), value: 3 },
  { label: t('component.banner.promotions'), value: 4 },
  { label: t('component.banner.alliance_center'), value: 5 },
];

export function useRegisterbannerjumpTo() {
  const { t } = useI18n();
  const bannerjumpTo = [
    { label: t('component.banner.custom'), value: 1 },
    { label: t('component.banner.entertainment_city'), value: 2 },
    { label: t('component.banner.physical_education'), value: 3 },
    { label: t('component.banner.physical_education_Fresh_storage'), value: 4 },
    { label: t('component.banner.physical_education_vip'), value: 5 },
    { label: t('component.banner.physical_vip_rebate'), value: 10 },
    { label: t('component.banner.alliance_center'), value: 6 },
    { label: t('component.banner.promotions'), value: 7 },
    { label: t('component.banner.promotions_kf'), value: 8 },
    { label: t('component.banner.deposit_page_deposit'), value: 9 },
    { label: t('component.banner.banner1'), value: 11 },
    { label: t('component.banner.banner2'), value: 12 },
    { label: t('component.banner.banner3'), value: 13 },
    { label: t('common.banner14'), value: 14 },
    { label: t('common.banner15'), value: 15 },
  ].sort((a, b) => b.value - a.value);
  return { bannerjumpTo };
}

// 站点id
export const SiteId = '1';

// 发送人群
export function useMemberOptions() {
  const { t } = useI18n();
  const memberOptions = [
    { label: t('table.system.system_all_members'), value: 1 }, //全部会员
    { label: t('table.system.system_designated_member'), value: 2 }, //指定会员
    { label: t('business.common_member_level'), value: 3 }, //全部会员
    { label: t('table.system.system_vip_level'), value: 4 }, //会员层级
    { label: t('table.system.system_designated_agent'), value: 5 }, //指定代理
    { label: t('table.system.system_all_agent'), value: 6 }, //全部代理
  ];
  return { memberOptions };
}

export function useMemberOptionsNew() {
  const { t } = useI18n();
  const memberOptions = [
    { label: t('table.system.system_all_members'), value: 1 }, //全部会员
    { label: t('business.common_member_level'), value: 3 }, //全部会员
    { label: t('table.system.system_vip_level'), value: 4 }, //会员层级
    { label: t('table.system.system_designated_agent'), value: 5 }, //指定代理
    // { label: t('table.system.system_designated_agent_all'), value: 6 }, //指定代理
  ];
  return { memberOptions };
}

export function useMemberOptionsMap() {
  const { t } = useI18n();
  const memberOptionsMap = {
    1: t('table.system.system_all_members'),
    2: t('table.system.system_designated_member'),
    3: t('business.common_member_level'),
    4: t('table.system.system_vip_level'),
    5: t('table.system.system_designated_agent'),
    6: t('table.system.system_all_agent'),
  };
  return { memberOptionsMap };
}

export function useMonthRoiOptions() {
  const { t } = useI18n();
  const monthRoiOptions = [
    { label: t('business.common_all'), value: 0 },
    { label: t('common.no_started'), value: 3 },
    { label: t('business.progress'), value: 2 },
    { label: t('common.ended'), value: 1 },
  ];
  return { monthRoiOptions };
}

export function useActiveOptions() {
  const { t } = useI18n();
  const activeOptions = [
    { label: t('v.discount.activity.type_1'), value: 1 },
    { label: t('v.discount.activity.type_charge'), value: 2 },
    { label: t('modalForm.member.member_coding'), value: 3 },
    { label: t('v.discount.activity.customize'), value: 4 },
  ];
  return { activeOptions };
}

export function useActiveTyOptions() {
  const { t } = useI18n();
  const activeTyOptions = [
    { label: t('v.discount.activity.type_turntable'), value: 1 },
    { label: t('v.discount.activity.type_promotion'), value: 2 },
    { label: t('v.discount.activity.type_envelope'), value: 3 },
    { label: t('v.discount.activity.type_repay'), value: 4 },
    { label: t('v.discount.activity.every_bet'), value: 6 },
    { label: t('v.discount.activity.lucky_bet'), value: 7 },
    { label: t('v.discount.activity.type_charge'), value: 8 },
    { label: t('v.discount.activity.check_in'), value: 9 },
    { label: t('v.discount.activity.agent_days_reward'), value: 10 },
    { label: t('v.discount.activity.agent_months_reward'), value: 11 },
    { label: t('v.discount.activity.member_8'), value: 12 },
    { label: t('v.discount.activity.member_13'), value: 13 },
    { label: t('v.discount.activity.member_15'), value: 15 },
    { label: t('v.discount.activity.member_14'), value: 14 },
    { label: t('v.discount.activity.customize'), value: 5 },
  ];
  return { activeTyOptions };
}

export function useActiveMainOptions() {
  const { t } = useI18n();
  const activityMainMap: any = {
    1: [
      { label: t('v.discount.activity.type_turntable'), value: 1 },
      { label: t('v.discount.activity.type_promotion'), value: 2 },
      { label: t('v.discount.activity.type_envelope'), value: 3 },
      { label: t('v.discount.activity.type_repay'), value: 4 },
      { label: t('v.discount.activity.check_in'), value: 9 },
      { label: t('v.discount.activity.member_8'), value: 12 },
      { label: t('v.discount.activity.member_15'), value: 15 },
      { label: t('v.discount.activity.agent_days_reward'), value: 10 },
      { label: t('v.discount.activity.agent_months_reward'), value: 11 },
      { label: t('common.ty16'), value: 16 },
      // { label: t('common.ty17'), value: 17 },
      { label: t('v.discount.activity.invite_friends'), value: 18 },
    ],
    2: [
      { label: t('v.discount.activity.first_deposit_amount'), value: 10001 },
      { label: t('v.discount.activity.total_deposit_amount'), value: 10002 },
      { label: t('v.discount.activity.Topup_text3'), value: 10003 },
      { label: t('v.discount.activity.member_13'), value: 13 },
      { label: t('v.discount.activity.member_14'), value: 14 },
    ],
    3: [
      { label: t('v.discount.activity.every_bet'), value: 6 },
      { label: t('v.discount.activity.lucky_bet'), value: 7 },
    ],
    4: [{ label: t('v.discount.activity.customize'), value: 5 }],
  };

  return { activityMainMap };
}

export function useActiveOptionsTy() {
  const { t } = useI18n();
  const activeOptionsTy = [
    { label: t('v.discount.activity.ty_1'), value: 1 },
    { label: t('v.discount.activity.customize'), value: 2 },
  ];
  return { activeOptionsTy };
}

export function useSportStatusOptions() {
  const { t } = useI18n();
  const sportsStatusOptions = [
    { label: t('business.common_all'), value: 0 },
    { label: t('common.no_started'), value: 1 },
    { label: t('business.progress'), value: 2 },
    { label: t('common.sport9'), value: 3 },
    { label: t('common.status_c1'), value: 4 },
  ];
  return { sportsStatusOptions };
}

export function useSmsCodeOptions() {
  const { t } = useI18n();
  const smsCodeOptions = [
    { label: t('business.common_all'), value: 0 },
    { label: t('common.picture8'), value: 1 },
    { label: t('common.phone_verify'), value: 2 },
    { label: t('modalForm.system.system_email_verification'), value: 3 },
    { label: t('common.picture9'), value: 4 },
  ];
  return { smsCodeOptions };
}

export const stateSportColor = {
  0: COLORS.SUCCESS,
  1: COLORS.DISABLED,
  2: COLORS.ERROR,
  3: COLORS.WARNING,
  4: COLORS.ERROR,
  5: COLORS.SUCCESS,
};
