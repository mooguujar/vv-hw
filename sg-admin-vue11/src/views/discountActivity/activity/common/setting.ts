import axios from 'axios';
import imagesMap from '/@/assets/images/images';
import { useMemberOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const { memberOptions } = useMemberOptions();

const ipLocation = async (value) => {
  if (!value) {
    console.error('value 为空，终止所有请求');
    return;
  }
  try {
    const response = await axios.get(`https://ipapi.co/${value}/json/`);
    return response.data;
  } catch (error) {
    console.error('请求ip归属地失败', error);
    throw error;
  }
};

export default ipLocation;
export const popColorTabs = ['rgb(99 161 3)', 'rgb(140 150 159)'];
export function getPopIconTabs() {
  // 弹窗图标
  const popIconTabs: TabItem[] = [
    {
      label: t('common.translate.word1'),
      value: '1',
      list: Array.from({ length: 6 }, (_, i) => imagesMap[`bulletin-1_${i + 1}`]),
      identifier: 'bulletin-1_',
    },
  ];
  return popIconTabs;
}
interface TabItem {
  label: string;
  value: number | string;
  list: Array<string>;
  identifier: string;
}

export function useReviewState() {
  const { t } = useI18n();

  const reviewStateAar = [
    { label: t('business.common_all'), value: 0 },
    { label: t('business.common_pending_approval'), value: 1 },
    { label: t('business.common_pending_approval_suceess'), value: 2 },
    { label: t('business.common_pending_approval_reject'), value: 3 },
  ];
  const reviewStateMap = {
    0: '-',
    1: t('business.common_pending_approval'),
    2: t('business.common_pending_approval_suceess'),
    3: t('business.common_pending_approval_reject'),
  };

  return { reviewStateAar, reviewStateMap };
}

export function useAgentreviewState() {
  const { t } = useI18n();

  const agentreviewStateArr = [
    { label: t('business.common_all'), value: 0 },
    { label: t('business.common_pending_approval'), value: 1 },
    // { label: t('business.common_pending_approval_have'), value: 2 },
    { label: t('business.common_suceess'), value: 3 },
    // { label: t('business.common_pending_wait_Received'), value: 4 },
    { label: t('business.common_reject'), value: 5 },
  ];
  const agentreviewStateMap = {
    0: '-',
    1: t('business.common_pending_approval'),
    2: t('business.common_pending_approval_have'),
    3: t('business.common_pending_approval_Received'),
    4: t('business.common_pending_wait_Received'),
    5: t('business.common_pending_approval_reject'),
  };

  return { agentreviewStateArr, agentreviewStateMap };
}

export function useRprofitStateState() {
  const { t } = useI18n();
  const rprofittreviewStateArr = [
    { label: t('business.common_all'), value: 0 },
    { label: t('business.common_pending_approval'), value: 1 },
    { label: t('business.common_pending_approval_suceess'), value: 3 },
    { label: t('business.common_pending_approval_reject'), value: 4 },
  ];
  const rprofitreviewStateMap = {
    0: '-',
    1: t('business.common_pending_approval'),
    6: t('business.common_pending_application'),
    2: t('business.common_pending_approval_have'),
    3: t('business.common_pending_approval_suceess'),
    4: t('business.common_pending_wait_Received'),
    5: t('business.common_pending_approval_reject'),
  };

  return { rprofittreviewStateArr, rprofitreviewStateMap };
}

export const reviewState = {
  0: '-',
  1: t('business.common_pending_approval'),
  2: t('business.common_pending_approval_suceess'),
  3: t('business.common_pending_approval_reject'),
};
/** 推广活动的状态 */
export const agentreviewState = {
  0: '-',
  1: t('business.common_pending_approval'),
  2: t('business.common_pending_approval_have'),
  3: t('business.common_pending_approval_suceess'),
  4: t('business.common_pending_wait_Received'),
  5: t('business.common_pending_approval_reject'),
};

export const rprofitState = {
  0: '-',
  1: t('business.common_pending_approval'),
  2: t('business.common_pending_wait_Received'),
  3: t('business.common_pending_approval_suceess'),
  4: t('business.common_pending_approval_reject'),
  5: t('business.Expired'),
  6: t('business.common_pending_application'),
};

export const rprofitcolorMap = {
  1: '#f59a23',
  2: '#63a103',
  3: '#63a103',
  4: '#d9001b',
  5: '#d9001b',
  6: '#63a103',
};

export const agentcolorMap = {
  1: '#f59a23',
  2: '#63a103',
  3: '#63a103',
  4: '#d9001b',
  5: '#d9001b',
};

export const colorMap = {
  1: '#f59a23',
  2: '#63a103',
  3: '#d9001b',
};

export const langArr = [
  {
    label: t('common.common_zh_CN'),
    value: 'zh_CN',
  },
  {
    label: t('common.common_en_US'),
    value: 'en_US',
  },
  {
    label: t('common.common_vi_VN'),
    value: 'vi_VN',
  },
  {
    label: t('common.common_th_TH'),
    value: 'th_TH',
  },
  {
    label: t('common.common_pt_BR'),
    value: 'pt_BR',
  },
  {
    label: t('common.common_hi_IN'),
    value: 'hi_IN',
  },
  {
    label: t('common.common_tl_PH'),
    value: 'tl_PH',
  },
  {
    label: t('common.common_ko_KR'),
    value: 'ko_KR',
  },
];

export const periodList = [
  {
    label: t('v.discount.activity.three_day'),
    value: 259200,
  },
  {
    label: t('v.discount.activity.serven_day'),
    value: 604800,
  },
  {
    label: t('v.discount.activity.Topup_text6'),
    value: 0,
  },
  {
    label: t('table.discountActivity.discount_custom'),
    value: 5,
  },
];

export const cycle = [
  {
    label: t('common.day'),
    value: 'daily',
  },
  {
    label: t('common.week'),
    value: 'weekly',
  },
  {
    label: t('common.month'),
    value: 'monthly',
  },
];

export const cycleBs = [
  {
    label: t('common.week'),
    value: 1,
  },
  {
    label: t('common.month'),
    value: 2,
  },
];

export const daily = [
  {
    label: t('table.promotion.next_day'),
    value: 1,
  },
  {
    label: t('table.promotion.same_day'),
    value: 0,
  },
];

export const weekly = [
  {
    label: t('table.promotion.week1'),
    value: 1,
  },
  {
    label: t('table.promotion.week2'),
    value: 2,
  },
  {
    label: t('table.promotion.week3'),
    value: 3,
  },
  {
    label: t('table.promotion.week4'),
    value: 4,
  },
  {
    label: t('table.promotion.week5'),
    value: 5,
  },
  {
    label: t('table.promotion.week6'),
    value: 6,
  },
  {
    label: t('table.promotion.week7'),
    value: 7,
  },
];
export const mweekly = [
  {
    label: t('common.mon'),
    value: 1,
  },
  {
    label: t('common.tue'),
    value: 2,
  },
  {
    label: t('common.wed'),
    value: 3,
  },
  {
    label: t('common.thu'),
    value: 4,
  },
  {
    label: t('common.fri'),
    value: 5,
  },
  {
    label: t('common.sat'),
    value: 6,
  },
  {
    label: t('common.sun'),
    value: 7,
  },
];
/**
 * 有用
 */
export const evenyWeekly = [
  {
    label: t('table.promotion.eveny_week1'),
    value: 1,
  },
  {
    label: t('table.promotion.eveny_week2'),
    value: 2,
  },
  {
    label: t('table.promotion.eveny_week3'),
    value: 3,
  },
  {
    label: t('table.promotion.eveny_week4'),
    value: 4,
  },
  {
    label: t('table.promotion.eveny_week5'),
    value: 5,
  },
  {
    label: t('table.promotion.eveny_week6'),
    value: 6,
  },
  {
    label: t('table.promotion.eveny_week7'),
    value: 7,
  },
];
export const monthly = [
  {
    label: t('table.promotion.month_day1'),
    value: 1,
  },
  {
    label: t('table.promotion.month_day2'),
    value: 2,
  },
  {
    label: t('table.promotion.month_day3'),
    value: 3,
  },
  {
    label: t('table.promotion.month_day4'),
    value: 4,
  },
  {
    label: t('table.promotion.month_day5'),
    value: 5,
  },
  {
    label: t('table.promotion.month_day6'),
    value: 6,
  },
  {
    label: t('table.promotion.month_day7'),
    value: 7,
  },
  {
    label: t('table.promotion.month_day8'),
    value: 8,
  },
  {
    label: t('table.promotion.month_day9'),
    value: 9,
  },
  {
    label: t('table.promotion.month_day10'),
    value: 10,
  },
  {
    label: t('table.promotion.month_day11'),
    value: 11,
  },
  {
    label: t('table.promotion.month_day12'),
    value: 12,
  },
  {
    label: t('table.promotion.month_day13'),
    value: 13,
  },
  {
    label: t('table.promotion.month_day14'),
    value: 14,
  },
  {
    label: t('table.promotion.month_day15'),
    value: 15,
  },
  {
    label: t('table.promotion.month_day16'),
    value: 16,
  },
  {
    label: t('table.promotion.month_day17'),
    value: 17,
  },
  {
    label: t('table.promotion.month_day18'),
    value: 18,
  },
  {
    label: t('table.promotion.month_day19'),
    value: 19,
  },
  {
    label: t('table.promotion.month_day20'),
    value: 20,
  },
  {
    label: t('table.promotion.month_day21'),
    value: 21,
  },
  {
    label: t('table.promotion.month_day22'),
    value: 22,
  },
  {
    label: t('table.promotion.month_day23'),
    value: 23,
  },
  {
    label: t('table.promotion.month_day24'),
    value: 24,
  },
  {
    label: t('table.promotion.month_day25'),
    value: 25,
  },
  {
    label: t('table.promotion.month_day26'),
    value: 26,
  },
  {
    label: t('table.promotion.month_day27'),
    value: 27,
  },
  {
    label: t('table.promotion.month_day28'),
    value: 28,
  },
  {
    label: t('table.promotion.month_day29'),
    value: 29,
  },
  {
    label: t('table.promotion.month_day30'),
    value: 30,
  },
  {
    label: t('table.promotion.month_day31'),
    value: 31,
  },
];

export const reward_type = [
  {
    label: t('common.active_text10'),
    value: 'recharge',
  },
  {
    label: t('common.active_text11'),
    value: 'loss',
  },
  {
    label: t('common.active_text12'),
    value: 'valid_bet',
  },
];

export const periodListBilling = [
  {
    label: t('v.discount.activity.serven_day'),
    value: 604800,
  },
  {
    label: t('common.translate.word2'),
    value: 1296000,
  },
  {
    label: t('common.translate.word3'),
    value: 2592000,
  },
  {
    label: t('v.discount.activity.type_custom'),
    value: 5,
  },
];

export const activeType = {
  1: t('v.discount.activity.type_turntable'),
  2: t('v.discount.activity.type_promotion'),
  3: t('v.discount.activity.type_envelope'),
  4: t('v.discount.activity.type_repay'),
  5: t('v.discount.activity.customize'),
  6: t('v.discount.activity.every_bet'),
  7: t('v.discount.activity.lucky_bet'),
  8: t('v.discount.activity.type_charge'),
  9: t('v.discount.activity.check_in'),
  10: t('v.discount.activity.agent_days_reward'),
  11: t('v.discount.activity.agent_months_reward'),
  12: t('v.discount.activity.member_8'),
  13: t('v.discount.activity.member_13'),
  14: t('v.discount.activity.member_14'),
  15: t('v.discount.activity.member_15'),
};
export const activeJumpUrl = {
  1: 'weekly-giveaway',
  2: 'invite',
  3: 'dollar-waves',
  4: 'back-cash',
  5: 'customize',
  6: 'betting-rewards',
  7: 'auspicious-award',
  8: 'recharge',
  9: 'signin-rewards',
  10: 'agent-day-reward',
  11: 'agent-month-reward',
  12: 'every-eight',
  13: 'fixed-recharge',
  14: 'wallet-payment-deposit',
  15: 'mystery-box',
  16: 'member-appreciation',
  17: 'mysterious-mine',
  18: 'invite-friends',
};

export function getGroupLabel(group) {
  const d = memberOptions.find((item) => item.value === group);
  return d?.label;
}
