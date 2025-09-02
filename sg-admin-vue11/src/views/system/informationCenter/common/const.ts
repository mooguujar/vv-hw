import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const clientOptions = ['H5', 'Android', 'IOS'];

export const stateOptions = [
  { label: t('business.common_show'), value: 1 },
  { label: t('business.common_hidden'), value: 2 },
];

// 弹跳位置
export function usePositionOptions() {
  const { t } = useI18n();
  const positionOptions = [
    { label: t('table.system.system_no_limit'), value: 1 },
    { label: t('table.system.system_before_login'), value: 2 },
    { label: t('table.system.system_after_login'), value: 3 },
  ];
  return { positionOptions };
}
// 弹跳频率
export function useFrequencyOptions() {
  const { t } = useI18n();
  const frequencyOptions = [
    { label: t('table.system.system_no_limit'), value: 1 },
    { label: t('business.banner_customer_defined'), value: 2 },
  ];
  return { frequencyOptions };
}

// 弹窗内容
export function useContentOptions() {
  const { t } = useI18n();
  const contentOptions = [
    { label: t('common.text'), value: 1 },
    { label: t('common.pic'), value: 2 },
  ];
  return { contentOptions };
}
