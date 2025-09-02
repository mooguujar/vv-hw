import { useI18n } from '/@/hooks/web/useI18n';

export const clientOptions = ['H5', 'Android', 'IOS'];

export function useStateOptions() {
  const { t } = useI18n();
  const stateOptions = [
    { label: t('business.common_hidden'), value: '1' },
    { label: t('business.common_show'), value: '2' },
  ];
  return { stateOptions };
}
