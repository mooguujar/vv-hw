import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const changeOptions = [
  { label: t('table.member.memer_auto_upgrade'), value: 818 },
  { label: t('table.member.memer_auto_downgrade'), value: 2 },
  { label: t('table.member.memer_backend_adjust'), value: 0 },
  { label: t('table.member.memer_manual_adjust'), value: 3 },
];
