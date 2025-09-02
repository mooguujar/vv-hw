import type { DropMenu } from '../components/Dropdown';
import type { LocaleSetting } from '/#/config';
import type { SelectProps } from 'ant-design-vue';
import { useI18n } from '../hooks/web/useI18n';

export enum LOCALE {
  ZH_CN = 'zh_CN', // 中文
  EN_US = 'en_US', // 英文
  PT_BR = 'pt_BR', // 葡萄牙语
  VI_VN = 'vi_VN', // 越南语
  TH_TH = 'th_TH',
  HI_IN = 'hi_IN',
  TL_PH = 'tl_PH', // 菲律宾语
  KO_KR = 'ko_KR', // 韩语
}

export const LangURL = {
  zh_CN: 'zh',
  en_US: 'en',
  pt_BR: 'pt',
  vi_VN: 'vi',
  th_TH: 'th',
  hi_IN: 'hi',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.ZH_CN,
  // Default locale
  fallback: LOCALE.ZH_CN,
  // available Locales
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
};

// locale list
export function useLocalList() {
  const { t } = useI18n();
  const localeList: DropMenu[] = [
    {
      label: t('common.common_zh_CN'),
      text: t('common.common_zh_CN'),
      country: '中国',
      event: LOCALE.ZH_CN,
      language: 'zh-CN',
    },
    {
      label: t('common.common_en_US'),
      text: t('common.common_en_US'),
      country: '欧美',
      event: LOCALE.EN_US,
      language: 'en',
    },
    {
      label: t('common.common_vi_VN'),
      text: t('common.common_vi_VN'),
      country: '越南',
      event: LOCALE.VI_VN,
      language: 'vi',
    },
    {
      label: t('common.common_pt_BR'),
      text: t('common.common_pt_BR'),
      event: LOCALE.PT_BR,
      country: '巴西',
      language: 'pt',
    },
    {
      label: t('common.common_th_TH'),
      text: t('common.common_th_TH'),
      country: '泰国',
      event: LOCALE.TH_TH,
      language: 'th',
    },
    {
      label: t('common.common_hi_IN'),
      text: t('common.common_hi_IN'),
      country: '印度',
      event: LOCALE.HI_IN,
      language: 'hi',
    },
    {
      label: t('common.common_tl_PH'),
      text: t('common.common_tl_PH'),
      country: '菲律宾',
      event: LOCALE.TL_PH,
      language: 'fil',
    },
    {
      label: t('common.common_ko_KR'),
      text: t('common.common_ko_KR'),
      country: '韩语',
      event: LOCALE.KO_KR,
      language: 'ko',
    },
  ];
  return localeList;
}

export function useLocalLangurage() {
  const { t } = useI18n();
  const localeListLangurage = {
    zh_CN: t('common.common_zh_CN'),
    en_US: t('common.common_en_US'),
    vi_VN: t('common.common_vi_VN'),
    pt_BR: t('common.common_pt_BR'),
    th_TH: t('common.common_th_TH'),
    hi_IN: t('common.common_hi_IN'),
    tl_PH: t('common.common_tl_PH'),
    ko_KR: t('common.common_ko_KR'),
  };
  return localeListLangurage;
}

export enum TIMEZONE {
  ETC = 'Etc/GMT',
  BRT = 'America/Sao_Paulo',
  CST = 'Asia/Shanghai',
  THAILAND = 'Asia/Bangkok',
  ID_ID = 'Asia/Jakarta',
  VIETNAM = 'Asia/Ho_Chi_Minh',
  INDIA = 'Asia/Kolkata',
  USA = 'America/New_York',
  KOREA = 'Asia/Seoul',
  JAPAN = 'Asia/Tokyo',
  PHILIPPINES = 'Asia/Manila', // 添加菲律宾时区
}

