import { useLocaleStoreWithOut } from '../store/modules/locale';
import { useI18n } from '/@/hooks/web/useI18n';

export const SIDE_BAR_MINI_WIDTH = 48;
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80;

// 标签页样式
export enum TabsThemeEnum {
  // 圆滑
  SMOOTH = 'smooth',
  // 卡片
  CARD = 'card',
  // 极简
  SIMPLE = 'simple',
}

export enum ContentEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}

// menu theme enum
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  // 角色权限
  ROLE = 'ROLE',
  // black
  // 后端
  BACK = 'BACK',
  // route mapping
  // 路由映射
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}

// Route switching animation
// 路由切换动画
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export const get_langrageArr = () => {
  const { t } = useI18n();
  // const currentLanguage = useLocaleStoreWithOut();
  // const { getLocale } = currentLanguage;

  const langrageArr = [
    {
      key: 'lan_zh_CN',
      title: 'zh_CN',
      icon: 'CN',
      //active: currentLanguage.getLocale == 'zh_CN',

      language: 'zh_',
      value: 'zh_CN',
      label: t('common.common_zh_CN'),
      disabled: false,
    },
    {
      key: 'lan_en_US',
      title: 'en_US',
      icon: 'US',
      //active: currentLanguage.getLocale == 'en_US',

      language: 'en_',
      value: 'en_US',
      label: t('common.common_en_US'),
      disabled: false,
    },
    {
      key: 'lan_vi_VN',
      title: 'vi_VN',
      icon: 'VN',
      //active: currentLanguage.getLocale == 'vi_VN',

      language: 'vn_',
      value: 'vi_VN',
      label: t('common.common_vi_VN'),
      disabled: false,
    },
    {
      key: 'lan_th_TH',
      title: 'th_TH',
      icon: 'TH',
      //active: currentLanguage.getLocale == 'th_TH',

      language: 'th_',
      value: 'th_TH',
      label: t('common.common_th_TH'),
      disabled: false,
    },
    {
      key: 'lan_pt_BR',
      title: 'pt_BR',
      icon: 'BR',
      //active: currentLanguage.getLocale == 'pt_BR',

      language: 'pt_',
      value: 'pt_BR',
      label: t('common.common_pt_BR'),
      disabled: false,
    },
    {
      key: 'lan_hi_IN',
      title: 'hi_IN',
      icon: 'IN',
      //active: currentLanguage.getLocale == 'hi_IN',

      language: 'hi_',
      value: 'hi_IN',
      label: t('common.common_hi_IN'),
      disabled: false,
    },
    {
      key: 'lan_id_ID',
      title: 'id_ID',
      icon: 'ID',
      //active: currentLanguage.getLocale == 'id_ID',

      language: 'id_',
      value: 'id_ID',
      label: t('common.common_id_ID'),
      disabled: false,
    },
    {
      key: 'lan_ko_KR',
      title: 'ko_KR',
      icon: 'KR',
      //active: currentLanguage.getLocale == 'ko_KR',

      language: 'ko_',
      value: 'ko_KR',
      label: t('common.common_ko_KR'),
      disabled: false,
    },
    {
      key: 'lan_ja_JP',
      title: 'ja_JP',
      icon: 'JP',
      //active: currentLanguage.getLocale == 'ja_JP',

      language: 'ja_',
      value: 'ja_JP',
      label: t('common.common_ja_JP'),
      disabled: false,
    },
  ];
  return langrageArr;
};