export const timezoneList: SelectProps['options'] = [
  { label: '中国 UTC+8', value: TIMEZONE.CST, time_zone: 'zh_CN', time_type: 'zh-CN' },
  { label: '巴西 UTC-3', value: TIMEZONE.BRT, time_zone: 'pt_BR', time_type: 'pt-BR' },
  { label: '越南 UTC+7', value: TIMEZONE.VIETNAM, time_zone: 'vi_VN', time_type: 'vi-VN' },
  { label: '印度 UTC+5:30', value: TIMEZONE.INDIA, time_zone: 'hi_IN', time_type: 'hi-IN' },
  { label: '世界 UTC+0', value: TIMEZONE.ETC, time_zone: 'utc', time_type: 'utc' },
  { label: '美东时间 UTC-4', value: TIMEZONE.USA, time_zone: 'en_US', time_type: 'en-US' },
  { label: '泰国 UTC+7', value: TIMEZONE.THAILAND, time_zone: 'th_TH', time_type: 'th-TH' },
  { label: '日本 UTC+9', value: TIMEZONE.JAPAN, time_zone: 'ja_JP', time_type: 'ja-JP' },
  { label: '韩国 UTC+9', value: TIMEZONE.KOREA, time_zone: 'ko_KR', time_type: 'ko-KR' },
  { label: '印尼 UTC+7', value: TIMEZONE.ID_ID, time_zone: 'in_ID', time_type: 'in-ID' },
  { label: '菲律宾 UTC+8', value: TIMEZONE.PHILIPPINES, time_zone: 'zh_CN', time_type: 'zh-CN' },
];

export function useTimezoneList() {
  const { t } = useI18n();
  const timezoneList: SelectProps['options'] = [
    {
      label: t('common.china'),
      value: TIMEZONE.CST,
      time_zone: 'zh_CN',
      time_type: 'zh-CN',
      currencyID: '701',
    },
    {
      label: t('common.Brazil'),
      value: TIMEZONE.BRT,
      time_zone: 'pt_BR',
      time_type: 'pt-BR',
      currencyID: '702',
    },
    {
      label: t('common.Vietnam'),
      value: TIMEZONE.VIETNAM,
      time_zone: 'vi_VN',
      time_type: 'vi-VN',
      currencyID: '704',
    },
    {
      label: t('common.India'),
      value: TIMEZONE.INDIA,
      time_zone: 'hi_IN',
      time_type: 'hi-IN',
      currencyID: '703',
    },
    {
      label: t('common.Universal'),
      value: TIMEZONE.ETC,
      time_zone: 'utc',
      time_type: 'utc',
      currencyID: '706',
    },
    {
      label: t('common.Eastern'),
      value: TIMEZONE.USA,
      time_zone: 'en_US',
      time_type: 'en-US',
      currencyID: '706',
    },
    {
      label: t('common.Thailand'),
      value: TIMEZONE.THAILAND,
      time_zone: 'th_TH',
      time_type: 'th-TH',
      currencyID: '705',
    },
    {
      label: t('common.Japan'),
      value: TIMEZONE.JAPAN,
      time_zone: 'ja_JP',
      time_type: 'ja-JP',
      currencyID: '711',
    },
    {
      label: t('common.Korea'),
      value: TIMEZONE.KOREA,
      time_zone: 'ko_KR',
      time_type: 'ko-KR',
      currencyID: '733',
    },
    {
      label: t('common.Indonesia'),
      value: TIMEZONE.ID_ID,
      time_zone: 'in_ID',
      time_type: 'in-ID',
      currencyID: '734',
    },
    {
      label: t('common.TLPH'),
      value: TIMEZONE.PHILIPPINES,
      time_zone: 'zh_CN',
      time_type: 'zh-CN',
      currencyID: '735',
    },
  ];
  return timezoneList;
}

export const domainObj = {
  ht: 'https://a79163.com',
  a01: 'https://a01.uat.today',
  win6: 'https://win6.com',
  localhost: 'https://a79163.com',
  ju88: 'https://ju88.app',
  // 正式环境目前没有
  x02: 'https://x02.uat.today',
  v03: 'https://v03.uat.today',
  'v03.uat': 'https://v03.uat.today',
  'x02.uat': 'https://x02.uat.today',
  betbo: 'https://betbo.uat.today',
  betff: 'https://betff.uat.today',
};
